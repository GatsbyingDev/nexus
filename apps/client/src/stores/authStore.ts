import { create } from "zustand";
import type { IUser } from "@nexus/shared/src/types";

interface AuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
  initialize: async () => {
    set({ isLoading: true });

    try {
      const refreshRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include"
      });

      if (!refreshRes.ok) {
        set({ user: null, token: null, isLoading: false });
        return;
      }

      const refreshJson = (await refreshRes.json()) as {
        success: boolean;
        data?: { accessToken: string };
      };

      const nextToken = refreshJson.data?.accessToken ?? null;
      set({ token: nextToken });

      if (!nextToken) {
        set({ user: null, isLoading: false });
        return;
      }

      const meRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${nextToken}`
        }
      });

      if (!meRes.ok) {
        set({ user: null, token: null, isLoading: false });
        return;
      }

      const meJson = (await meRes.json()) as { success: boolean; data?: IUser };

      set({ user: meJson.data ?? null, isLoading: false });
    } catch {
      set({ user: null, token: null, isLoading: false });
    }
  }
}));
