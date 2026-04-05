import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

type ToolFaqSectionProps = {
  faqs: Array<{
    question: string
    answer: string
  }>
}

function ToolFaqSection({ faqs }: ToolFaqSectionProps) {
  if (faqs.length === 0) {
    return null
  }

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 0,
        border: '1px solid rgba(11, 31, 51, 0.08)',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,250,0.96) 100%)',
        boxShadow: '0 14px 30px rgba(11, 31, 51, 0.045)',
      }}
    >
      <Stack spacing={1.5}>
        <Stack spacing={0.5}>
          <Typography variant="overline" sx={{ color: 'secondary.main', lineHeight: 1.2 }}>
            FAQs
          </Typography>
          <Typography variant="h6">Common questions about this tool</Typography>
        </Stack>

        <Stack spacing={1}>
          {faqs.map((faq) => (
            <Accordion
              key={faq.question}
              disableGutters
              elevation={0}
              sx={{
                borderRadius: 0,
                border: '1px solid rgba(11, 31, 51, 0.08)',
                '&::before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                <Typography sx={{ fontWeight: 700 }}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}

export default ToolFaqSection
