"use client"

import { motion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import type { FlashCard } from "@/lib/types"

interface FlashcardProps {
  card: FlashCard
  isFlipped: boolean
  onFlip: () => void
}

export function Flashcard({ card, isFlipped, onFlip }: FlashcardProps) {
  return (
    <div className="perspective-[1500px] w-full max-w-2xl mx-auto">
      <motion.div
        className="relative w-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        onClick={onFlip}
      >
        {/* Front - Question */}
        <motion.div
          className="relative flex min-h-[350px] w-full flex-col items-center justify-center rounded-xl border-2 border-[#211C84] bg-card p-8 shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="absolute left-4 top-4 rounded-full bg-[#211C84]/10 px-3 py-1 text-xs font-medium text-[#211C84]">
            Question
          </span>
          <p className="text-center text-xl font-medium text-foreground text-balance">{card.question}</p>
          <div className="absolute bottom-4 flex items-center gap-2 text-sm text-muted-foreground">
            <RotateCcw className="h-4 w-4" />
            <span>Click to reveal answer</span>
          </div>
        </motion.div>

        {/* Back - Answer */}
        <motion.div
          className="absolute inset-0 flex min-h-[350px] w-full flex-col items-center justify-center rounded-xl border-2 border-[#211C84] bg-[#211C84] p-8 shadow-lg"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
            Answer
          </span>
          <p className="text-center text-xl font-medium text-white text-balance">{card.answer}</p>
          <div className="absolute bottom-4 flex items-center gap-2 text-sm text-white/70">
            <RotateCcw className="h-4 w-4" />
            <span>Click to see question</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
