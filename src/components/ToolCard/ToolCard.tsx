import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import type { Tool } from '../../types/tool'

type ToolCardProps = {
  tool: Tool
}

function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        border: '1px solid rgba(11, 31, 51, 0.08)',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,250,0.94) 100%)',
        boxShadow: '0 14px 30px rgba(11, 31, 51, 0.045)',
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/tool/${tool.slug}`}
        sx={{
          height: '100%',
          alignItems: 'stretch',
          '&:hover .tool-arrow': {
            transform: 'translate(2px, -2px)',
            color: 'secondary.main',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2.25, sm: 3, md: 3.5 } }}>
          <Stack spacing={{ xs: 2, md: 2.5 }} sx={{ height: '100%' }}>
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              spacing={2}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, wordBreak: 'break-word' }}>
                {tool.name}
              </Typography>
              <ArrowOutwardRoundedIcon
                className="tool-arrow"
                color="action"
                sx={{ transition: 'transform 180ms ease, color 180ms ease' }}
              />
            </Stack>

            <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
              {tool.description}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default ToolCard
