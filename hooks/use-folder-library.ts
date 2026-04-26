"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { useAuth, useSupabase } from "@/components/supabase-provider"
import type { Folder, FlashCard } from "@/lib/types"
import { mapFolderRow, type FolderWithCardsRow } from "@/lib/types"

const DEBOUNCE_MS = 450

function scheduleDebounced(
  timers: Map<string, ReturnType<typeof setTimeout>>,
  key: string,
  fn: () => Promise<void>
) {
  const prev = timers.get(key)
  if (prev) clearTimeout(prev)
  timers.set(
    key,
    setTimeout(() => {
      timers.delete(key)
      void fn()
    }, DEBOUNCE_MS)
  )
}

export function useFolderLibrary(selectedFolderId: string | null) {
  const supabase = useSupabase()
  const { user, loading: authLoading } = useAuth()
  const [folders, setFolders] = useState<Folder[]>([])
  const [foldersLoading, setFoldersLoading] = useState(false)
  const persistTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const loadFolders = useCallback(async () => {
    if (!supabase || !user) {
      setFolders([])
      return
    }
    setFoldersLoading(true)
    const { data, error } = await supabase
      .from("folders")
      .select(
        "id, name, created_at, user_id, cards ( id, folder_id, question, answer, created_at )"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    setFoldersLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    const rows = (data ?? []) as FolderWithCardsRow[]
    setFolders(rows.map(mapFolderRow))
  }, [supabase, user])

  useEffect(() => {
    if (!supabase || !user) {
      setFolders([])
      setFoldersLoading(false)
      return
    }
    void loadFolders()
  }, [supabase, user, loadFolders])

  const selectedFolder = useMemo(
    () => folders.find((f) => f.id === selectedFolderId) ?? null,
    [folders, selectedFolderId]
  )

  const createFolder = useCallback(
    async (name: string) => {
      if (!supabase || !user) {
        toast.error("Sign in to create folders.")
        return
      }
      const { error } = await supabase.from("folders").insert({ name, user_id: user.id })
      if (error) {
        toast.error(error.message)
        return
      }
      await loadFolders()
      toast.success("Folder created")
    },
    [supabase, user, loadFolders]
  )

  const addCard = useCallback(
    async (folderId: string) => {
      if (!supabase) return
      const { data, error } = await supabase
        .from("cards")
        .insert({ folder_id: folderId, question: "", answer: "" })
        .select("id, folder_id, question, answer, created_at")
        .single()

      if (error) {
        toast.error(error.message)
        return
      }
      const row = data
      const newCard: FlashCard = {
        id: row.id,
        question: row.question,
        answer: row.answer,
      }
      setFolders((prev) =>
        prev.map((f) =>
          f.id === folderId ? { ...f, cards: [...f.cards, newCard] } : f
        )
      )
    },
    [supabase]
  )

  const updateCard = useCallback(
    (folderId: string, cardId: string, field: "question" | "answer", value: string) => {
      setFolders((prev) =>
        prev.map((f) => {
          if (f.id !== folderId) return f
          return {
            ...f,
            cards: f.cards.map((c) => (c.id === cardId ? { ...c, [field]: value } : c)),
          }
        })
      )

      if (!supabase) return
      const key = `${cardId}:${field}`
      scheduleDebounced(persistTimers.current, key, async () => {
        const payload =
          field === "question" ? { question: value } : { answer: value }
        const { error } = await supabase.from("cards").update(payload).eq("id", cardId)
        if (error) toast.error(error.message)
      })
    },
    [supabase]
  )

  const deleteCard = useCallback(
    async (folderId: string, cardId: string) => {
      if (!supabase) return
      const { error } = await supabase.from("cards").delete().eq("id", cardId)
      if (error) {
        toast.error(error.message)
        return
      }
      setFolders((prev) =>
        prev.map((f) =>
          f.id === folderId
            ? { ...f, cards: f.cards.filter((c) => c.id !== cardId) }
            : f
        )
      )
    },
    [supabase]
  )

  useEffect(() => {
    return () => {
      for (const t of persistTimers.current.values()) clearTimeout(t)
      persistTimers.current.clear()
    }
  }, [])

  return {
    authLoading,
    user,
    folders,
    foldersLoading,
    selectedFolder,
    loadFolders,
    createFolder,
    addCard,
    updateCard,
    deleteCard,
  }
}
