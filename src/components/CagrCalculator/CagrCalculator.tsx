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
import {
  formatNumber,
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from "../../lib/calculator";
import { preserveFormattedNumberCaret } from "../../lib/formattedNumericInput";

const DEFAULT_VALUES = {
  initialValue: "100000",
  finalValue: "175000",
  years: "5",
};

function sanitizeDecimalInput(value: string) {
  const sanitized = value.replace(/[^0-9.]/g, "");
  const [integerPart, ...decimalParts] = sanitized.split(".");

  if (decimalParts.length === 0) {
    return sanitized;
  }

  return `${integerPart}.${decimalParts.join("")}`;
}

function CagrCalculator() {
  const [initialValue, setInitialValue] = useState(DEFAULT_VALUES.initialValue);
  const [finalValue, setFinalValue] = useState(DEFAULT_VALUES.finalValue);
  const [years, setYears] = useState(DEFAULT_VALUES.years);

  const principal = Number(initialValue) || 0;
  const endingValue = Number(finalValue) || 0;
  const durationYears = Number(years) || 0;

  const result = useMemo(() => {
    if (principal <= 0 || endingValue <= 0 || durationYears <= 0) {
      return {
        hasValidInput: false,
        cagr: 0,
        absoluteGain: 0,
        growthMultiple: 0,
      };
    }

    const cagr = (Math.pow(endingValue / principal, 1 / durationYears) - 1) * 100;

    return {
      hasValidInput: true,
      cagr,
      absoluteGain: endingValue - principal,
      growthMultiple: endingValue / principal,
    };
  }, [durationYears, endingValue, principal]);

  const handleReset = () => {
    setInitialValue(DEFAULT_VALUES.initialValue);
    setFinalValue(DEFAULT_VALUES.finalValue);
    setYears(DEFAULT_VALUES.years);
  };

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                CAGR Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}>
              Calculate the compounded annual growth rate between a starting value and an
              ending value over a selected time period.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Initial Value"
                    value={
                      initialValue === ""
                        ? ""
                        : formatNumber(Number(initialValue), "en-US", {
                            maximumFractionDigits: 2,
                          })
                    }
                    onChange={(event) => {
                      const nextValue = sanitizeDecimalInput(event.target.value);
                      preserveFormattedNumberCaret({
                        event,
                        nextValue,
                        setValue: setInitialValue,
                        locale: "en-US",
                        options: { maximumFractionDigits: 2 },
                      });
                    }}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="Final Value"
                    value={
                      finalValue === ""
                        ? ""
                        : formatNumber(Number(finalValue), "en-US", {
                            maximumFractionDigits: 2,
                          })
                    }
                    onChange={(event) => {
                      const nextValue = sanitizeDecimalInput(event.target.value);
                      preserveFormattedNumberCaret({
                        event,
                        nextValue,
                        setValue: setFinalValue,
                        locale: "en-US",
                        options: { maximumFractionDigits: 2 },
                      });
                    }}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="Time Period (Years)"
                    value={years}
                    onChange={(event) => setYears(sanitizeDecimalInput(event.target.value))}
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
                      Annualized Growth
                    </Typography>
                  </Box>

                  {result.hasValidInput ? (
                    <>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">CAGR</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {formatNumber(result.cagr, "en-US", { maximumFractionDigits: 2 })}%
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Absolute Gain</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {formatNumber(result.absoluteGain, "en-US", {
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Growth Multiple</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {formatNumber(result.growthMultiple, "en-US", {
                            maximumFractionDigits: 2,
                          })}
                          x
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Ending Value</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {formatNumber(endingValue, "en-US", { maximumFractionDigits: 2 })}
                        </Typography>
                      </Stack>
                    </>
                  ) : (
                    <Typography color="text.secondary">
                      Enter positive starting and ending values plus a valid time period to
                      calculate CAGR.
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

export default CagrCalculator;
