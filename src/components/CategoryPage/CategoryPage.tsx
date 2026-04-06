import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import BreadcrumbNav from '../BreadcrumbNav/BreadcrumbNav'
import Container from '../Container/Container'
import ToolCard from '../ToolCard/ToolCard'
import type { ToolCategory } from '../../data/toolCategories'
import type { Tool } from '../../types/tool'

type CategoryPageProps = {
  category: ToolCategory
  tools: Tool[]
}

function CategoryPage({ category, tools }: CategoryPageProps) {
  return (
    <Container>
      <Stack spacing={4}>
        <Box>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button component="span" startIcon={<ArrowBackRoundedIcon />}>
              Back to all tools
            </Button>
          </Link>
        </Box>

        <Paper
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 0,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: '0 14px 30px rgba(11, 31, 51, 0.045)',
          }}
        >
          <Stack spacing={1.5}>
            <BreadcrumbNav
              items={[
                { label: 'Home', href: '/' },
                { label: category.name },
              ]}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
              {category.name}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 860, lineHeight: 1.75 }}>
              {category.intro}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 860, lineHeight: 1.75 }}>
              {category.description}
            </Typography>
          </Stack>
        </Paper>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {tools.map((tool) => (
            <Grid key={tool.slug} size={{ xs: 12, sm: 6, md: 4 }}>
              <ToolCard tool={tool} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  )
}

export default CategoryPage
