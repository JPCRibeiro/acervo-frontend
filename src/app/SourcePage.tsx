import { FileText } from 'lucide-react';
import { useLastSources } from '@/store/last-sources';
import { SourceCitations } from '@/features/chat/components/source-citations';

export default function SourcePage() {
  const question = useLastSources((s) => s.question);
  const sources = useLastSources((s) => s.sources);

  if (!question || sources.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
        <FileText className="size-8" />
        <p className="text-sm">Nenhuma fonte ainda.</p>
        <p className="text-xs">Faça uma pergunta no chat e as fontes da resposta aparecem aqui.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
      <div className="rounded-lg border border-border bg-muted/30 p-3">
        <p className="text-xs font-medium text-muted-foreground">Última pergunta</p>
        <p className="mt-1 text-sm">{question}</p>
      </div>
      <SourceCitations sources={sources} />
    </div>
  );
}