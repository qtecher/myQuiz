"use client"

import { motion } from "framer-motion"
import { Folder, Layers } from "lucide-react"
import type { Folder as FolderType } from "@/lib/types"

interface FolderCardProps {
  folder: FolderType
  onClick: () => void
}

export function FolderCard({ folder, onClick }: FolderCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative w-full rounded-xl border-2 border-border bg-card p-6 text-left transition-colors hover:border-[#211C84]"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="flex items-start justify-between">
        <div className="rounded-lg bg-[#211C84]/10 p-3">
          <Folder className="h-6 w-6 text-[#211C84]" />
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Layers className="h-4 w-4" />
          <span className="text-sm font-medium">{folder.cards.length}</span>
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{folder.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {folder.cards.length} {folder.cards.length === 1 ? "Card" : "Cards"}
      </p>
    </motion.button>
  )
}
