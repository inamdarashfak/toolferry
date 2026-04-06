import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import Container from '../components/Container/Container'
import { buildPageMetadata } from '../lib/seo'

export const metadata = buildPageMetadata({
  title: 'Page Not Found',
  description: 'The page you requested could not be found on ToolFerry.',
  path: '/404',
  robots: {
    index: false,
    follow: false,
  },
})

function NotFound() {
  return (
    <Container>
      <Paper
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 0,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: '0 16px 40px rgba(11, 31, 51, 0.05)',
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '1.75rem', md: '2.4rem' } }}>
            Page not found
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
            The page you requested does not exist or may have moved.
          </Typography>
          <Stack direction="row">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button component="span">Back to all tools</Button>
            </Link>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  )
}

export default NotFound
