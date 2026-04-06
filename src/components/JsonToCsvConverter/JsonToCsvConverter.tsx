'use client';

import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import ScrollToInstructionsButton from "../ScrollToInstructionsButton/ScrollToInstructionsButton";
import { getCalculatorPanelSx, getCalculatorPaperSx } from "../../lib/calculator";

const SAMPLE_JSON = `[
  { "name": "Anika", "city": "Mumbai", "score": 91 },
  { "name": "Luis", "city": "London", "score": 88 },
  { "name": "Maya", "city": "Singapore", "score": 95 }
]`;

function escapeCsvValue(value: unknown) {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function isFlatRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(
      (item) => item == null || ["string", "number", "boolean"].includes(typeof item),
    )
  );
}

function convertJsonToCsv(text: string) {
  const parsed = JSON.parse(text);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Enter a JSON array with at least one object.");
  }

  if (!parsed.every((item) => isFlatRecord(item))) {
    throw new Error("This version supports arrays of flat objects only.");
  }

  const headers = Array.from(
    new Set(parsed.flatMap((item) => Object.keys(item))),
  );

  const rows = parsed.map((item) =>
    headers.map((header) => escapeCsvValue(item[header])).join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

function JsonToCsvConverter() {
  const [input, setInput] = useState(SAMPLE_JSON);

  const result = useMemo(() => {
    try {
      return {
        error: "",
        output: convertJsonToCsv(input),
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unable to convert JSON to CSV.",
        output: "",
      };
    }
  }, [input]);

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                JSON to CSV Converter
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Paste a JSON array of flat objects and convert it into CSV with
              header columns.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={1.5}>
                  <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 700 }}>
                    JSON Input
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={12}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                  />
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    startIcon={<AutorenewRoundedIcon />}
                    onClick={() => setInput(SAMPLE_JSON)}
                    sx={{ alignSelf: "flex-start", borderRadius: 0 }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper sx={(theme) => ({ ...getCalculatorPanelSx(theme), minHeight: "100%" })}>
                <Stack spacing={1.5}>
                  <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 700 }}>
                    CSV Output
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={12}
                    value={result.error ? result.error : result.output}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                    error={Boolean(result.error)}
                  />
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default JsonToCsvConverter;
