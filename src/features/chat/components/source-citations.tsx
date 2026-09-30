import { api } from '@/lib/api/client';
import type { SourceCitation } from '@/types';
import { ExternalLink, FileText } from 'lucide-react';

export function SourceCitations({ sources }: { sources: SourceCitation[] }) {
  if (sources.length === 0) return null;

  const openDocument = async (e: React.MouseEvent, documentId: string) => {
    e.preventDefault();
    const tab = window.open('about:blank', '_blank');
    if (!tab) return;
    try {
      const { data } = await api.get<{ url: string }>(`/api/documents/${documentId}/url`);
      tab.location.href = data.url;
    } catch {
      tab.close();
    }
  };

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Fontes</p>
      {sources.map((s) => (
        <div key={s.documentId} className="rounded-lg border border-border bg-card/50 p-3">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            <a
              href="#"
              onClick={(e) => openDocument(e, s.documentId)}
              className="inline-flex cursor-pointer items-center gap-1 font-medium hover:underline"
            >
              {s.fileName}
              <ExternalLink className="size-3" />
            </a>
          </div>
          <ul className="mt-2 space-y-1">
            {s.snippets.map((sn, i) => (
              <li key={i} className="border-l-2 border-border pl-2 text-xs text-muted-foreground line-clamp-3">
                {sn.page != null && <span className="mr-1 font-medium">p.{sn.page}</span>}
                {sn.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}