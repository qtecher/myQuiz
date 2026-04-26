"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { signInWithPassword, signUpWithPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)

  const resetForm = () => {
    setEmail("")
    setPassword("")
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const { error } = await signInWithPassword(email.trim(), password)
    setBusy(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Signed in")
    resetForm()
    onOpenChange(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const { error } = await signUpWithPassword(email.trim(), password)
    setBusy(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Check your email to confirm your account, if required by your project.")
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>
            Sign in with email and password. Enable the Email provider in Supabase Authentication
            settings if you have not already.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-lg">
            <TabsTrigger value="signin" className="rounded-md">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-md">
              Sign up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="mt-4 space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-email">Email</Label>
                <Input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-password">Password</Label>
                <Input
                  id="auth-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-xl bg-[#211C84] text-white hover:bg-[#211C84]/90"
                disabled={busy}
              >
                Sign in
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup" className="mt-4 space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl"
                  required
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-xl bg-[#211C84] text-white hover:bg-[#211C84]/90"
                disabled={busy}
              >
                Create account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
