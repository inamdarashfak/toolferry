import Box from '@mui/material/Box'
import type { PropsWithChildren } from 'react'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'

function LayoutShell({ children }: PropsWithChildren) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ py: { xs: 2, sm: 3, md: 4 }, flex: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  )
}

export default LayoutShell
