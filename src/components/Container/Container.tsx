import MuiContainer from '@mui/material/Container'
import type { PropsWithChildren } from 'react'

function Container({ children }: PropsWithChildren) {
  return (
    <MuiContainer maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2.25, md: 2.5 } }}>
      {children}
    </MuiContainer>
  )
}

export default Container
