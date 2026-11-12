import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get credentials from environment or localStorage override
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const localUrl = localStorage.getItem('deen_supabase_url') || '';
  const localKey = localStorage.getItem('deen_supabase_key') || '';

  const url = localUrl.trim() || envUrl.trim();
  const key = localKey.trim() || envKey.trim();

  const isConfigured = Boolean(url && key && url.startsWith('http') && key.length > 10);
  return { url, key, isConfigured };
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!clientInstance) {
    try {
      clientInstance = createClient(url, key);
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return clientInstance;
};

export const resetSupabaseClient = () => {
  clientInstance = null;
};
