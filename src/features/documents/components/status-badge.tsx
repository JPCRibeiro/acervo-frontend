import type { DocumentStatus } from '@/types';
import { AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react';

const config: Record<DocumentStatus, { label: string; className: string; icon: React.ReactNode }> = {
  PENDING:    { label: 'Na fila',     className: 'bg-muted text-muted-foreground',          icon: <Clock className="size-3" /> },
  PROCESSING: { label: 'Processando', className: 'bg-chart-2/15 text-chart-2',              icon: <Loader2 className="size-3 animate-spin" /> },
  READY:      { label: 'Pronto',      className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', icon: <CheckCircle2 className="size-3" /> },
  FAILED:     { label: 'Falhou',      className: 'bg-destructive/15 text-destructive',      icon: <AlertCircle className="size-3" /> },
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${c.className}`}>
      {c.icon}
      {c.label}
    </span>
  );
}