'use client';

import { createContext, useCallback, useContext, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types/user';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const reset = useAuthStore((state) => state.reset);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authApi.me();
      setUser(response.data.data ?? null);
    } catch {
      reset();
    }
  }, [reset, setLoading, setUser]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authApi.login(email, password);
      const loggedInUser = response.data.data?.user as User | undefined;

      if (!loggedInUser) {
        throw new Error('Invalid login response');
      }

      setUser(loggedInUser);
      toast.success('Welcome back!');
    },
    [setUser],
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    reset();
    toast.success('Logged out successfully');
    router.push('/admin/login');
  }, [reset, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
