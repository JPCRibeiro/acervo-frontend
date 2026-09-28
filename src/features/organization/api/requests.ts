import { api } from '@/lib/api/client';
import type { OrganizationSummary } from '@/types';

export async function getOrganizations() {
  const { data } = await api.get<OrganizationSummary[]>('/api/organizations');
  return data;
}