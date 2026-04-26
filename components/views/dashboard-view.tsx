"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import { Plus, BookOpen, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FolderCard } from "@/components/folder-card"
import { CreateFolderModal } from "@/components/create-folder-modal"
import { PageTransition } from "@/components/page-transition"
import { Spinner } from "@/components/ui/spinner"
import type { Folder } from "@/lib/types"

interface DashboardViewProps {
  folders: Folder[]
  foldersLoading?: boolean
  user: User | null
  onSelectFolder: (folder: Folder) => void
  onCreateFolder: (name: string) => void | Promise<void>
  onOpenAuth: () => void
  onSignOut: () => void
}

export function DashboardView({
  folders,
  foldersLoading,
  user,
  onSelectFolder,
  onCreateFolder,
  onOpenAuth,
  onSignOut,
}: DashboardViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <PageTransition className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#211C84] p-3">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">QuizCard</h1>
              <p className="text-muted-foreground">Master your knowledge with flashcards</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {user ? (
              <>
                <span className="max-w-[200px] truncate text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSignOut}
                  className="gap-2 rounded-xl"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={onOpenAuth}
                className="gap-2 rounded-xl"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Button>
            )}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="gap-2 rounded-xl bg-[#211C84] px-6 text-white hover:bg-[#211C84]/90"
              >
                <Plus className="h-5 w-5" />
                New Folder
              </Button>
            </motion.div>
          </div>
        </div>

        {!user ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-xl border border-border bg-muted/40 px-4 py-3 text-center text-sm text-muted-foreground"
          >
            Sign in to load and save your folders. Your data stays tied to your Supabase account.
          </motion.div>
        ) : null}

        {/* Folder Grid */}
        {foldersLoading ? (
          <div className="flex justify-center py-24">
            <Spinner className="h-10 w-10 text-[#211C84]" />
          </div>
        ) : folders.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {folders.map((folder, index) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FolderCard folder={folder} onClick={() => onSelectFolder(folder)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-20"
          >
            <div className="rounded-full bg-muted p-4">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No folders yet</h3>
            <p className="mt-1 text-muted-foreground">
              {user ? "Create your first folder to get started" : "Sign in, then create a folder"}
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 gap-2 rounded-xl bg-[#211C84] text-white hover:bg-[#211C84]/90"
            >
              <Plus className="h-5 w-5" />
              Create Folder
            </Button>
          </motion.div>
        )}
      </div>

      <CreateFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(name) => void onCreateFolder(name)}
      />
    </PageTransition>
  )
}
