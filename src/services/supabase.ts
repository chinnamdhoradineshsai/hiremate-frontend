import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  rawUrl && rawKey && !rawUrl.includes('placeholder')
);

const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder-project.supabase.co';
const supabaseAnonKey = isSupabaseConfigured ? rawKey : 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseSession = async () => {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn('Supabase getSession error:', error.message);
    return null;
  }
  return data.session;
};

export const signInWithGoogle = async () => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase credentials not configured in frontend .env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).");
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
  if (error) throw error;
  return data;
};

