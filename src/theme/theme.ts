import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0b1f33',
    },
    secondary: {
      main: '#0f8b8d',
    },
    text: {
      primary: '#0b1f33',
      secondary: '#5b6b7f',
    },
    background: {
      default: '#f3f7f8',
      paper: '#ffffff',
    },
  },
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
        body: {
          color: '#0b1f33',
          backgroundColor: '#f3f7f8',
        },
        '::selection': {
          backgroundColor: 'rgba(255, 122, 89, 0.18)',
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
          backgroundColor: '#0b1f33',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#14314d',
          },
        },
        outlined: {
          borderColor: 'rgba(11, 31, 51, 0.16)',
          color: '#0b1f33',
          '&:hover': {
            borderColor: 'rgba(255, 122, 89, 0.42)',
            backgroundColor: 'rgba(255, 122, 89, 0.05)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(255, 122, 89, 0.05)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: '#ffffff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(11, 31, 51, 0.14)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 122, 89, 0.3)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0f8b8d',
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
          color: '#5b6b7f',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontWeight: 700,
          border: '1px solid rgba(255, 122, 89, 0.14)',
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

export default theme
