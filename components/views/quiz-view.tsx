"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, X, Shuffle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Flashcard } from "@/components/flashcard"
import { QuizProgress } from "@/components/quiz-progress"
import { PageTransition } from "@/components/page-transition"
import { useQuizSession } from "@/hooks/use-quiz-session"
import type { Folder, FlashCard } from "@/lib/types"

interface QuizViewProps {
  folder: Folder
  /** Deck order when the quiz session begins (typically shuffled once in the parent). */
  quizCards: FlashCard[]
  onExit: () => void
}

export function QuizView({ folder, quizCards, onExit }: QuizViewProps) {
  const {
    sessionCards,
    currentIndex,
    isFlipped,
    direction,
    currentCard,
    shuffle,
    reset,
    goPrevious,
    goNext,
    toggleFlip,
  } = useQuizSession(quizCards, folder.cards)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrevious()
      if (e.key === "ArrowRight") goNext()
      if (e.key === " ") {
        e.preventDefault()
        toggleFlip()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goPrevious, goNext, toggleFlip])

  if (!currentCard || sessionCards.length === 0) {
    return (
      <PageTransition className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <p className="text-muted-foreground">No cards in this quiz.</p>
        <Button className="mt-4 rounded-xl" variant="outline" onClick={onExit}>
          Back to editor
        </Button>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onExit}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-5 w-5" />
            </motion.button>
            <h1 className="text-lg font-semibold text-foreground">{folder.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => shuffle()}
                className="rounded-xl"
                aria-label="Shuffle deck"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => reset()}
                className="rounded-xl"
                aria-label="Reset order to folder default"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mx-auto w-full max-w-4xl px-4 pt-6">
        <QuizProgress current={currentIndex} total={sessionCards.length} />
      </div>

      {/* Flashcard */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -100 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Flashcard card={currentCard} isFlipped={isFlipped} onFlip={toggleFlip} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={goPrevious}
              disabled={currentIndex === 0}
              className="gap-2 rounded-xl px-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          </motion.div>
          <span className="text-sm text-muted-foreground">
            Press <kbd className="rounded bg-muted px-2 py-1 font-mono text-xs">Space</kbd> to flip
          </span>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={goNext}
              disabled={currentIndex === sessionCards.length - 1}
              className="gap-2 rounded-xl bg-[#211C84] px-6 text-white hover:bg-[#211C84]/90"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
