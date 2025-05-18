'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) return null

  const isLight = theme === 'dark'

  const classes = `cursor-pointer p-2 rounded-full transition border ${
    scrolled
      ? 'bg-white text-black border-black hover:bg-gray-200'
      : 'bg-black text-white border-white hover:bg-zinc-700'
  }`

  return (
    <button
      onClick={() => setTheme(isLight ? 'light' : 'dark')}
      className={classes}
      aria-label="Toggle theme"
    >
      {isLight ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
