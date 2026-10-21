import { useEffect, useState } from 'react'
import { Button } from '../design-system'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'swapmeet-theme'

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // storage unavailable: fall through to the OS setting
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // not persisted; the toggle still works for this visit
    }
  }, [theme])

  const next: Theme = theme === 'dark' ? 'light' : 'dark'
  return (
    <Button
      variant="tertiary"
      aria-label={`Switch to ${next === 'dark' ? 'Night' : 'Day'} theme`}
      onClick={() => setTheme(next)}
    >
      {theme === 'dark' ? 'Night' : 'Day'}
    </Button>
  )
}
