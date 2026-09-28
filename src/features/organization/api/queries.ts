import { useQuery } from "@tanstack/react-query";
import { getOrganizations } from "./requests";

export const organizationsKey = ["organizations"] as const;

export function useOrganizations() {
  return useQuery({ queryKey: organizationsKey, queryFn: getOrganizations });
}
