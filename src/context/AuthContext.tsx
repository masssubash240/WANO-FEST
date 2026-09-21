import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  provider: 'google' | 'email' | 'supabase';
}

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  isLoading: true,
  login: () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

/** Convert a Supabase User object to our AuthUser shape */
const toAuthUser = (u: User): AuthUser => ({
  id: u.id,
  name:
    u.user_metadata?.full_name ||
    u.user_metadata?.name ||
    u.email?.split('@')[0] ||
    'Pirate',
  email: u.email || '',
  picture: u.user_metadata?.avatar_url || u.user_metadata?.picture,
  provider: (u.app_metadata?.provider as AuthUser['provider']) || 'supabase',
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load existing session on mount
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setSession(data.session);
        setUser(toAuthUser(data.session.user));
      } else {
        const local = localStorage.getItem('ssrec_auth_user');
        if (local) {
          try {
            setUser(JSON.parse(local));
          } catch {}
        }
      }
      setIsLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        setUser(toAuthUser(s.user));
      } else {
        const local = localStorage.getItem('ssrec_auth_user');
        if (local) {
          try {
            setUser(JSON.parse(local));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => { listener.subscription.unsubscribe(); };
  }, []);

  /** Manually set user */
  const login = useCallback((u: AuthUser) => {
    setUser(u);
    try {
      localStorage.setItem('ssrec_auth_user', JSON.stringify(u));
    } catch {}
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut().catch(() => {});
    try {
      localStorage.removeItem('ssrec_auth_user');
    } catch {}
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
