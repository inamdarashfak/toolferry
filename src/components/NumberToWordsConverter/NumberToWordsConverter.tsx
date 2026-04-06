'use client';

import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import ScrollToInstructionsButton from "../ScrollToInstructionsButton/ScrollToInstructionsButton";
import { getCalculatorPanelSx, getCalculatorPaperSx } from "../../lib/calculator";

const SMALL_NUMBERS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

const SCALES = [
  { value: 1_000_000_000, label: "billion" },
  { value: 1_000_000, label: "million" },
  { value: 1_000, label: "thousand" },
];

const DEFAULT_VALUE = "123456.78";

function convertHundreds(number: number): string {
  if (number < 20) {
    return SMALL_NUMBERS[number];
  }

  if (number < 100) {
    const tensPart = Math.floor(number / 10);
    const remainder = number % 10;
    return remainder ? `${TENS[tensPart]}-${SMALL_NUMBERS[remainder]}` : TENS[tensPart];
  }

  const hundredsPart = Math.floor(number / 100);
  const remainder = number % 100;
  return remainder
    ? `${SMALL_NUMBERS[hundredsPart]} hundred ${convertHundreds(remainder)}`
    : `${SMALL_NUMBERS[hundredsPart]} hundred`;
}

function numberToWords(number: number): string {
  if (number === 0) {
    return "zero";
  }

  let remainder = number;
  const parts: string[] = [];

  for (const scale of SCALES) {
    if (remainder >= scale.value) {
      const chunk = Math.floor(remainder / scale.value);
      parts.push(`${convertHundreds(chunk)} ${scale.label}`);
      remainder %= scale.value;
    }
  }

  if (remainder > 0) {
    parts.push(convertHundreds(remainder));
  }

  return parts.join(" ");
}

function NumberToWordsConverter() {
  const [value, setValue] = useState(DEFAULT_VALUE);

  const result = useMemo(() => {
    const trimmed = value.trim();
    if (!trimmed) {
      return {
        error: "Enter a number to convert.",
        output: "",
      };
    }

    const numericValue = Number(trimmed);
    if (!Number.isFinite(numericValue) || Math.abs(numericValue) >= 1_000_000_000_000) {
      return {
        error: "Enter a valid number below one trillion.",
        output: "",
      };
    }

    const [integerText, decimalText = ""] = trimmed.replace(/,/g, "").split(".");
    const integerPart = Math.abs(Number(integerText));
    const words = numberToWords(integerPart);
    const decimalWords = decimalText
      ? ` point ${decimalText
          .split("")
          .map((digit) => SMALL_NUMBERS[Number(digit)] ?? "")
          .join(" ")}`
      : "";

    return {
      error: "",
      output: `${numericValue < 0 ? "minus " : ""}${words}${decimalWords}`.trim(),
    };
  }, [value]);

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                Number to Words Converter
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Convert a numeric value into English words for documents, checks, and
              written references.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Number"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                  />

                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    startIcon={<AutorenewRoundedIcon />}
                    onClick={() => setValue(DEFAULT_VALUE)}
                    sx={{ alignSelf: "flex-start", borderRadius: 0 }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper sx={(theme) => ({ ...getCalculatorPanelSx(theme), minHeight: "100%" })}>
                <Stack spacing={1.5} divider={<Divider flexItem />}>
                  <Box>
                    <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 700 }}>
                      Words Output
                    </Typography>
                  </Box>

                  {result.error ? (
                    <Typography color="text.secondary">{result.error}</Typography>
                  ) : (
                    <Typography sx={{ fontWeight: 700, lineHeight: 1.7 }}>
                      {result.output}
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default NumberToWordsConverter;
