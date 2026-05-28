import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'))

const nullResponse = { data: null, error: null, count: null }

function createNoopQueryBuilder(): any {
  const qb = new Proxy(
    async () => nullResponse,
    {
      get(target, key: string) {
        if (key === 'then') {
          return (resolve: any, reject: any) => target().then(resolve, reject)
        }
        if (key === 'catch') {
          return (reject: any) => target().catch(reject)
        }
        if (key === 'finally') {
          return (handler: any) => target().finally(handler)
        }
        if (key === 'single') return () => qb
        if (key === 'order') return () => qb
        if (key === 'eq') return () => qb
        if (key === 'select') return () => qb
        if (key === 'insert') return () => qb
        if (key === 'update') return () => qb
        if (key === 'delete') return () => qb
        if (key === 'maybeSingle') return () => qb
        if (key === 'limit') return () => qb
        if (key === 'range') return () => qb
        if (key === 'abortSignal') return () => qb
        if (key === 'filter') return () => qb
        if (key === 'or') return () => qb
        if (key === 'contains') return () => qb
        if (key === 'textSearch') return () => qb
        if (key === 'not') return () => qb
        if (key === 'match') return () => qb
        if (key === 'gte') return () => qb
        if (key === 'lte') return () => qb
        if (key === 'gt') return () => qb
        if (key === 'lt') return () => qb
        if (key === 'neq') return () => qb
        if (key === 'is') return () => qb
        if (key === 'in') return () => qb
        if (key === 'csv') return () => qb
        if (key === 'returns') return () => qb
        if (key === 'throwOnError') return () => qb
        return undefined
      },
    }
  )
  return qb
}

const authNoop = {
  signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
  signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
  signOut: async () => nullResponse,
  getUser: async () => ({ data: { user: null }, error: null }),
  getSession: async () => ({ data: { session: null }, error: null }),
  onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  resetPasswordForEmail: async () => nullResponse,
  updateUser: async () => nullResponse,
  exchangeCodeForSession: async () => nullResponse,
  verifyOtp: async () => nullResponse,
  refreshSession: async () => nullResponse,
  signInWithOAuth: async () => nullResponse,
  signInWithOtp: async () => nullResponse,
  signInAnonymously: async () => nullResponse,
  reauthenticate: async () => nullResponse,
  admin: {},
}

const storageNoop = {
  from: () => ({
    upload: async () => nullResponse,
    download: async () => nullResponse,
    list: async () => nullResponse,
    remove: async () => nullResponse,
    getPublicUrl: () => ({ data: { publicUrl: '' } }),
    createSignedUrl: async () => nullResponse,
  }),
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => createNoopQueryBuilder(),
      auth: authNoop,
      storage: storageNoop,
      rpc: async () => nullResponse,
      channel: () => ({
        on: () => ({ subscribe: () => {} }),
        subscribe: () => {},
      }),
      functions: {
        invoke: async () => nullResponse,
      },
      realtime: {
        channel: () => ({
          on: () => ({ subscribe: () => {} }),
          subscribe: () => {},
        }),
      },
    }
