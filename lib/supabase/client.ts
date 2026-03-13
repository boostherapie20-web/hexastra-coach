import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Pendant le build Vercel les env vars peuvent être absentes.
    // On retourne un client factice qui ne plantera pas au prerender.
    // Les vraies pages sont 'use client' ou force-dynamic, donc ce cas
    // ne se produit qu'au build statique.
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ error: { message: 'Non configuré' } }),
        signInWithOAuth: async () => ({ data: null, error: { message: 'Non configuré' } }),
        signUp: async () => ({ error: { message: 'Non configuré' } }),
        signOut: async () => {},
      },
      from: () => ({
        select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      }),
    } as any
  }

  return createBrowserClient(url, key)
}
