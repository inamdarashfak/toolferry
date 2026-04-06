'use client';

import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { Tool } from "../../types/tool";

type RelatedToolsSectionProps = {
  tools: Tool[];
};

function RelatedToolsSection({ tools }: RelatedToolsSectionProps) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <Stack spacing={{ xs: 1.5, md: 1.25 }}>
      <Box sx={{ maxWidth: 760 }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Related Tools
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: { xs: 1.7, md: 1.58 } }}>
          Explore a few closely related tools to continue the same task or compare
          another approach.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 1.5, md: 1.25 }}>
        {tools.map((tool) => (
          <Grid key={tool.slug} size={{ xs: 12, md: 4 }}>
            <Card
              sx={(theme) => ({
                height: "100%",
                border: `1px solid ${theme.palette.divider}`,
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(180deg, rgba(20,32,50,0.98) 0%, rgba(12,20,32,0.96) 100%)"
                    : "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,250,0.94) 100%)",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 14px 30px rgba(0, 0, 0, 0.22)"
                    : "0 12px 26px rgba(11, 31, 51, 0.04)",
              })}
            >
              <CardActionArea
                component={Link}
                href={`/tool/${tool.slug}`}
                sx={{
                  height: "100%",
                  alignItems: "stretch",
                  "&:hover .related-tool-arrow": {
                    transform: "translate(2px, -2px)",
                    color: "secondary.main",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.25, md: 1.9 } }}>
                  <Stack spacing={{ xs: 1.25, md: 1 }} sx={{ height: "100%" }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={1.5}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "0.95rem" } }}>
                        {tool.name}
                      </Typography>
                      <ArrowOutwardRoundedIcon
                        className="related-tool-arrow"
                        color="action"
                        sx={{
                          flexShrink: 0,
                          transition: "transform 180ms ease, color 180ms ease",
                        }}
                      />
                    </Stack>
                    <Typography color="text.secondary" sx={{ lineHeight: { xs: 1.65, md: 1.55 } }}>
                      {tool.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default RelatedToolsSection;
