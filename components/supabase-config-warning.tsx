"use client"

export function SupabaseConfigWarning() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-lg rounded-xl border-2 border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-foreground">Supabase environment</h1>
        <p className="mt-3 text-muted-foreground">
          Copy <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">.env.example</code>{" "}
          to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">.env.local</code> in
          the project root and set{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          and{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          from your Supabase project settings. Then restart{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">npm run dev</code>.
        </p>
      </div>
    </div>
  )
}
