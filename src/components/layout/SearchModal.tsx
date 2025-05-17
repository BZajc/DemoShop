"use client"

import { useEffect } from "react"
import { Search } from "lucide-react"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 w-full max-w-md mx-auto rounded-xl shadow-xl p-6 flex items-center gap-2 border border-gray-300 dark:border-zinc-700"
      >
        <Search className="w-5 h-5 text-gray-400" />
        <input
          autoFocus
          type="text"
          placeholder="Search shops..."
          className="w-full bg-transparent text-sm text-gray-800 dark:text-white focus:outline-none"
        />
      </div>
    </div>
  )
}
