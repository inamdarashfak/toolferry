'use client'

import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import MuiLink from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MouseEvent, useEffect, useMemo, useState, useTransition } from 'react'
import Container from '../../components/Container/Container'
import { toolCategories } from '../../data/toolCategories'
import { tools } from '../../data/tools'

function sortToolsForHome() {
  return [...tools].sort((left, right) => {
    const leftRank = left.homeRank ?? Number.MAX_SAFE_INTEGER
    const rightRank = right.homeRank ?? Number.MAX_SAFE_INTEGER

    if (leftRank !== rightRank) {
      return leftRank - rightRank
    }

    return left.name.localeCompare(right.name)
  })
}

function CompactToolLink({
  toolName,
  slug,
}: {
  toolName: string
  slug: string
}) {
  const router = useRouter()
  const href = `/tool/${slug}`
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    router.prefetch(href)
  }, [href, router])

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()

    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <MuiLink
      component={Link}
      href={href}
      onClick={handleClick}
      underline="none"
      color="text.primary"
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 0.75,
        minHeight: 34,
        px: 1,
        py: 0.7,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.025)'
            : 'rgba(255,255,255,0.72)',
        opacity: isPending ? 0.78 : 1,
        pointerEvents: isPending ? 'none' : 'auto',
        transition:
          'border-color 180ms ease, background-color 180ms ease, color 180ms ease, opacity 180ms ease',
        '&:hover': {
          borderColor: 'secondary.main',
          backgroundColor:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.04)'
              : 'rgba(255,255,255,0.96)',
        },
        '&:hover .compact-tool-title': {
          color: 'secondary.main',
        },
        '&:hover .compact-tool-arrow': {
          color: 'secondary.main',
        },
      })}
    >
      <Typography
        className="compact-tool-title"
        title={toolName}
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: { xs: '0.88rem', md: '0.86rem' },
          fontWeight: 600,
          lineHeight: 1.3,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'color 180ms ease',
        }}
      >
        {toolName}
      </Typography>
      {isPending ? (
        <CircularProgress size={16} thickness={5} sx={{ flexShrink: 0 }} />
      ) : (
        <ArrowOutwardRoundedIcon
          className="compact-tool-arrow"
          sx={{
            fontSize: '0.85rem',
            flexShrink: 0,
            color: 'text.disabled',
            transition: 'color 180ms ease',
          }}
        />
      )}
    </MuiLink>
  )
}

function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const orderedTools = useMemo(() => sortToolsForHome(), [])

  const matchingTools = useMemo(() => {
    if (!normalizedQuery) {
      return []
    }

    return orderedTools.filter((tool) =>
      `${tool.name} ${tool.description}`.toLowerCase().includes(normalizedQuery)
    )
  }, [normalizedQuery, orderedTools])

  return (
    <Container>
      <Stack spacing={{ xs: 3, md: 4 }}>
        <Paper
          sx={(theme) => ({
            p: { xs: 2.25, sm: 2.75, md: 3 },
            borderRadius: 0,
            border: `1px solid ${theme.palette.divider}`,
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(180deg, rgba(17,28,43,0.98) 0%, rgba(11,19,32,0.96) 100%)'
                : 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(246,249,249,0.96) 100%)',
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 18px 40px rgba(0, 0, 0, 0.24)'
                : '0 18px 40px rgba(11, 31, 51, 0.05)',
          })}
        >
          <Stack spacing={{ xs: 2, md: 1.75 }}>
            <Chip
              label="Practical utility directory"
              sx={{
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(255, 122, 89, 0.12)',
                color: 'secondary.main',
              }}
            />
            <Box sx={{ maxWidth: 860 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '1.85rem', sm: '2.25rem', md: '3rem' },
                  lineHeight: { xs: 1.1, md: 1.04 },
                  letterSpacing: '-0.05em',
                  mb: 1,
                  maxWidth: 820,
                }}
              >
                Practical tools, presented with a cleaner and calmer interface.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.96rem', md: '0.98rem' },
                  maxWidth: 700,
                }}
              >
                ToolFerry brings calculators and utility tools into one focused
                workspace, from EMI, FD, GST, and mutual fund estimates to text
                formatting, JSON inspection, unit conversion, and date-based
                tools.
              </Typography>
            </Box>

            <TextField
              fullWidth
              size="small"
              placeholder="Search tools by name or use case"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              sx={{ maxWidth: 620 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {toolCategories.map((category) => (
                <Chip
                  key={category.slug}
                  label={category.name}
                  component="a"
                  clickable
                  href={`#category-${category.slug}`}
                  sx={(theme) => ({
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.04)'
                        : 'rgba(11,31,51,0.03)',
                    color: 'text.primary',
                  })}
                />
              ))}
            </Stack>
          </Stack>
        </Paper>

        {normalizedQuery ? (
          <Paper
            sx={(theme) => ({
              p: { xs: 2, md: 2.25 },
              borderRadius: 0,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(17,28,43,0.82)'
                  : 'rgba(255,255,255,0.9)',
            })}
          >
            <Stack spacing={1.5}>
              <Box>
                <Typography
                  variant="h2"
                  sx={{ fontSize: { xs: '1.25rem', md: '1.55rem' }, mb: 0.5 }}
                >
                  Search results
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
                  {matchingTools.length
                    ? `${matchingTools.length} matching ${matchingTools.length === 1 ? 'tool' : 'tools'} for "${searchQuery.trim()}".`
                    : `No tools matched "${searchQuery.trim()}". Try another term or browse the categories below.`}
                </Typography>
              </Box>

              {matchingTools.length ? (
                <Grid container spacing={{ xs: 1, md: 1.25 }}>
                  {matchingTools.map((tool) => (
                    <Grid key={tool.slug} size={{ xs: 12, sm: 6, md: 4 }}>
                      <CompactToolLink toolName={tool.name} slug={tool.slug} />
                    </Grid>
                  ))}
                </Grid>
              ) : null}
            </Stack>
          </Paper>
        ) : null}

        <Stack spacing={{ xs: 2.25, md: 2.5 }}>
          {toolCategories.map((category) => {
            const categoryTools = orderedTools.filter(
              (tool) => tool.categorySlug === category.slug
            )
            return (
              <Paper
                key={category.slug}
                id={`category-${category.slug}`}
                sx={(theme) => ({
                  p: { xs: 2.25, md: 2.75 },
                  borderRadius: 0,
                  border: `1px solid ${theme.palette.divider}`,
                  background:
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(180deg, rgba(17,28,43,0.98) 0%, rgba(12,20,32,0.96) 100%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,250,0.95) 100%)',
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? '0 16px 34px rgba(0, 0, 0, 0.24)'
                      : '0 14px 30px rgba(11, 31, 51, 0.045)',
                })}
              >
                <Stack spacing={{ xs: 1.75, md: 1.75 }}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    spacing={1.25}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                  >
                    <Box sx={{ maxWidth: 760 }}>
                      <Typography
                        variant="h2"
                        sx={{
                          fontSize: { xs: '1.2rem', md: '1.45rem' },
                          mb: 0.5,
                        }}
                      >
                        {category.name}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.6,
                          fontSize: { xs: '0.92rem', md: '0.94rem' },
                        }}
                      >
                        {category.homeSummary ?? category.description}
                      </Typography>
                    </Box>

                    <Button
                      component={Link}
                      href={`/category/${category.slug}`}
                      size="small"
                      endIcon={<ArrowOutwardRoundedIcon />}
                      sx={{
                        minWidth: 'auto',
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      View all
                    </Button>
                  </Stack>

                  <Divider />

                  <Grid container spacing={{ xs: 1, md: 1.25 }}>
                    {categoryTools.map((tool) => (
                      <Grid key={tool.slug} size={{ xs: 12, sm: 6, lg: 3 }}>
                        <CompactToolLink
                          toolName={tool.name}
                          slug={tool.slug}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Paper>
            )
          })}
        </Stack>
      </Stack>
    </Container>
  )
}

export default Home
