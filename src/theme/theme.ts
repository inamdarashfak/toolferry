import { alpha, createTheme } from '@mui/material/styles'

export type ThemeMode = 'light' | 'dark'

function getPalette(mode: ThemeMode) {
  const isDark = mode === 'dark'

  return {
    mode,
    primary: {
      main: isDark ? '#eef4fb' : '#0b1f33',
    },
    secondary: {
      main: isDark ? '#4fd0c8' : '#0f8b8d',
    },
    text: {
      primary: isDark ? '#edf2f7' : '#0b1f33',
      secondary: isDark ? '#a9b7c6' : '#5b6b7f',
    },
    background: {
      default: isDark ? '#09111b' : '#f3f7f8',
      paper: isDark ? '#111c2b' : '#ffffff',
    },
    divider: isDark ? 'rgba(226, 232, 240, 0.12)' : 'rgba(11, 31, 51, 0.08)',
  }
}

export function getTheme(mode: ThemeMode) {
  const palette = getPalette(mode)
  const isDark = mode === 'dark'

  return createTheme({
    palette,
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.2rem',
        lineHeight: 1.08,
      },
      h2: {
        fontWeight: 700,
        fontSize: '1.65rem',
        lineHeight: 1.15,
      },
      h3: {
        fontWeight: 700,
        fontSize: '1.35rem',
        lineHeight: 1.18,
      },
      button: {
        fontWeight: 600,
        fontSize: '0.94rem',
        letterSpacing: 0,
        textTransform: 'none',
      },
      body1: {
        fontSize: '0.98rem',
        lineHeight: 1.68,
      },
      body2: {
        fontSize: '0.92rem',
        lineHeight: 1.58,
      },
      overline: {
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            colorScheme: mode,
          },
          body: {
            color: palette.text.primary,
            background:
              mode === 'dark'
                ? 'radial-gradient(circle at top left, rgba(79, 208, 200, 0.09), transparent 30%), radial-gradient(circle at top right, rgba(148, 163, 184, 0.07), transparent 24%), linear-gradient(180deg, #0b1320 0%, #09111b 100%)'
                : 'radial-gradient(circle at top left, rgba(15, 139, 141, 0.08), transparent 28%), radial-gradient(circle at top right, rgba(11, 31, 51, 0.05), transparent 24%), linear-gradient(180deg, #f6f8f8 0%, #f2f6f7 100%)',
          },
          '::selection': {
            backgroundColor: isDark
              ? 'rgba(255, 122, 89, 0.28)'
              : 'rgba(255, 122, 89, 0.18)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? alpha('#111c2b', 0.94) : '#ffffff',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 0,
            paddingInline: 14,
            minHeight: 38,
          },
          containedPrimary: {
            backgroundColor: isDark ? '#edf2f7' : '#0b1f33',
            color: isDark ? '#09111b' : '#ffffff',
            '&:hover': {
              backgroundColor: isDark ? '#ffffff' : '#14314d',
            },
          },
          outlined: {
            borderColor: isDark ? alpha('#e2e8f0', 0.2) : 'rgba(11, 31, 51, 0.16)',
            color: palette.text.primary,
            '&:hover': {
              borderColor: 'rgba(255, 122, 89, 0.42)',
              backgroundColor: isDark
                ? 'rgba(255, 122, 89, 0.12)'
                : 'rgba(255, 122, 89, 0.05)',
            },
          },
          text: {
            '&:hover': {
              backgroundColor: isDark
                ? 'rgba(255, 122, 89, 0.12)'
                : 'rgba(255, 122, 89, 0.05)',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            backgroundColor: isDark ? alpha('#0b1320', 0.72) : '#ffffff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? alpha('#e2e8f0', 0.16) : 'rgba(11, 31, 51, 0.14)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 122, 89, 0.3)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: palette.secondary.main,
              borderWidth: 1,
            },
          },
          input: {
            paddingTop: 12,
            paddingBottom: 12,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: palette.text.secondary,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            fontWeight: 700,
            border: `1px solid ${isDark ? 'rgba(255, 122, 89, 0.24)' : 'rgba(255, 122, 89, 0.14)'}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 0,
          },
        },
      },
    },
  })
}
