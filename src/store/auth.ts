import { create } from 'zustand';
import { queryClient } from '@/lib/queryClient';
import { decodeAccessToken } from '@/lib/jwt';
import * as authApi from '@/features/auth/api/requests';
import type { Role } from '@/types';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: Status;
  accessToken: string | null;
  userId: string | null;
  organizationId: string | null;
  role: Role | null;

  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (input: authApi.RegisterInput) => Promise<void>;
  join: (input: authApi.JoinInput) => Promise<void>;
  switchOrganization: (organizationId: string) => Promise<void>;
  logout: () => Promise<void>;

  applyToken: (accessToken: string) => void;
  refreshSession: () => Promise<string>;
  clearSession: () => void;
}

let refreshing: Promise<string> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'loading',
  accessToken: null,
  userId: null,
  organizationId: null,
  role: null,

  applyToken: (accessToken) => {
    const claims = decodeAccessToken(accessToken);
    set({
      accessToken,
      userId: claims?.sub ?? null,
      organizationId: claims?.organizationId ?? null,
      role: claims?.role ?? null,
      status: 'authenticated',
    });
  },

  clearSession: () => {
    set({ status: 'unauthenticated', accessToken: null, userId: null, organizationId: null, role: null });
    queryClient.clear();
  },

  bootstrap: async () => {
    try {
      const token = await get().refreshSession();
      get().applyToken(token);
    } catch {
      get().clearSession();
    }
  },

  refreshSession: () => {
    refreshing ??= (async () => {
      try {
        const orgId = get().organizationId;
        const { accessToken } = await authApi.refresh(orgId);
        return accessToken;
      } finally {
        refreshing = null;
      }
    })();
    return refreshing;
  },

  login: async (email, password) => {
    const { accessToken } = await authApi.login(email, password);
    get().applyToken(accessToken);
  },
  register: async (input) => {
    const { accessToken } = await authApi.register(input);
    get().applyToken(accessToken);
  },
  join: async (input) => {
    const { accessToken } = await authApi.join(input);
    get().applyToken(accessToken);
  },

  switchOrganization: async (organizationId) => {
    const { accessToken } = await authApi.switchOrganization(organizationId);
    get().applyToken(accessToken);
    queryClient.clear();
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      get().clearSession();
    }
  },
}));