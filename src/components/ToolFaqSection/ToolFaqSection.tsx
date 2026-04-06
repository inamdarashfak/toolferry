import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

type ToolFaqSectionProps = {
  faqs?: Array<{
    question: string
    answer: string
  }>
}

function ToolFaqSection({ faqs }: ToolFaqSectionProps) {
  if (!faqs?.length) {
    return null
  }

  return (
    <Paper
      sx={(theme) => ({
        p: { xs: 2, md: 2.1 },
        borderRadius: 0,
        border: `1px solid ${theme.palette.divider}`,
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, rgba(18,29,44,0.98) 0%, rgba(12,20,32,0.96) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,250,0.96) 100%)',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 16px 34px rgba(0, 0, 0, 0.24)'
            : '0 14px 30px rgba(11, 31, 51, 0.045)',
      })}
    >
      <Stack spacing={{ xs: 1.5, md: 1.2 }}>
        <Stack spacing={0.5}>
          <Typography variant="overline" sx={{ color: 'secondary.main', lineHeight: 1.2 }}>
            FAQs
          </Typography>
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '0.98rem' } }}>
            Common questions about this tool
          </Typography>
        </Stack>

        <Stack spacing={{ xs: 1, md: 0.85 }}>
          {faqs.map((faq) => (
            <Accordion
              key={faq.question}
              disableGutters
              elevation={0}
              sx={(theme) => ({
                borderRadius: 0,
                border: `1px solid ${theme.palette.divider}`,
                '&::before': {
                  display: 'none',
                },
              })}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreRoundedIcon />}
                sx={{ minHeight: { xs: 48, md: 42 }, '& .MuiAccordionSummary-content': { my: { xs: 1.5, md: 1.1 } } }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.96rem', md: '0.92rem' } }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: { xs: 2, md: 1.5 } }}>
                <Typography color="text.secondary" sx={{ lineHeight: { xs: 1.7, md: 1.58 } }}>
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
