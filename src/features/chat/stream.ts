import { fetchEventSource } from '@microsoft/fetch-event-source';
import { BASE_URL } from '@/lib/api/client';
import { useAuthStore } from '@/store/auth';
import type { ChatStreamResponse, SourceCitation } from '@/types';

class StreamHttpError extends Error {
  status: number;
  constructor(status: number) {
    super(`stream http ${status}`);
    this.status = status;
  }
}

interface StreamHandlers {
  onToken: (delta: string) => void;
  onSources: (sources: SourceCitation[]) => void;
}

async function openStream(
  question: string,
  token: string | null,
  handlers: StreamHandlers,
  signal: AbortSignal,
) {
  await fetchEventSource(`${BASE_URL}/api/chat/stream`, {
    method: 'POST',
    credentials: 'include',
    signal,
    openWhenHidden: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ question }),
    async onopen(res) {
      const ct = res.headers.get('content-type') ?? '';
      if (res.ok && ct.includes('text/event-stream')) return;
      throw new StreamHttpError(res.status);
    },
    onmessage(ev) {
      if (!ev.data) return;
      const chunk = JSON.parse(ev.data) as ChatStreamResponse;
      if (chunk.sources) handlers.onSources(chunk.sources);
      if (chunk.textDelta) handlers.onToken(chunk.textDelta);
    },
    onerror(err) {
      throw err;
    },
  });
}

export async function streamAsk(
  question: string,
  handlers: StreamHandlers,
  signal: AbortSignal,
) {
  const token = useAuthStore.getState().accessToken;
  try {
    await openStream(question, token, handlers, signal);
  } catch (err) {
    if (err instanceof StreamHttpError && err.status === 401) {
      const fresh = await useAuthStore.getState().refreshSession();
      useAuthStore.getState().applyToken(fresh);
      await openStream(question, fresh, handlers, signal);
    } else {
      throw err;
    }
  }
}