'use client'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import type { PropsWithChildren } from 'react'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getTheme, type ThemeMode } from '../../theme/theme'

const STORAGE_KEY = 'theme-mode'

type ColorModeContextValue = {
  mode: ThemeMode
  toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null)

function resolveSystemMode() {
  if (typeof window === 'undefined') {
    return 'light' as ThemeMode
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveStoredMode() {
  if (typeof window === 'undefined') {
    return null
  }

  const storedMode = window.localStorage.getItem(STORAGE_KEY)
  return storedMode === 'light' || storedMode === 'dark' ? storedMode : null
}

export function useColorMode() {
  const context = useContext(ColorModeContext)

  if (!context) {
    throw new Error('useColorMode must be used within Providers')
  }

  return context
}

function Providers({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>('light')
  const [hasExplicitPreference, setHasExplicitPreference] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const storedMode = resolveStoredMode()
    const nextMode = storedMode ?? resolveSystemMode()

    setMode(nextMode)
    setHasExplicitPreference(Boolean(storedMode))
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (hasExplicitPreference) {
      window.localStorage.setItem(STORAGE_KEY, mode)
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }

    document.documentElement.dataset.themeMode = mode
    document.documentElement.style.colorScheme = mode
  }, [hasExplicitPreference, mode])

  useEffect(() => {
    if (typeof window === 'undefined' || hasExplicitPreference) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      setMode(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [hasExplicitPreference])

  const colorMode = useMemo<ColorModeContextValue>(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'))
        setHasExplicitPreference(true)
      },
    }),
    [mode],
  )

  const theme = useMemo(() => getTheme(mode), [mode])

  return (
    <AppRouterCacheProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div style={{ visibility: isReady ? 'visible' : 'hidden' }}>{children}</div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppRouterCacheProvider>
  )
}

export default Providers
