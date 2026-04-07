'use client'

import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Container from '../../../components/Container/Container'

function ToolLoadingPage() {
  return (
    <Container>
      <Paper
        sx={(theme) => ({
          p: { xs: 3, md: 5 },
          borderRadius: 0,
          border: `1px solid ${theme.palette.divider}`,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, rgba(18,29,44,0.98) 0%, rgba(12,20,32,0.96) 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(247,250,250,0.95) 100%)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 18px 36px rgba(0, 0, 0, 0.24)'
              : '0 16px 40px rgba(11, 31, 51, 0.05)',
        })}
      >
        <Stack spacing={1}>
          <Typography variant="h6">Opening tool...</Typography>
          <Typography color="text.secondary">
            Loading the calculator and its content.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  )
}

export default ToolLoadingPage
