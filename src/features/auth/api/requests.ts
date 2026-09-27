import { api, publicApi } from "@/lib/api/client";
import type { AccessTokenResponse } from "@/types";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  organizationName: string;
};
export type JoinInput = {
  name: string;
  email: string;
  password: string;
  inviteCode: string;
};

export async function login(email: string, password: string) {
  const { data } = await publicApi.post<AccessTokenResponse>(
    "/api/auth/login",
    { email, password },
  );
  return data;
}

export async function register(input: RegisterInput) {
  const { data } = await publicApi.post<AccessTokenResponse>(
    "/api/auth/register",
    input,
  );
  return data;
}

export async function join(input: JoinInput) {
  const { data } = await publicApi.post<AccessTokenResponse>(
    "/api/auth/join",
    input,
  );
  return data;
}

export async function refresh(organizationId: string | null) {
  const body = organizationId ? { organizationId } : undefined;
  const { data } = await publicApi.post<AccessTokenResponse>(
    "/api/auth/refresh",
    body,
  );
  return data;
}

export async function switchOrganization(organizationId: string) {
  const { data } = await api.post<AccessTokenResponse>(
    "/api/auth/switch-organization",
    { organizationId },
  );
  return data;
}

export async function logout() {
  await publicApi.post("/api/auth/logout");
}