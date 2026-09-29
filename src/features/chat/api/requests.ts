import { api } from '@/lib/api/client';
import type { ConversationDetail, ConversationSummary } from '@/types';

export async function getConversations(): Promise<ConversationSummary[]> {
  const { data } = await api.get<ConversationSummary[]>('/api/conversations');
  return data;
}

export async function getConversation(id: string): Promise<ConversationDetail> {
  const { data } = await api.get<ConversationDetail>(`/api/conversations/${id}`);
  return data;
}