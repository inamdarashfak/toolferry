'use client';

import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useRef, useState } from "react";
import ScrollToInstructionsButton from "../ScrollToInstructionsButton/ScrollToInstructionsButton";
import { preserveFormattedNumberCaret } from "../../lib/formattedNumericInput";

type CurrencyOption = {
  code: string;
  locale: string;
  symbol: string;
};

const currencyOptions: CurrencyOption[] = [
  { code: "INR", locale: "en-IN", symbol: "Rs" },
  { code: "USD", locale: "en-US", symbol: "$" },
  { code: "EUR", locale: "de-DE", symbol: "EUR" },
  { code: "GBP", locale: "en-GB", symbol: "GBP" },
  { code: "AED", locale: "en-AE", symbol: "AED" },
];

const gstSlabs = [0, 5, 12, 18, 28, 40];

const DEFAULT_VALUES = {
  amount: "10000",
  gstRate: "18",
  taxMode: "exclusive",
};

function detectDefaultCurrency() {
  if (typeof navigator === "undefined") {
    return currencyOptions[0];
  }

  const locale = navigator.language || "en-IN";
  const region = locale.split("-")[1]?.toUpperCase();

  const regionalCurrencyMap: Record<string, string> = {
    AE: "AED",
    DE: "EUR",
    FR: "EUR",
    ES: "EUR",
    GB: "GBP",
    IN: "INR",
    US: "USD",
  };

  const matchedCode = regionalCurrencyMap[region ?? ""] ?? "INR";

  return (
    currencyOptions.find((option) => option.code === matchedCode) ??
    currencyOptions[0]
  );
}

function sanitizeNumericInput(value: string, allowDecimal = false) {
  const sanitized = value.replace(allowDecimal ? /[^0-9.]/g : /[^0-9]/g, "");

  if (!allowDecimal) {
    return sanitized;
  }

  const [integerPart, ...decimalParts] = sanitized.split(".");

  if (decimalParts.length === 0) {
    return sanitized;
  }

  return `${integerPart}.${decimalParts.join("")}`;
}

function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

function useAnimatedNumber(target: number) {
  const [displayValue, setDisplayValue] = useState(target);
  const displayValueRef = useRef(target);

  useEffect(() => {
    let animationFrame = 0;
    const startValue = displayValueRef.current;
    const startTime = performance.now();
    const duration = 320;

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (target - startValue) * easedProgress;

      displayValueRef.current = nextValue;
      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    if (startValue === target) {
      return () => cancelAnimationFrame(animationFrame);
    }

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [target]);

  return displayValue;
}

function GstCalculator() {
  const [amount, setAmount] = useState(DEFAULT_VALUES.amount);
  const [gstRate, setGstRate] = useState(DEFAULT_VALUES.gstRate);
  const [taxMode, setTaxMode] = useState(DEFAULT_VALUES.taxMode);
  const [currencyCode, setCurrencyCode] = useState(currencyOptions[0].code);

  useEffect(() => {
    setCurrencyCode(detectDefaultCurrency().code);
  }, []);

  const selectedCurrency =
    currencyOptions.find((option) => option.code === currencyCode) ??
    currencyOptions[0];
  const numberLocale = selectedCurrency.locale;

  const grossAmount = Number(amount) || 0;
  const rate = Number(gstRate) || 0;

  const { actualAmount, gstAmount, totalAmount, cgst, sgst, hasValidInput } =
    useMemo(() => {
      if (grossAmount < 0 || rate < 0) {
        return {
          actualAmount: 0,
          gstAmount: 0,
          totalAmount: 0,
          cgst: 0,
          sgst: 0,
          hasValidInput: false,
        };
      }

      if (taxMode === "inclusive") {
        const actual = grossAmount / (1 + rate / 100);
        const gst = grossAmount - actual;

        return {
          actualAmount: actual,
          gstAmount: gst,
          totalAmount: grossAmount,
          cgst: gst / 2,
          sgst: gst / 2,
          hasValidInput: true,
        };
      }

      const gst = grossAmount * (rate / 100);

      return {
        actualAmount: grossAmount,
        gstAmount: gst,
        totalAmount: grossAmount + gst,
        cgst: gst / 2,
        sgst: gst / 2,
        hasValidInput: true,
      };
    }, [grossAmount, rate, taxMode]);

  const animatedActual = useAnimatedNumber(actualAmount);
  const animatedGst = useAnimatedNumber(gstAmount);
  const animatedTotal = useAnimatedNumber(totalAmount);
  const animatedCgst = useAnimatedNumber(cgst);
  const animatedSgst = useAnimatedNumber(sgst);

  const handleReset = () => {
    setAmount(DEFAULT_VALUES.amount);
    setGstRate(DEFAULT_VALUES.gstRate);
    setTaxMode(DEFAULT_VALUES.taxMode);
    setCurrencyCode(detectDefaultCurrency().code);
  };

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper
        sx={(theme) => ({
          p: { xs: 2.5, md: 2.5 },
          borderRadius: 0,
          border: `1px solid ${theme.palette.divider}`,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(18,29,44,0.98) 0%, rgba(12,20,32,0.96) 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,248,248,0.96) 100%)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 20px 48px rgba(0, 0, 0, 0.26)"
              : "0 20px 50px rgba(11, 31, 51, 0.07)",
        })}
      >
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                GST Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}>
              Calculate GST instantly for inclusive or exclusive pricing and see
              the base amount, tax amount, and total at a glance.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper
                sx={{
                  p: { xs: 2.25, md: 2 },
                  borderRadius: 0,
                  border: "1px solid rgba(11, 31, 51, 0.08)",
                  boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
                }}
              >
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      spacing={0.5}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Amount
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedCurrency.symbol}{" "}
                        {formatNumber(grossAmount, numberLocale, {
                          maximumFractionDigits: 0,
                        })}
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={
                        amount === ""
                          ? ""
                          : formatNumber(Number(amount), numberLocale, {
                              maximumFractionDigits: 0,
                            })
                      }
                      onChange={(event) =>
                        preserveFormattedNumberCaret({
                          event,
                          nextValue: sanitizeNumericInput(event.target.value),
                          setValue: setAmount,
                          locale: numberLocale,
                        })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {selectedCurrency.symbol}
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Slider
                      size="small"
                      sx={{ mt: 1 }}
                      value={grossAmount || 0}
                      min={0}
                      max={100000000}
                      step={1000}
                      onChange={(_, value) => setAmount(String(value))}
                    />
                  </Box>

                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      spacing={0.5}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        GST Rate
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {rate || 0}%
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={gstRate}
                      onChange={(event) =>
                        setGstRate(sanitizeNumericInput(event.target.value, true))
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                    <Slider
                      size="small"
                      sx={{ mt: 1 }}
                      value={rate || 0}
                      min={0}
                      max={40}
                      step={1}
                      onChange={(_, value) => setGstRate(String(value))}
                    />
                  </Box>

                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Tax Mode"
                        value={taxMode}
                        onChange={(event) => setTaxMode(event.target.value)}
                      >
                        <MenuItem value="exclusive">Exclusive</MenuItem>
                        <MenuItem value="inclusive">Inclusive</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Currency"
                        value={currencyCode}
                        onChange={(event) => setCurrencyCode(event.target.value)}
                      >
                        {currencyOptions.map((option) => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.code}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <Grid container spacing={1}>
                    {gstSlabs.map((slab) => (
                    <Grid key={slab} size={{ xs: 6, sm: 4, md: 2 }}>
                        <Button
                          fullWidth
                          variant={rate === slab ? "contained" : "outlined"}
                          color={rate === slab ? "primary" : "inherit"}
                          size="small"
                          onClick={() => setGstRate(String(slab))}
                          sx={{ borderRadius: 0, minWidth: 0 }}
                        >
                          {slab}%
                        </Button>
                      </Grid>
                    ))}
                  </Grid>

                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    startIcon={<AutorenewRoundedIcon />}
                    onClick={handleReset}
                    sx={{ borderRadius: 0, alignSelf: "flex-start" }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper
                sx={(theme) => ({
                  p: { xs: 2.25, md: 2 },
                  height: "100%",
                  borderRadius: 0,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(10, 17, 27, 0.72)"
                      : theme.palette.background.paper,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 14px 30px rgba(0, 0, 0, 0.22)"
                      : "0 14px 30px rgba(11, 31, 51, 0.045)",
                })}
              >
                <Stack spacing={{ xs: 1.75, md: 1.5 }}>
                  <Stack
                    divider={<Divider />}
                    sx={(theme) => ({
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.04)"
                          : "rgba(245, 248, 248, 0.85)",
                    })}
                  >
                    <SummaryRow
                      label={taxMode === "inclusive" ? "Actual Amount" : "Base Amount"}
                      value={`${selectedCurrency.symbol} ${formatNumber(
                        animatedActual,
                        numberLocale
                      )}`}
                    />
                    <SummaryRow
                      label="GST Amount"
                      value={`${selectedCurrency.symbol} ${formatNumber(
                        animatedGst,
                        numberLocale
                      )}`}
                    />
                    <SummaryRow
                      label="Total Amount"
                      value={`${selectedCurrency.symbol} ${formatNumber(
                        animatedTotal,
                        numberLocale
                      )}`}
                    />
                    <SummaryRow
                      label="GST Rate Applied"
                      value={`${formatNumber(rate, numberLocale)}%`}
                    />
                  </Stack>

                  <Divider />

                  <Grid container spacing={{ xs: 2, md: 1.5 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper
                        sx={(theme) => ({
                          p: { xs: 2, md: 1.65 },
                          borderRadius: 0,
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(255,255,255,0.92)",
                        })}
                      >
                        <Stack spacing={{ xs: 1, md: 0.8 }}>
                          <Typography
                            variant="overline"
                            sx={{ color: "secondary.main", fontWeight: 700 }}
                          >
                            CGST Split
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 800, lineHeight: 1.1, fontSize: { xs: "1.5rem", md: "1.3rem" } }}
                          >
                            {selectedCurrency.symbol}{" "}
                            {formatNumber(animatedCgst, numberLocale)}
                          </Typography>
                          <Typography color="text.secondary">
                            50% of GST for intra-state scenarios.
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper
                        sx={(theme) => ({
                          p: { xs: 2, md: 1.65 },
                          borderRadius: 0,
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(255,255,255,0.92)",
                        })}
                      >
                        <Stack spacing={{ xs: 1, md: 0.8 }}>
                          <Typography
                            variant="overline"
                            sx={{ color: "secondary.main", fontWeight: 700 }}
                          >
                            SGST Split
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 800, lineHeight: 1.1, fontSize: { xs: "1.5rem", md: "1.3rem" } }}
                          >
                            {selectedCurrency.symbol}{" "}
                            {formatNumber(animatedSgst, numberLocale)}
                          </Typography>
                          <Typography color="text.secondary">
                            The remaining 50% of GST for intra-state supply.
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>

                  {!hasValidInput && (
                    <Typography color="error.main">
                      Enter a valid amount and GST rate to see results.
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

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      spacing={0.75}
      sx={{
        px: { xs: 2, md: 1.75 },
        py: { xs: 1.5, md: 1.2 },
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontWeight: 600 }}
      >
        {label}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          lineHeight: 1.2,
          fontSize: { xs: "1.05rem", md: "0.98rem" },
          wordBreak: "break-word",
          textAlign: { xs: "left", sm: "right" },
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

export default GstCalculator;
