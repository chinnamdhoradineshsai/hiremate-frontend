import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { apiService } from '../services/api';
import { supabase, signInWithGoogle, isSupabaseConfigured } from '../services/supabase';

export const resolveGoogleUserName = (user: any): string => {
  const meta = user?.user_metadata || {};
  if (typeof meta.full_name === 'string' && meta.full_name.trim()) {
    return meta.full_name.trim();
  }
  if (typeof meta.name === 'string' && meta.name.trim()) {
    return meta.name.trim();
  }
  if (user?.email && typeof user.email === 'string' && user.email.trim()) {
    const localPart = user.email.split('@')[0].trim();
    if (localPart) {
      const derived = localPart.replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      if (derived) return derived;
    }
  }
  return 'Candidate';
};

interface AuthContextType {
  user: UserProfile | null;
  adminUser: UserProfile | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  syncError: string | null;
  loginWithGoogle: () => Promise<void>;
  loginDemo: () => Promise<void>;
  loginAdmin: (u: string, p: string) => Promise<void>;
  logoutAdmin: () => void;
  logout: () => void;
  associateDemoSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [adminUser, setAdminUser] = useState<UserProfile | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if saved admin token exists
    const adminToken = localStorage.getItem('hiremate_admin_token');
    if (adminToken) {
      apiService.setToken(adminToken);
      apiService.getAdminOverview().then(() => {
        setAdminUser({
          id: 'admin_session',
          email: 'dinesh@hiremate.ai',
          name: 'Rayn',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        });
      }).catch(() => {
        localStorage.removeItem('hiremate_admin_token');
      });
    }

    // Supabase Auth listener for OAuth redirects and session changes
    if (isSupabaseConfigured) {
      const syncUserProfile = async (sess: any) => {
        setSyncError(null);
        let profileSaved = false;
        let syncedUser: UserProfile | null = null;
        let lastErrorMsg = '';

        // 1. Try Backend Google Login/Sync API first
        try {
          apiService.setToken(sess.access_token);
          const res = await apiService.googleLogin({ access_token: sess.access_token });
          if (res && res.user && res.user.name) {
            syncedUser = {
              id: res.user.id,
              email: res.user.email,
              name: res.user.name,
              avatar_url: res.user.avatar_url
            };
            profileSaved = true;
          }
        } catch (err: any) {
          lastErrorMsg = err?.message || 'Backend profile sync error';
          console.warn("[Backend Profile Sync Notice]:", lastErrorMsg);
        }

        // 2. Client-side direct Supabase UPSERT fallback if backend sync didn't complete
        if (!profileSaved && sess.user) {
          try {
            const u = sess.user;
            const meta = u.user_metadata || {};
            const resolvedName = resolveGoogleUserName(u);
            const now = new Date().toISOString();
            const profileRow = {
              user_id: u.id, // REAL auth.users.id
              google_user_id: meta.sub || meta.provider_id || `google_${u.id}`,
              email: u.email || '',
              name: resolvedName,
              avatar_url: meta.avatar_url || meta.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              role: 'user',
              updated_at: now,
              last_login: now
            };

            const { data: clientUpsert, error: clientErr } = await supabase
              .from('profiles')
              .upsert(profileRow, { onConflict: 'user_id' })
              .select();

            if (clientErr) {
              lastErrorMsg = clientErr.message;
              console.error("[Profile Synchronization Error] Client-side profile upsert failed:", clientErr.message);
            } else if (clientUpsert && clientUpsert.length > 0) {
              const p = clientUpsert[0];
              syncedUser = {
                id: p.user_id,
                email: p.email,
                name: p.name,
                avatar_url: p.avatar_url
              };
              profileSaved = true;
            }
          } catch (ex: any) {
            lastErrorMsg = ex?.message || 'Client profile sync exception';
            console.error("[Profile Synchronization Error] Client-side profile sync exception:", ex);
          }
        }

        // 3. Handle result & Requirement 12 enforcement
        if (profileSaved && syncedUser) {
          setUser(syncedUser);
          setSyncError(null);
          const demoSessionId = localStorage.getItem('hiremate_demo_session_id');
          if (demoSessionId || localStorage.getItem('hiremate_demo_used') === 'true') {
            apiService.associateDemoSession(demoSessionId || undefined).catch(() => {});
          }
        } else {
          const syncErrMsg = `Profile synchronization error: Failed to save user profile into public.profiles. ${lastErrorMsg}`;
          console.error(syncErrMsg);
          setSyncError(syncErrMsg);
          setUser(null);
        }

        setIsLoading(false);
      };

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          syncUserProfile(session);
        } else {
          setIsLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          syncUserProfile(session);
        } else if (!apiService.getToken() && !adminToken) {
          setUser(null);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      const token = apiService.getToken();
      if (!token && !adminToken) {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setSyncError(null);
    try {
      await signInWithGoogle();
    } catch (e: any) {
      console.error('Google login error:', e);
      setIsLoading(false);
      setSyncError(e?.message || 'Google authentication failed.');
      throw e;
    }
  };

  const loginDemo = async () => {
    window.location.hash = '#demo';
  };

  const loginAdmin = async (u: string, p: string) => {
    setIsLoading(true);
    try {
      const res = await apiService.adminLogin(u, p);
      localStorage.setItem('hiremate_admin_token', res.access_token);
      apiService.setToken(res.access_token);
      setAdminUser(res.user);
    } catch (e) {
      console.error('Admin login error:', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const associateDemoSession = async () => {
    const demoSessionId = localStorage.getItem('hiremate_demo_session_id');
    try {
      await apiService.associateDemoSession(demoSessionId || undefined);
      localStorage.setItem('hiremate_demo_used', 'true');
    } catch (e) {
      console.warn('Associate demo error:', e);
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('hiremate_admin_token');
    setAdminUser(null);
  };

  const logout = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut();
    }
    apiService.clearToken();
    localStorage.removeItem('hiremate_admin_token');
    setUser(null);
    setAdminUser(null);
    setSyncError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      adminUser,
      isAuthenticated: !!user,
      isAdminAuthenticated: !!adminUser,
      isLoading,
      isConfigured: isSupabaseConfigured,
      syncError,
      loginWithGoogle,
      loginDemo,
      loginAdmin,
      logoutAdmin,
      logout,
      associateDemoSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};



