import { useQuery } from '@tanstack/react-query';
import { getConversation, getConversations } from './requests';

export const conversationsKey = ['conversations'] as const;
export const conversationKey = (id: string) => ['conversations', id] as const;

export function useConversations() {
  return useQuery({ queryKey: conversationsKey, queryFn: getConversations });
}

export function useConversation(id: string | undefined) {
  return useQuery({
    queryKey: conversationKey(id ?? 'new'),
    queryFn: () => getConversation(id!),
    enabled: !!id,
  });
}