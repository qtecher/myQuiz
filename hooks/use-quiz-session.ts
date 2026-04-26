"use client"

import { useCallback, useState } from "react"
import type { FlashCard } from "@/lib/types"
import { shuffleArray } from "@/lib/shuffle"

/**
 * Quiz UI state: randomized deck order, current card index, flip, and navigation.
 * Pass a fresh `initialDeck` when mounting a new session (e.g. use a React `key` on the parent).
 */
export function useQuizSession(initialDeck: FlashCard[], originalDeck: FlashCard[]) {
  const [sessionCards, setSessionCards] = useState<FlashCard[]>(() => [...initialDeck])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [direction, setDirection] = useState(0)

  const currentCard = sessionCards[currentIndex]

  const shuffle = useCallback(() => {
    setSessionCards(shuffleArray(originalDeck))
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [originalDeck])

  const reset = useCallback(() => {
    setSessionCards([...originalDeck])
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [originalDeck])

  const goPrevious = useCallback(() => {
    setCurrentIndex((idx) => {
      if (idx <= 0) return idx
      setDirection(-1)
      setIsFlipped(false)
      return idx - 1
    })
  }, [])

  const goNext = useCallback(() => {
    setCurrentIndex((idx) => {
      if (idx >= sessionCards.length - 1) return idx
      setDirection(1)
      setIsFlipped(false)
      return idx + 1
    })
  }, [sessionCards.length])

  const toggleFlip = useCallback(() => {
    setIsFlipped((f) => !f)
  }, [])

  return {
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
  }
}
