import { api } from '@/lib/api/client';
import type { UserProfile } from '@/types';

export async function getMe() {
  const { data } = await api.get<UserProfile>('/api/users/me');
  return data;
}