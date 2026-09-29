import { useQuery } from "@tanstack/react-query";
import { getInviteCode, getMembers } from "./requests";

export const membersKey = ['members'] as const;
export const inviteCodeKey = ['invite-code'] as const;

export function useMembers() {
  return useQuery({ queryKey: membersKey, queryFn: getMembers });
}

export function useInviteCode(enabled: boolean) {
  return useQuery({ queryKey: inviteCodeKey, queryFn: getInviteCode, enabled });
}