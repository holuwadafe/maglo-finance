import { create } from "zustand";
import { Models } from "appwrite";
import { account } from "@/lib/appwrite";

interface AuthStore {
  user: Models.User<Models.Preferences> | any;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: Models.User<Models.Preferences> | any | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) =>
    set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  checkAuth: async () => {
    try {
      const user = await account.get();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  logout: async () => {
    try {
      await account.deleteSession("current");
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
}));

