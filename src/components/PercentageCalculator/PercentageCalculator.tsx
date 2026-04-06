'use client';

import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import ScrollToInstructionsButton from "../ScrollToInstructionsButton/ScrollToInstructionsButton";
import {
  formatNumber,
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from "../../lib/calculator";

type Mode = "percentOf" | "whatPercent" | "change";

const DEFAULT_VALUES = {
  mode: "percentOf" as Mode,
  valueA: "20",
  valueB: "500",
};

function sanitizeDecimalInput(value: string) {
  const sanitized = value.replace(/[^0-9.]/g, "");
  const [integerPart, ...decimalParts] = sanitized.split(".");

  if (decimalParts.length === 0) {
    return sanitized;
  }

  return `${integerPart}.${decimalParts.join("")}`;
}

function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>(DEFAULT_VALUES.mode);
  const [valueA, setValueA] = useState(DEFAULT_VALUES.valueA);
  const [valueB, setValueB] = useState(DEFAULT_VALUES.valueB);

  const firstValue = Number(valueA) || 0;
  const secondValue = Number(valueB) || 0;

  const result = useMemo(() => {
    if (valueA === "" || valueB === "") {
      return {
        hasValidInput: false,
        label: "Result",
        value: "",
        description: "Enter both values to calculate the result.",
      };
    }

    if (mode === "percentOf") {
      return {
        hasValidInput: true,
        label: "Value",
        value: formatNumber((firstValue / 100) * secondValue, "en-US", {
          maximumFractionDigits: 2,
        }),
        description: `${formatNumber(firstValue, "en-US", {
          maximumFractionDigits: 2,
        })}% of ${formatNumber(secondValue, "en-US", { maximumFractionDigits: 2 })}`,
      };
    }

    if (mode === "whatPercent") {
      if (secondValue === 0) {
        return {
          hasValidInput: false,
          label: "Percent",
          value: "",
          description: "The base value cannot be zero for percentage comparison.",
        };
      }

      return {
        hasValidInput: true,
        label: "Percent",
        value: `${formatNumber((firstValue / secondValue) * 100, "en-US", {
          maximumFractionDigits: 2,
        })}%`,
        description: `${formatNumber(firstValue, "en-US", {
          maximumFractionDigits: 2,
        })} is what percent of ${formatNumber(secondValue, "en-US", {
          maximumFractionDigits: 2,
        })}`,
      };
    }

    if (firstValue === 0) {
      return {
        hasValidInput: false,
        label: "Change",
        value: "",
        description: "The starting value cannot be zero for percentage change.",
      };
    }

    const change = ((secondValue - firstValue) / firstValue) * 100;

    return {
      hasValidInput: true,
      label: change >= 0 ? "Increase" : "Decrease",
      value: `${formatNumber(Math.abs(change), "en-US", {
        maximumFractionDigits: 2,
      })}%`,
      description: `${formatNumber(firstValue, "en-US", {
        maximumFractionDigits: 2,
      })} to ${formatNumber(secondValue, "en-US", { maximumFractionDigits: 2 })}`,
    };
  }, [firstValue, mode, secondValue, valueA, valueB]);

  const labels =
    mode === "percentOf"
      ? { first: "Percentage", second: "Of Value" }
      : mode === "whatPercent"
        ? { first: "Part Value", second: "Base Value" }
        : { first: "Starting Value", second: "Ending Value" };

  const handleReset = () => {
    setMode(DEFAULT_VALUES.mode);
    setValueA(DEFAULT_VALUES.valueA);
    setValueB(DEFAULT_VALUES.valueB);
  };

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                Percentage Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}>
              Switch between common percentage calculations such as finding a percent of a
              value, reversing a percentage, or measuring percentage change.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Calculation Mode"
                    value={mode}
                    onChange={(event) => setMode(event.target.value as Mode)}
                  >
                    <MenuItem value="percentOf">X% of Y</MenuItem>
                    <MenuItem value="whatPercent">X is what % of Y</MenuItem>
                    <MenuItem value="change">Percentage change from X to Y</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    size="small"
                    label={labels.first}
                    value={valueA}
                    onChange={(event) => setValueA(sanitizeDecimalInput(event.target.value))}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label={labels.second}
                    value={valueB}
                    onChange={(event) => setValueB(sanitizeDecimalInput(event.target.value))}
                  />

                  <Box>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<AutorenewRoundedIcon />}
                      onClick={handleReset}
                      sx={{ borderRadius: 0 }}
                    >
                      Reset
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper sx={(theme) => ({ ...getCalculatorPanelSx(theme), minHeight: "100%" })}>
                <Stack spacing={1.5} divider={<Divider flexItem />}>
                  <Box>
                    <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 700 }}>
                      Result
                    </Typography>
                  </Box>

                  {result.hasValidInput ? (
                    <>
                      <Stack spacing={0.75}>
                        <Typography color="text.secondary">{result.description}</Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: "1.8rem", md: "2.2rem" },
                            fontWeight: 700,
                            lineHeight: 1.1,
                          }}
                        >
                          {result.value}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Output Type</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.label}</Typography>
                      </Stack>
                    </>
                  ) : (
                    <Typography color="text.secondary">{result.description}</Typography>
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

export default PercentageCalculator;
