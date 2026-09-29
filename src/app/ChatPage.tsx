import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { SendHorizontal, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toApiError } from '@/lib/api/errors';
import type { ChatMessage, ConversationDetail, ConversationMessage, SourceCitation } from '@/types';
import { MessageBubble } from '@/features/chat/components/message-bubble';
import { streamAsk } from '@/features/chat/stream';
import { useLastSources } from '@/store/last-sources';
import { conversationKey, conversationsKey, useConversation } from '@/features/chat/api/queries';
import { useNavigate, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';

const WORD_INTERVAL_MS = 45;

function toChatMessage(m: ConversationMessage): ChatMessage {
  return m.role === 'USER'
    ? { id: m.id, role: 'user', content: m.content }
    : { id: m.id, role: 'assistant', content: m.content, sources: m.sources ?? [] };
}

function buildDetail(id: string, messages: ChatMessage[]): ConversationDetail {
  const now = new Date().toISOString();
  const firstUser = messages.find((m) => m.role === 'user');
  return {
    id,
    title: firstUser ? firstUser.content.slice(0, 60) : 'Nova conversa',
    createdAt: now,
    updatedAt: now,
    messages: messages.map((m) =>
      m.role === 'user'
        ? { id: m.id, role: 'USER', content: m.content, sources: [], createdAt: now }
        : { id: m.id, role: 'ASSISTANT', content: m.content, sources: m.sources, createdAt: now },
    ),
  };
}

export default function ChatPage() {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const rafRef = useRef<number | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);

  const { data: detail, isError } = useConversation(routeId);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // "/" = nova conversa (limpa). /c/:id = hidrata do servidor, exceto se já for a conversa local
  useEffect(() => {
    if (!routeId) {
      abortRef.current?.abort();
      setMessages([]);
      activeIdRef.current = null;
      return;
    }
    if (routeId !== activeIdRef.current && detail) {
      setMessages(detail.messages.map(toChatMessage));
      activeIdRef.current = routeId;
    }
  }, [routeId, detail]);

  // conversa inexistente (ex.: troquei de org enquanto estava nela) -> volta pro início
  useEffect(() => {
    if (routeId && isError) navigate('/', { replace: true });
  }, [routeId, isError, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages, sending]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const patchAssistant = (
    id: string,
    fn: (m: Extract<ChatMessage, { role: 'assistant' }>) => ChatMessage,
  ) => setMessages((prev) => prev.map((m) => (m.id === id && m.role === 'assistant' ? fn(m) : m)));

  const send = async () => {
    const question = input.trim();
    if (!question || sending) return;

    setError(null);
    setInput('');

    const sendToId = activeIdRef.current; // null = inicia conversa nova
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: question },
      { id: assistantId, role: 'assistant', content: '', sources: [] },
    ]);
    setSending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const buffer = { value: '' };
    let fullAnswer = '';
    let finalSources: SourceCitation[] = [];
    let streamDone = false;
    let lastReveal = 0;

    const nextChunk = (): string => {
      const buf = buffer.value;
      if (!buf) return '';
      const start = buf.search(/\S/);
      if (start === -1) {
        if (streamDone) { buffer.value = ''; return buf; }
        return '';
      }
      const spaceAfter = buf.indexOf(' ', start + 1);
      if (spaceAfter === -1) {
        if (!streamDone) return '';
        buffer.value = '';
        return buf;
      }
      const chunk = buf.slice(0, spaceAfter + 1);
      buffer.value = buf.slice(spaceAfter + 1);
      return chunk;
    };

    const pump = (now: number) => {
      if (now - lastReveal >= WORD_INTERVAL_MS) {
        const chunk = nextChunk();
        if (chunk) {
          lastReveal = now;
          patchAssistant(assistantId, (m) => ({ ...m, content: m.content + chunk }));
        }
      }
      if (!streamDone || buffer.value.length > 0) {
        rafRef.current = requestAnimationFrame(pump);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(pump);

    try {
      await streamAsk(
        question,
        {
          onConversationId: (id) => {
            activeIdRef.current = id;
          },
          onToken: (delta) => {
            buffer.value += delta;
            fullAnswer += delta;
          },
          onSources: (sources) => {
            finalSources = sources;
            patchAssistant(assistantId, (m) => ({ ...m, sources }));
            useLastSources.getState().setLastSources(question, sources);
          },
        },
        controller.signal,
        sendToId,
      );
    } catch (err) {
      if (!controller.signal.aborted) setError(toApiError(err).message);
    } finally {
      streamDone = true;
      setSending(false);
      abortRef.current = null;

      const id = activeIdRef.current;
      if (id && !controller.signal.aborted) {
        const finalMessages = messagesRef.current.map((m) =>
          m.id === assistantId && m.role === 'assistant'
            ? { ...m, content: fullAnswer, sources: finalSources }
            : m,
        );
        qc.setQueryData(conversationKey(id), buildDetail(id, finalMessages));
        qc.invalidateQueries({ queryKey: conversationsKey });
        if (!routeId) navigate(`/c/${id}`, { replace: true });
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <h2 className="text-lg font-semibold">Pergunte aos seus documentos</h2>
            <p className="text-sm text-muted-foreground">
              Faça uma pergunta e eu respondo com base nos arquivos da sua organização.
            </p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-border p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mx-auto flex max-w-3xl items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Escreva sua pergunta…"
            className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {sending ? (
            <Button type="button" size="icon" variant="outline" onClick={() => abortRef.current?.abort()}>
              <Square />
            </Button>
          ) : (
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <SendHorizontal />
            </Button>
          )}
        </form>
        {error && <p className="mx-auto mt-2 max-w-3xl text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}