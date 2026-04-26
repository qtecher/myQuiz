import type { Database } from "@/lib/database.types"

export type FlashCard = {
  id: string
  question: string
  answer: string
}

export type Folder = {
  id: string
  name: string
  cards: FlashCard[]
  createdAt: Date
}

export type FolderRow = Database["public"]["Tables"]["folders"]["Row"]
export type CardRow = Database["public"]["Tables"]["cards"]["Row"]

export type FolderWithCardsRow = FolderRow & {
  cards: CardRow[] | null
}

export function mapCardRow(row: CardRow): FlashCard {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
  }
}

export function mapFolderRow(row: FolderWithCardsRow): Folder {
  const cards = (row.cards ?? [])
    .slice()
    .sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .map(mapCardRow)

  return {
    id: row.id,
    name: row.name,
    createdAt: new Date(row.created_at),
    cards,
  }
}
