import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrganization, getOrganizations, joinOrganization } from "./requests";

export const organizationsKey = ["organizations"] as const;

export function useOrganizations() {
  return useQuery({ queryKey: organizationsKey, queryFn: getOrganizations });
}

export function useCreateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => qc.invalidateQueries({ queryKey: organizationsKey }),
  });
}

export function useJoinOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: joinOrganization,
    onSuccess: () => qc.invalidateQueries({ queryKey: organizationsKey }),
  });
}