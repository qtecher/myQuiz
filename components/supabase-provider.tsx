"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Session, SupabaseClient, User } from "@supabase/supabase-js"
import { createSupabaseBrowserClient } from "@/lib/supabaseClient"
import type { Database } from "@/lib/database.types"

type TypedClient = SupabaseClient<Database>

const SupabaseContext = createContext<TypedClient | null>(null)

type AuthState = {
  user: User | null
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthState>({ user: null, session: null, loading: true })

export function useSupabase(): TypedClient | null {
  return useContext(SupabaseContext)
}

export function useAuth(): AuthState & {
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>
  signUpWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
} {
  const base = useContext(AuthContext)
  const client = useContext(SupabaseContext)

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      if (!client) return { error: new Error("Supabase is not configured") }
      const { error } = await client.auth.signInWithPassword({ email, password })
      return { error: error as Error | null }
    },
    [client]
  )

  const signUpWithPassword = useCallback(
    async (email: string, password: string) => {
      if (!client) return { error: new Error("Supabase is not configured") }
      const { error } = await client.auth.signUp({ email, password })
      return { error: error as Error | null }
    },
    [client]
  )

  const signOut = useCallback(async () => {
    if (!client) return
    await client.auth.signOut()
  }, [client])

  return { ...base, signInWithPassword, signUpWithPassword, signOut }
}

function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const client = useMemo<TypedClient | null>(() => {
    if (!hasSupabaseEnv()) return null
    try {
      return createSupabaseBrowserClient()
    } catch {
      return null
    }
  }, [])

  const [auth, setAuth] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  })

  useEffect(() => {
    if (!client) {
      setAuth({ user: null, session: null, loading: false })
      return
    }

    let cancelled = false

    void client.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return
      setAuth({
        user: session?.user ?? null,
        session,
        loading: false,
      })
    })

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setAuth({
        user: session?.user ?? null,
        session,
        loading: false,
      })
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [client])

  const supabaseValue = client

  return (
    <SupabaseContext.Provider value={supabaseValue}>
      <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
    </SupabaseContext.Provider>
  )
}

export function useSupabaseConfigured(): boolean {
  return hasSupabaseEnv() && useSupabase() !== null
}
