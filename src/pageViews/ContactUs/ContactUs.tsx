import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "../../components/Container/Container";

function ContactUs() {
  return (
    <Container>
      <Paper
        sx={{
          p: { xs: 3, md: 4.5 },
          borderRadius: 0,
          border: "1px solid rgba(11, 31, 51, 0.08)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(247,250,250,0.95) 100%)",
          boxShadow: "0 16px 40px rgba(11, 31, 51, 0.05)",
        }}
      >
        <Stack spacing={2}>
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontSize: { xs: "1.75rem", md: "2.4rem" } }}
          >
            Contact Us
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
            If you would like to share feedback, report an issue, discuss partnerships,
            or reach out about ToolFerry, please contact us at{" "}
            <Typography component="span" sx={{ color: "primary.main", fontWeight: 700 }}>
              toolferryonline@gmail.com
            </Typography>
            . We review messages periodically and will respond when appropriate.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}

export default ContactUs;
