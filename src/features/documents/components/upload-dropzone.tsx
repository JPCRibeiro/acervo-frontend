import { useRef, useState, type ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

const ACCEPT = '.pdf,.docx,.pptx,.txt,.md,.html';
const MAX_BYTES = 25 * 1024 * 1024;

export function UploadDropzone({
  onFiles,
  onRejected,
  disabled,
}: {
  onFiles: (files: File[]) => void;
  onRejected?: (names: string[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handle = (list: FileList | null) => {
    if (!list) return;
    const all = Array.from(list);
    const ok = all.filter((f) => f.size <= MAX_BYTES);
    const tooBig = all.filter((f) => f.size > MAX_BYTES).map((f) => f.name);
    if (tooBig.length) onRejected?.(tooBig);
    if (ok.length) onFiles(ok);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); if (!disabled) handle(e.dataTransfer.files); }}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`flex cursor-pointer bg-accent/20 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'
      } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
    >
      <Upload className="size-6 text-muted-foreground" />
      <p className="text-sm font-medium">Arraste arquivos ou clique para enviar</p>
      <p className="text-xs text-muted-foreground">PDF, DOCX, PPTX, TXT, MD, HTML · até 25 MB</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT}
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => { handle(e.target.files); e.target.value = ''; }}
      />
    </div>
  );
}