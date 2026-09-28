import {
  useDocuments,
  useUploadDocument,
} from "@/features/documents/api/queries";
import { StatusBadge } from "@/features/documents/components/status-badge";
import { UploadDropzone } from "@/features/documents/components/upload-dropzone";
import { ApiError } from "@/lib/api/errors";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";

function formatSize(bytes: number) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i > 0 && n < 10 ? 1 : 0)} ${units[i]}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function DocumentsPage() {
  const { data: docs, isLoading } = useDocuments();
  const upload = useUploadDocument();
  const [notice, setNotice] = useState<string | null>(null);

  const onFiles = (files: File[]) => {
    setNotice(null);
    files.forEach((file) => upload.mutate(file));
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
      <UploadDropzone
        onFiles={onFiles}
        onRejected={(names) =>
          setNotice(
            `Arquivo(s) acima de 25 MB ignorado(s): ${names.join(", ")}`,
          )
        }
        disabled={upload.isPending}
      />

      {notice && <p className="text-sm text-destructive">{notice}</p>}
      {upload.isError && (
        <p className="text-sm text-destructive">
          {upload.error instanceof ApiError
            ? upload.error.message
            : "Falha no upload"}
        </p>
      )}

      <div className="rounded-xl border border-border bg-card/50">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : !docs || docs.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Nenhum documento ainda. Envie o primeiro acima.
          </div>
        ) : (
          <>
            <div className="border-b border-border px-4 py-3 text-sm font-medium flex flex-row justify-between">
              <div>Documentos</div>
              <div>Status</div>
            </div>
            <ul className="divide-y divide-border">
              {docs.map((d) => (
                <li key={d.id} className="flex items-center gap-3 px-4 py-3">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{d.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(d.fileSizeBytes)} · {formatDate(d.uploadedAt)}
                      {d.status === "READY" && ` · ${d.chunkCount} trechos`}
                    </p>
                    {d.status === "FAILED" && d.failureReason && (
                      <p className="mt-0.5 text-xs text-destructive">
                        {d.failureReason}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={d.status} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
