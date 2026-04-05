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
    <Stack spacing={1.5}>
      <Box sx={{ maxWidth: 760 }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Related Tools
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Explore a few closely related tools to continue the same task or compare
          another approach.
        </Typography>
      </Box>

      <Grid container spacing={1.5}>
        {tools.map((tool) => (
          <Grid key={tool.slug} size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: "100%",
                border: "1px solid rgba(11, 31, 51, 0.08)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,250,0.94) 100%)",
                boxShadow: "0 12px 26px rgba(11, 31, 51, 0.04)",
              }}
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
                <CardContent sx={{ p: 2.25 }}>
                  <Stack spacing={1.25} sx={{ height: "100%" }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={1.5}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
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
                    <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
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
