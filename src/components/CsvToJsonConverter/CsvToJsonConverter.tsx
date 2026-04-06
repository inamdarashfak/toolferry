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

const SAMPLE_CSV = `name,city,score
Anika,Mumbai,91
Luis,London,88
Maya,Singapore,95`;

function parseCsv(text: string) {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (character === '"') {
      if (insideQuotes && nextCharacter === '"') {
        currentValue += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (character === "," && !insideQuotes) {
      currentRow.push(currentValue);
      currentValue = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !insideQuotes) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }

      currentRow.push(currentValue);
      if (currentRow.some((value) => value.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  currentRow.push(currentValue);
  if (currentRow.some((value) => value.length > 0)) {
    rows.push(currentRow);
  }

  if (rows.length < 2) {
    throw new Error("Add a header row and at least one data row.");
  }

  const [headers, ...dataRows] = rows;

  return dataRows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), row[index] ?? ""])),
  );
}

function CsvToJsonConverter() {
  const [input, setInput] = useState(SAMPLE_CSV);

  const result = useMemo(() => {
    try {
      return {
        error: "",
        output: JSON.stringify(parseCsv(input), null, 2),
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unable to convert CSV to JSON.",
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
                CSV to JSON Converter
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Paste CSV with a header row and convert it into formatted JSON for
              easier inspection and reuse.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={1.5}>
                  <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 700 }}>
                    CSV Input
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
                    onClick={() => setInput(SAMPLE_CSV)}
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
                    JSON Output
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

export default CsvToJsonConverter;
