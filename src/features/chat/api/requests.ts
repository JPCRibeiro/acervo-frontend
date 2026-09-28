import { api } from "@/lib/api/client";
import type { ChatResponse } from "@/types";

export async function ask(question: string) {
  const { data } = await api.post<ChatResponse>('/api/chat', { question });
  return data;
}