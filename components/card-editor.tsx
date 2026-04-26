"use client"

import { motion } from "framer-motion"
import { Trash2, GripVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { FlashCard } from "@/lib/types"

interface CardEditorProps {
  cards: FlashCard[]
  onUpdateCard: (id: string, field: "question" | "answer", value: string) => void
  onDeleteCard: (id: string) => void
}

export function CardEditor({ cards, onUpdateCard, onDeleteCard }: CardEditorProps) {
  return (
    <div className="space-y-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: index * 0.05 }}
          className="group rounded-xl border-2 border-border bg-card p-4 transition-colors hover:border-[#211C84]/30"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 items-center text-muted-foreground">
              <GripVertical className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#211C84] text-xs font-bold text-white">
                  {index + 1}
                </span>
                <Input
                  value={card.question}
                  onChange={(e) => onUpdateCard(card.id, "question", e.target.value)}
                  placeholder="Enter question..."
                  className="flex-1 border-0 bg-muted/50 text-base font-medium focus-visible:ring-[#211C84]"
                />
              </div>
              <Input
                value={card.answer}
                onChange={(e) => onUpdateCard(card.id, "answer", e.target.value)}
                placeholder="Enter answer..."
                className="border-0 bg-muted/50 text-base focus-visible:ring-[#211C84]"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
              onClick={() => onDeleteCard(card.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
