import { api } from "@/lib/api/client";
import type { InviteCode, Member } from "@/types";

export async function getMembers() {
  const { data } = await api.get<Member[]>('/api/members');
  return data;
}

export async function getInviteCode() {
  const { data } = await api.get<InviteCode>('/api/organizations/invite-code');
  return data;
}