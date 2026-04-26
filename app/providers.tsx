"use client"

import type { ReactNode } from "react"
import { Toaster } from "sonner"
import { SupabaseProvider } from "@/components/supabase-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SupabaseProvider>
      {children}
      <Toaster richColors position="top-center" />
    </SupabaseProvider>
  )
}
