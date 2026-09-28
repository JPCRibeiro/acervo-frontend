import { api } from "@/lib/api/client";
import type { DocumentSummary, IngestionResponse } from "@/types";

export async function getDocuments() {
  const { data } = await api.get<DocumentSummary[]>("/api/documents");
  return data;
}

export async function uploadDocument(file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<IngestionResponse>("/api/documents", form);
  return data;
}
