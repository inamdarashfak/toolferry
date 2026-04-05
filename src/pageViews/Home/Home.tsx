import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import Container from "../../components/Container/Container";
import { toolCategories } from "../../data/toolCategories";
import ToolCard from "../../components/ToolCard/ToolCard";
import { tools } from "../../data/tools";

function Home() {
  return (
    <Container>
      <Stack spacing={{ xs: 4, md: 6 }}>
        <Paper
          sx={{
            p: { xs: 2.5, sm: 3.5, md: 4.5 },
            borderRadius: 0,
            border: "1px solid rgba(11, 31, 51, 0.08)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(247,250,250,0.98) 100%)",
            boxShadow: "0 18px 40px rgba(11, 31, 51, 0.05)",
          }}
        >
          <Stack spacing={2}>
            <Chip
              label="Everyday utility platform"
              sx={{
                alignSelf: "flex-start",
                backgroundColor: "rgba(255, 122, 89, 0.1)",
                color: "#c7573a",
              }}
            />
            <Box sx={{ maxWidth: 860 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2rem", sm: "2.8rem", md: "4.2rem" },
                  lineHeight: { xs: 1.1, md: 1.02 },
                  letterSpacing: "-0.05em",
                  mb: 2,
                  maxWidth: 900,
                }}
              >
                Practical tools, presented with a cleaner and calmer interface.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "1rem", md: "1.08rem" },
                  maxWidth: 700,
                }}
              >
                ToolFerry brings calculators and utility tools into one focused
                workspace, from EMI, FD, GST, and mutual fund estimates to text
                formatting, JSON inspection, unit conversion, and date-based
                tools.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {tools.map((tool) => (
            <Grid key={tool.slug} size={{ xs: 12, sm: 6, md: 4 }}>
              <ToolCard tool={tool} />
            </Grid>
          ))}
        </Grid>

        <Stack spacing={2}>
          <Box sx={{ maxWidth: 760 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: "1.45rem", md: "1.9rem" }, mb: 0.75 }}>
              Explore by category
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
              Browse tools by use case so related calculators and utilities are easier to discover and compare.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {toolCategories.map((category) => (
              <Grid key={category.slug} size={{ xs: 12, sm: 6, md: 4 }}>
                <CategoryCard
                  category={category}
                  toolCount={tools.filter((tool) => tool.categorySlug === category.slug).length}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Home;
