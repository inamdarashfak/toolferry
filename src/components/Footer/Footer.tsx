'use client';

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { toolCategories } from "../../data/toolCategories";
import { tools } from "../../data/tools";
import Container from "../Container/Container";
import ToolFerryLogo from "../ToolFerryLogo/ToolFerryLogo";

function Footer() {
  const primaryLinks = [
    { label: "Home", to: "/" },
    { label: "Contact Us", to: "/contact-us" },
    { label: "Privacy Policy", to: "/privacy-policy" },
  ];

  const toolLinks = tools.slice(0, 6);
  const categoryLinks = toolCategories.slice(0, 6);

  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 6, md: 7 },
        borderTop: "1px solid rgba(11, 31, 51, 0.08)",
        backgroundColor: "rgba(255, 255, 255, 0.72)",
      }}
    >
      <Container>
        <Grid container spacing={{ xs: 3, md: 3 }} sx={{ py: { xs: 4, md: 3.5 } }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={{ xs: 1.5, md: 1.2 }}>
              <Box component={NextLink} href="/" sx={{ display: "inline-flex", width: "fit-content" }}>
                <ToolFerryLogo compact />
              </Box>
              <Typography color="text.secondary" sx={{ maxWidth: 420, lineHeight: { xs: 1.7, md: 1.58 } }}>
                ToolFerry brings practical calculators and utility tools into one
                focused, easy-to-use workspace.
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack spacing={{ xs: 1.2, md: 0.95 }}>
              <Typography variant="overline" sx={{ color: "secondary.main" }}>
                Sitemap
              </Typography>
              {primaryLinks.map((linkItem) => (
                <Link
                  key={linkItem.to}
                  component={NextLink}
                  href={linkItem.to}
                  color="text.secondary"
                  underline="hover"
                  sx={{
                    width: "fit-content",
                    '&:hover': {
                      color: '#c7573a',
                    },
                  }}
                >
                  {linkItem.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Stack spacing={{ xs: 1.2, md: 0.95 }}>
              <Typography variant="overline" sx={{ color: "secondary.main" }}>
                Categories
              </Typography>
              {categoryLinks.map((category) => (
                <Link
                  key={category.slug}
                  component={NextLink}
                  href={`/category/${category.slug}`}
                  color="text.secondary"
                  underline="hover"
                  sx={{
                    width: "fit-content",
                    '&:hover': {
                      color: '#c7573a',
                    },
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Stack spacing={{ xs: 1.2, md: 0.95 }}>
              <Typography variant="overline" sx={{ color: "secondary.main" }}>
                Popular Tools
              </Typography>
              {toolLinks.map((tool) => (
                <Link
                  key={tool.slug}
                  component={NextLink}
                  href={`/tool/${tool.slug}`}
                  color="text.secondary"
                  underline="hover"
                  sx={{
                    width: "fit-content",
                    '&:hover': {
                      color: '#c7573a',
                    },
                  }}
                >
                  {tool.name}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Box
          sx={{
            py: { xs: 1.75, md: 1.5 },
            borderTop: "1px solid rgba(11, 31, 51, 0.08)",
          }}
        >
          <Typography color="text.secondary" sx={{ fontSize: { xs: "0.9rem", md: "0.84rem" } }}>
            © {new Date().getFullYear()} ToolFerry. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
