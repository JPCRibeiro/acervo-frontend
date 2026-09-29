import { api } from '@/lib/api/client';
import type { OrganizationSummary } from '@/types';

export async function getOrganizations() {
  const { data } = await api.get<OrganizationSummary[]>('/api/organizations');
  return data;
}

export async function createOrganization(name: string) {
  const { data } = await api.post<OrganizationSummary>('/api/organizations', { name });
  return data;
}

export async function joinOrganization(inviteCode: string) {
  const { data } = await api.post<OrganizationSummary>('/api/organizations/join', { inviteCode });
  return data;
}