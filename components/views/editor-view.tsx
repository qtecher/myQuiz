"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Plus, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardEditor } from "@/components/card-editor"
import { PageTransition } from "@/components/page-transition"
import type { Folder } from "@/lib/types"

interface EditorViewProps {
  folder: Folder
  onBack: () => void
  onStartQuiz: () => void
  onAddCard: () => void
  onUpdateCard: (id: string, field: "question" | "answer", value: string) => void
  onDeleteCard: (id: string) => void
}

export function EditorView({
  folder,
  onBack,
  onStartQuiz,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
}: EditorViewProps) {
  return (
    <PageTransition className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onBack}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{folder.name}</h1>
              <p className="text-sm text-muted-foreground">
                {folder.cards.length} {folder.cards.length === 1 ? "card" : "cards"}
              </p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onStartQuiz}
              disabled={folder.cards.length === 0}
              className="gap-2 rounded-xl bg-[#211C84] px-6 text-white hover:bg-[#211C84]/90 disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              Start Quiz
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Card List */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <CardEditor
          cards={folder.cards}
          onUpdateCard={onUpdateCard}
          onDeleteCard={onDeleteCard}
        />

        {/* Add Card Button */}
        <motion.button
          onClick={onAddCard}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-6 text-muted-foreground transition-colors hover:border-[#211C84] hover:text-[#211C84]"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Plus className="h-5 w-5" />
          Add New Card
        </motion.button>
      </div>
    </PageTransition>
  )
}
