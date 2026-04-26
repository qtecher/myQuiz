"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { DashboardView } from "@/components/views/dashboard-view"
import { EditorView } from "@/components/views/editor-view"
import { QuizView } from "@/components/views/quiz-view"
import { AuthDialog } from "@/components/auth-dialog"
import { SupabaseConfigWarning } from "@/components/supabase-config-warning"
import { useAuth, useSupabaseConfigured } from "@/components/supabase-provider"
import { useFolderLibrary } from "@/hooks/use-folder-library"
import { shuffleArray } from "@/lib/shuffle"
import type { FlashCard, Folder } from "@/lib/types"
import { Spinner } from "@/components/ui/spinner"

type View = "dashboard" | "editor" | "quiz"

export default function Home() {
  const configured = useSupabaseConfigured()
  const { user, loading: authLoading, signOut } = useAuth()
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const {
    folders,
    foldersLoading,
    selectedFolder,
    createFolder,
    addCard,
    updateCard,
    deleteCard,
  } = useFolderLibrary(selectedFolderId)

  const [view, setView] = useState<View>("dashboard")
  const [quizDeck, setQuizDeck] = useState<FlashCard[]>([])
  const [quizSessionKey, setQuizSessionKey] = useState(0)
  const [authOpen, setAuthOpen] = useState(false)

  const handleSelectFolder = (folder: Folder) => {
    setSelectedFolderId(folder.id)
    setView("editor")
  }

  const handleCreateFolder = async (name: string) => {
    if (!user) {
      toast.error("Sign in to create folders.")
      setAuthOpen(true)
      return
    }
    await createFolder(name)
  }

  const handleAddCard = async () => {
    if (!selectedFolder) return
    await addCard(selectedFolder.id)
  }

  const handleUpdateCard = (id: string, field: "question" | "answer", value: string) => {
    if (!selectedFolder) return
    updateCard(selectedFolder.id, id, field, value)
  }

  const handleDeleteCard = async (id: string) => {
    if (!selectedFolder) return
    await deleteCard(selectedFolder.id, id)
  }

  const handleStartQuiz = () => {
    if (!selectedFolder || selectedFolder.cards.length === 0) return
    setQuizDeck(shuffleArray(selectedFolder.cards))
    setQuizSessionKey((k) => k + 1)
    setView("quiz")
  }

  const handleExitQuiz = () => {
    setView("editor")
  }

  const handleBackToDashboard = () => {
    setSelectedFolderId(null)
    setView("dashboard")
  }

  if (!configured) {
    return <SupabaseConfigWarning />
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="h-10 w-10 text-[#211C84]" />
      </div>
    )
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {view === "dashboard" && (
          <DashboardView
            key="dashboard"
            folders={folders}
            foldersLoading={foldersLoading}
            user={user}
            onSelectFolder={handleSelectFolder}
            onCreateFolder={handleCreateFolder}
            onOpenAuth={() => setAuthOpen(true)}
            onSignOut={() => void signOut()}
          />
        )}
        {view === "editor" && selectedFolder && (
          <EditorView
            key="editor"
            folder={selectedFolder}
            onBack={handleBackToDashboard}
            onStartQuiz={handleStartQuiz}
            onAddCard={() => void handleAddCard()}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={(id) => void handleDeleteCard(id)}
          />
        )}
        {view === "quiz" && selectedFolder && quizDeck.length > 0 && (
          <QuizView
            key={`${selectedFolder.id}-${quizSessionKey}`}
            folder={selectedFolder}
            quizCards={quizDeck}
            onExit={handleExitQuiz}
          />
        )}
      </AnimatePresence>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  )
}
