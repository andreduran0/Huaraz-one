
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const env = (import.meta as any).env || {};
  return {
    url: env.VITE_SUPABASE_URL,
    anonKey: env.VITE_SUPABASE_ANON_KEY,
  };
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey || url === 'your_supabase_project_url') {
    return null;
  }

  try {
    supabaseInstance = createClient(url, anonKey);
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    return null;
  }
};

// Export a dummy object for backward compatibility if needed, 
// but it's better to use getSupabase()
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    const instance = getSupabase();
    if (!instance) {
      // Return a dummy function that returns an error-like object for Supabase calls
      return () => ({
        select: () => ({ eq: () => ({ order: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }) }),
        from: () => ({
          select: () => ({
            eq: () => ({
              order: () => ({
                single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
                then: (cb: any) => cb({ data: null, error: new Error('Supabase not configured') })
              }),
              single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
            })
          })
        })
      });
    }
    return (instance as any)[prop];
  }
});

/**
 * SQL SCHEMA FOR SUPABASE:
 * 
 * -- Categories Table
 * CREATE TABLE categories (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   name TEXT NOT NULL,
 *   slug TEXT UNIQUE NOT NULL
 * );
 * 
 * -- Posts Table
 * CREATE TABLE posts (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   title TEXT NOT NULL,
 *   slug TEXT UNIQUE NOT NULL,
 *   excerpt TEXT,
 *   content TEXT,
 *   featured_image TEXT,
 *   author TEXT,
 *   category_id UUID REFERENCES categories(id),
 *   meta_title TEXT,
 *   meta_description TEXT,
 *   published BOOLEAN DEFAULT false,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * -- Businesses Table (Migration Ready)
 * CREATE TABLE businesses (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   name TEXT NOT NULL,
 *   slug TEXT UNIQUE NOT NULL,
 *   description TEXT,
 *   category TEXT,
 *   location TEXT,
 *   is_sponsored BOOLEAN DEFAULT false,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 */
