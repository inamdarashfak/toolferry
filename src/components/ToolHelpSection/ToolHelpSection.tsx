import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ToolHelpContent } from "../../data/toolHelpContent";

type ToolHelpSectionProps = {
  content: ToolHelpContent;
};

function ToolHelpSection({ content }: ToolHelpSectionProps) {
  return (
    <Paper
      id="tool-instructions"
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 0,
        border: "1px solid rgba(11, 31, 51, 0.08)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,250,0.96) 100%)",
        boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
        scrollMarginTop: 88,
      }}
    >
      <Stack spacing={2.25}>
        <Stack spacing={0.6} sx={{ maxWidth: 880 }}>
          <Typography
            variant="overline"
            sx={{ color: "secondary.main", lineHeight: 1.2 }}
          >
            Tool Guide
          </Typography>
          <Typography variant="h6" sx={{ fontSize: { xs: "1rem", md: "1.08rem" } }}>
            Description, how to use it, and what each control does
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
            {content.description}
          </Typography>
        </Stack>

        <Stack spacing={2.25}>
          <Box component="section">
            <Typography
              variant="subtitle1"
              component="h2"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              What This Tool Does
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
              {content.description}
            </Typography>
          </Box>

          <Divider />

          <Box component="section">
            <Typography
              variant="subtitle1"
              component="h2"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              How To Use
            </Typography>
            <Box
              component="ol"
              sx={{
                m: 0,
                pl: 2.25,
                color: "text.secondary",
                display: "grid",
                gap: 0.85,
              }}
            >
              {content.steps.map((step) => (
                <Box key={step} component="li" sx={{ lineHeight: 1.7 }}>
                  {step}
                </Box>
              ))}
            </Box>
          </Box>

          <Divider />

          <Box component="section">
            <Typography
              variant="subtitle1"
              component="h2"
              sx={{ fontWeight: 700, mb: 1.25 }}
            >
              Field Guide
            </Typography>

            <Stack spacing={1.5}>
              {content.fieldGroups.map((group) => (
                <Box key={group.title ?? "default"}>
                  {group.title && (
                    <Typography
                      variant="body2"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: "secondary.main",
                        mb: 0.85,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {group.title}
                    </Typography>
                  )}

                  <Stack
                    divider={<Divider flexItem />}
                    sx={{
                      border: "1px solid rgba(11, 31, 51, 0.08)",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {group.fields.map((field) => (
                      <Stack
                        key={field.label}
                        direction={{ xs: "column", sm: "row" }}
                        spacing={0.75}
                        justifyContent="space-between"
                        sx={{ px: 1.5, py: 1.15 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            minWidth: { sm: 180 },
                            fontWeight: 700,
                            color: "#0b1f33",
                          }}
                        >
                          {field.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.65, maxWidth: 760 }}
                        >
                          {field.description}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default ToolHelpSection;
