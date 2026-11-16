import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../_services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getStoredUser());
  const [loading, setLoading] = useState(() => Boolean(authService.getToken()));

  const clearUser = useCallback(() => {
    authService.clearSession();
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    const token = authService.getToken();
    if (!token) {
      setLoading(false);
      return undefined;
    }

    authService
      .me()
      .then((data) => {
        if (active) setUser(data);
      })
      .catch(() => {
        if (active) clearUser();
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const handleUnauthorized = () => {
      if (active) setUser(null);
    };
    window.addEventListener('booksales:unauthorized', handleUnauthorized);

    return () => {
      active = false;
      window.removeEventListener('booksales:unauthorized', handleUnauthorized);
    };
  }, [clearUser]);

  const login = useCallback(async (payload) => {
    const data = await authService.login(payload);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const data = await authService.updateProfile(payload);
    setUser(data.user);
    return data;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      updateProfile,
      refresh: async () => {
        const data = await authService.me();
        setUser(data);
        return data;
      },
    }),
    [user, loading, login, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }
  return context;
}
