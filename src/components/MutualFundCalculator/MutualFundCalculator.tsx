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
import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useRef, useState } from "react";
import ScrollToInstructionsButton from "../ScrollToInstructionsButton/ScrollToInstructionsButton";
import { preserveFormattedNumberCaret } from "../../lib/formattedNumericInput";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

const DEFAULT_VALUES = {
  investmentAmount: "100000",
  sipAmount: "5000",
  stepUpRate: "0",
  returnRate: "12",
  timePeriodYears: "10",
  inflationRate: "6",
  investmentMode: "lumpsum",
};

const PIE_COLORS = ["#0b1f33", "#0f8b8d"];

function clampInflationRate(value: number) {
  return Math.min(8, Math.max(2, value));
}

function getInflationAdjustedValue(
  value: number,
  years: number,
  inflationRate: number
) {
  return value / Math.pow(1 + inflationRate / 100, years);
}

function getMonthlyRealRate(annualReturnRate: number, inflationRate: number) {
  const annualGrowthFactor = 1 + annualReturnRate / 100;
  const annualInflationFactor = 1 + inflationRate / 100;

  return Math.pow(annualGrowthFactor / annualInflationFactor, 1 / 12) - 1;
}

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

function formatTooltipCurrencyValue(
  value: number | string | ReadonlyArray<number | string> | undefined,
  locale: string,
  symbol: string
) {
  const normalizedValue = Array.isArray(value)
    ? Number(value[0])
    : Number(value);

  return `${symbol} ${formatNumber(
    Number.isFinite(normalizedValue) ? normalizedValue : 0,
    locale
  )}`;
}

function formatAxisCurrencyValue(value: number) {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(0)}k`;
  }

  return formatNumber(value, "en-US", { maximumFractionDigits: 0 });
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

function MutualFundCalculator() {
  const theme = useTheme();
  const [investmentMode, setInvestmentMode] = useState(
    DEFAULT_VALUES.investmentMode
  );
  const [investmentAmount, setInvestmentAmount] = useState(
    DEFAULT_VALUES.investmentAmount
  );
  const [sipAmount, setSipAmount] = useState(DEFAULT_VALUES.sipAmount);
  const [stepUpRate, setStepUpRate] = useState(DEFAULT_VALUES.stepUpRate);
  const [returnRate, setReturnRate] = useState(DEFAULT_VALUES.returnRate);
  const [timePeriodYears, setTimePeriodYears] = useState(
    DEFAULT_VALUES.timePeriodYears
  );
  const [inflationRate, setInflationRate] = useState(
    DEFAULT_VALUES.inflationRate
  );
  const [currencyCode, setCurrencyCode] = useState(currencyOptions[0].code);

  useEffect(() => {
    setCurrencyCode(detectDefaultCurrency().code);
  }, []);

  const selectedCurrency =
    currencyOptions.find((option) => option.code === currencyCode) ??
    currencyOptions[0];
  const numberLocale = selectedCurrency.locale;

  const lumpsum = Number(investmentAmount) || 0;
  const monthlySip = Number(sipAmount) || 0;
  const yearlyStepUp = Number(stepUpRate) || 0;
  const annualRate = Number(returnRate) || 0;
  const years = Number(timePeriodYears) || 0;
  const selectedInflationRate = clampInflationRate(Number(inflationRate) || 0);

  const {
    investedAmount,
    estimatedReturns,
    totalValue,
    inflationAdjustedValue,
    growthSeries,
    hasValidInput,
  } = useMemo(() => {
    if (annualRate < 0 || years <= 0) {
      return {
        investedAmount: 0,
        estimatedReturns: 0,
        totalValue: 0,
        inflationAdjustedValue: 0,
        growthSeries: [],
        hasValidInput: false,
      };
    }

    const yearlySeries = [];

    if (investmentMode === "sip") {
      if (monthlySip <= 0 || yearlyStepUp < 0 || yearlyStepUp > 100) {
        return {
          investedAmount: 0,
          estimatedReturns: 0,
          totalValue: 0,
          inflationAdjustedValue: 0,
          growthSeries: [],
          hasValidInput: false,
        };
      }

      const monthlyRate = annualRate / 12 / 100;
      const monthlyRealRate = getMonthlyRealRate(
        annualRate,
        selectedInflationRate
      );
      const months = Math.round(years * 12);
      let futureValue = 0;
      let inflationAdjustedFutureValue = 0;
      let invested = 0;

      for (let month = 1; month <= months; month += 1) {
        const currentYearIndex = Math.floor((month - 1) / 12);
        const steppedSip =
          monthlySip * Math.pow(1 + yearlyStepUp / 100, currentYearIndex);

        invested += steppedSip;
        futureValue = (futureValue + steppedSip) * (1 + monthlyRate);
        inflationAdjustedFutureValue =
          (inflationAdjustedFutureValue + steppedSip) * (1 + monthlyRealRate);
      }

      for (let year = 1; year <= Math.ceil(years); year += 1) {
        const effectiveMonths = Math.min(year * 12, months);
        let pointValue = 0;
        let inflationAdjustedPointValue = 0;
        let pointInvested = 0;

        for (let month = 1; month <= effectiveMonths; month += 1) {
          const currentYearIndex = Math.floor((month - 1) / 12);
          const steppedSip =
            monthlySip * Math.pow(1 + yearlyStepUp / 100, currentYearIndex);

          pointInvested += steppedSip;
          pointValue = (pointValue + steppedSip) * (1 + monthlyRate);
          inflationAdjustedPointValue =
            (inflationAdjustedPointValue + steppedSip) * (1 + monthlyRealRate);
        }

        yearlySeries.push({
          label: `Year ${year}`,
          portfolioValue: Number(pointValue.toFixed(2)),
          inflationAdjustedValue: Number(
            inflationAdjustedPointValue.toFixed(2)
          ),
          investedAmount: Number(pointInvested.toFixed(2)),
          estimatedReturns: Number((pointValue - pointInvested).toFixed(2)),
        });
      }

      return {
        investedAmount: invested,
        estimatedReturns: futureValue - invested,
        totalValue: futureValue,
        inflationAdjustedValue: inflationAdjustedFutureValue,
        growthSeries: yearlySeries,
        hasValidInput: true,
      };
    }

    if (lumpsum <= 0) {
      return {
        investedAmount: 0,
        estimatedReturns: 0,
        totalValue: 0,
        inflationAdjustedValue: 0,
        growthSeries: [],
        hasValidInput: false,
      };
    }

    const futureValue = lumpsum * Math.pow(1 + annualRate / 100, years);

    for (let year = 1; year <= Math.ceil(years); year += 1) {
      const effectiveYears = Math.min(year, years);
      const pointValue = lumpsum * Math.pow(1 + annualRate / 100, effectiveYears);
        yearlySeries.push({
          label: `Year ${year}`,
          portfolioValue: Number(pointValue.toFixed(2)),
          inflationAdjustedValue: Number(
            getInflationAdjustedValue(
              pointValue,
              effectiveYears,
              selectedInflationRate
            ).toFixed(2)
          ),
          investedAmount: lumpsum,
          estimatedReturns: Number((pointValue - lumpsum).toFixed(2)),
        });
      }

    return {
      investedAmount: lumpsum,
      estimatedReturns: futureValue - lumpsum,
      totalValue: futureValue,
      inflationAdjustedValue: getInflationAdjustedValue(
        futureValue,
        years,
        selectedInflationRate
      ),
      growthSeries: yearlySeries,
      hasValidInput: true,
    };
  }, [
    annualRate,
    investmentMode,
    lumpsum,
    monthlySip,
    selectedInflationRate,
    years,
    yearlyStepUp,
  ]);

  const animatedInvested = useAnimatedNumber(investedAmount);
  const animatedReturns = useAnimatedNumber(estimatedReturns);
  const animatedTotal = useAnimatedNumber(totalValue);
  const animatedInflationAdjusted = useAnimatedNumber(inflationAdjustedValue);
  const chartData = [
    { name: "Invested", value: investedAmount },
    { name: "Returns", value: estimatedReturns },
  ];

  const renderChartTooltip = ({
    active,
    label,
    payload,
  }: {
    active?: boolean;
    label?: string | number;
    payload?: ReadonlyArray<{
      color?: string;
      dataKey?: unknown;
      name?: unknown;
      value?: number | string;
    }>;
  }) => {
    if (!active || !payload?.length) {
      return null;
    }

    const tooltipLabel =
      typeof label === "string" || typeof label === "number"
        ? String(label)
        : payload[0]?.name != null
          ? String(payload[0].name)
          : undefined;

    return (
      <Box
        sx={{
          minWidth: 156,
          px: 1.25,
          py: 1,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(11, 19, 32, 0.99)"
              : "rgba(255, 255, 255, 0.99)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 12px 24px rgba(0, 0, 0, 0.28)"
              : "0 10px 20px rgba(11, 31, 51, 0.12)",
        }}
      >
        {tooltipLabel ? (
          <Typography
            sx={{
              mb: 0.5,
              color: "text.secondary",
              fontSize: "0.76rem",
              fontWeight: 700,
            }}
          >
            {tooltipLabel}
          </Typography>
        ) : null}
        <Stack spacing={0.45}>
          {payload.map((entry) => (
            <Stack
              key={`${String(entry.dataKey ?? entry.name)}`}
              direction="row"
              spacing={0.75}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  flexShrink: 0,
                  backgroundColor: entry.color ?? "secondary.main",
                }}
              />
              <Typography sx={{ fontSize: "0.8rem", color: "text.primary" }}>
                {String(entry.name)}:{" "}
                {formatTooltipCurrencyValue(
                  entry.value,
                  numberLocale,
                  selectedCurrency.symbol
                )}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    );
  };

  const handleReset = () => {
    setInvestmentMode(DEFAULT_VALUES.investmentMode);
    setInvestmentAmount(DEFAULT_VALUES.investmentAmount);
    setSipAmount(DEFAULT_VALUES.sipAmount);
    setStepUpRate(DEFAULT_VALUES.stepUpRate);
    setReturnRate(DEFAULT_VALUES.returnRate);
    setTimePeriodYears(DEFAULT_VALUES.timePeriodYears);
    setInflationRate(DEFAULT_VALUES.inflationRate);
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
                Mutual Fund Returns Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}>
              Estimate invested amount, expected returns, and future portfolio
              value for one-time or SIP-based mutual fund investing.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper
                sx={{
                  p: { xs: 2.25, md: 2 },
                  borderRadius: 0,
                  border: "1px solid rgba(11, 31, 51, 0.08)",
                  boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
                }}
              >
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Button
                      variant={
                        investmentMode === "lumpsum" ? "contained" : "outlined"
                      }
                      color={
                        investmentMode === "lumpsum" ? "primary" : "inherit"
                      }
                      size="small"
                      onClick={() => setInvestmentMode("lumpsum")}
                      sx={{ borderRadius: 0 }}
                    >
                      One-time
                    </Button>
                    <Button
                      variant={
                        investmentMode === "sip" ? "contained" : "outlined"
                      }
                      color={investmentMode === "sip" ? "primary" : "inherit"}
                      size="small"
                      onClick={() => setInvestmentMode("sip")}
                      sx={{ borderRadius: 0 }}
                    >
                      Monthly SIP
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<AutorenewRoundedIcon />}
                      onClick={handleReset}
                      sx={{
                        borderRadius: 0,
                        minHeight: 40,
                        alignSelf: { xs: "stretch", sm: "auto" },
                      }}
                    >
                      Reset
                    </Button>
                  </Stack>

                  {investmentMode === "lumpsum" ? (
                    <Box>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Total Investment
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedCurrency.symbol}{" "}
                          {formatNumber(lumpsum, numberLocale, {
                            maximumFractionDigits: 0,
                          })}
                        </Typography>
                      </Stack>
                      <TextField
                        fullWidth
                        size="small"
                        value={
                          investmentAmount === ""
                            ? ""
                            : formatNumber(
                                Number(investmentAmount),
                                numberLocale,
                                {
                                  maximumFractionDigits: 0,
                                }
                              )
                        }
                        onChange={(event) =>
                          preserveFormattedNumberCaret({
                            event,
                            nextValue: sanitizeNumericInput(event.target.value),
                            setValue: setInvestmentAmount,
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
                        value={lumpsum || 0}
                        min={0}
                        max={5000000}
                        step={25000}
                        onChange={(_, value) =>
                          setInvestmentAmount(String(value))
                        }
                      />
                    </Box>
                  ) : (
                    <Stack spacing={2}>
                      <Box>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          spacing={0.5}
                          sx={{ mb: 1 }}
                        >
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Monthly Investment
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedCurrency.symbol}{" "}
                            {formatNumber(monthlySip, numberLocale, {
                              maximumFractionDigits: 0,
                            })}
                          </Typography>
                        </Stack>
                        <TextField
                          fullWidth
                          size="small"
                          value={
                            sipAmount === ""
                              ? ""
                              : formatNumber(Number(sipAmount), numberLocale, {
                                  maximumFractionDigits: 0,
                                })
                          }
                          onChange={(event) =>
                            preserveFormattedNumberCaret({
                              event,
                              nextValue: sanitizeNumericInput(event.target.value),
                              setValue: setSipAmount,
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
                          value={monthlySip || 0}
                          min={0}
                          max={100000}
                          step={1000}
                          onChange={(_, value) => setSipAmount(String(value))}
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
                            Step-up Each Year
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {yearlyStepUp || 0}%
                          </Typography>
                        </Stack>
                        <TextField
                          fullWidth
                          size="small"
                          value={stepUpRate}
                          onChange={(event) =>
                            setStepUpRate(
                              sanitizeNumericInput(event.target.value, true)
                            )
                          }
                          helperText="Increase the SIP amount every year."
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                        />
                        <Slider
                          size="small"
                          sx={{ mt: 1 }}
                          value={yearlyStepUp || 0}
                          min={0}
                          max={100}
                          step={1}
                          onChange={(_, value) => setStepUpRate(String(value))}
                        />
                      </Box>
                    </Stack>
                  )}

                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      spacing={0.5}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Expected Return Rate
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {returnRate || 0}%
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={returnRate}
                      onChange={(event) =>
                        setReturnRate(
                          sanitizeNumericInput(event.target.value, true)
                        )
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
                      value={annualRate || 0}
                      min={0}
                      max={20}
                      step={0.1}
                      onChange={(_, value) => setReturnRate(String(value))}
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
                        Time Period
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {years || 0} years
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={timePeriodYears}
                      onChange={(event) =>
                        setTimePeriodYears(
                          sanitizeNumericInput(event.target.value, true)
                        )
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">Yr</InputAdornment>
                        ),
                      }}
                    />
                    <Slider
                      size="small"
                      sx={{ mt: 1 }}
                      value={years || 0}
                      min={0}
                      max={30}
                      step={1}
                      onChange={(_, value) => setTimePeriodYears(String(value))}
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
                        Inflation Rate
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedInflationRate}%
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={inflationRate}
                      onChange={(event) =>
                        setInflationRate(
                          sanitizeNumericInput(event.target.value, true)
                        )
                      }
                      helperText="Used to calculate inflation-adjusted value."
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                    <Slider
                      size="small"
                      sx={{ mt: 1 }}
                      value={selectedInflationRate}
                      min={2}
                      max={8}
                      step={0.1}
                      onChange={(_, value) => setInflationRate(String(value))}
                    />
                  </Box>

                  <Grid container spacing={1.5} alignItems="end">
                    <Grid size={{ xs: 12, sm: 12 }}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Currency"
                        value={currencyCode}
                        onChange={(event) =>
                          setCurrencyCode(event.target.value)
                        }
                      >
                        {currencyOptions.map((option) => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.code}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper
                sx={(theme) => ({
                  p: 2.25,
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
                <Stack spacing={1.75}>
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
                      label="Invested Amount"
                      value={`${selectedCurrency.symbol} ${formatNumber(
                        animatedInvested,
                        numberLocale
                      )}`}
                    />
                    <SummaryRow
                      label="Estimated Returns"
                      value={`${selectedCurrency.symbol} ${formatNumber(
                        animatedReturns,
                        numberLocale
                      )}`}
                    />
                    <SummaryRow
                      label="Total Value"
                      value={`${selectedCurrency.symbol} ${formatNumber(
                        animatedTotal,
                        numberLocale
                      )}`}
                    />
                  </Stack>

                  <Box
                    sx={(theme) => ({
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.03)"
                          : "rgba(255, 255, 255, 0.85)",
                    })}
                  >
                    <SummaryRow
                      label="Inflation-adjusted Value"
                      value={`${selectedCurrency.symbol} ${formatNumber(
                        animatedInflationAdjusted,
                        numberLocale
                      )}`}
                    />
                    <Divider />
                    <SummaryRow
                      label="Inflation Assumption"
                      value={`${formatNumber(selectedInflationRate, numberLocale)}% yearly`}
                    />
                  </Box>

                  <Divider />

                  <Grid container spacing={1.5} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ minHeight: { xs: 200, md: 220 } }}>
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart>
                            <Pie
                              data={chartData}
                              dataKey="value"
                              innerRadius={52}
                              outerRadius={74}
                              paddingAngle={2}
                              animationDuration={500}
                            >
                              {chartData.map((entry, index) => (
                                <Cell
                                  key={entry.name}
                                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              content={(props) => renderChartTooltip(props as any)}
                              formatter={(value) =>
                                formatTooltipCurrencyValue(
                                  value,
                                  numberLocale,
                                  selectedCurrency.symbol
                                )
                              }
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack spacing={{ xs: 2, md: 1.5 }}>
                        <KeyValue
                          label="Invested amount"
                          value={`${selectedCurrency.symbol}${formatNumber(
                            investedAmount,
                            numberLocale
                          )}`}
                          color={PIE_COLORS[0]}
                        />
                        <KeyValue
                          label="Estimated returns"
                          value={`${selectedCurrency.symbol}${formatNumber(
                            estimatedReturns,
                            numberLocale
                          )}`}
                          color={PIE_COLORS[1]}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Paper
            sx={{
              p: { xs: 2.25, md: 2 },
              borderRadius: 0,
              border: "1px solid rgba(11, 31, 51, 0.08)",
              boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
            }}
          >
            <Stack spacing={{ xs: 2, md: 1.5 }}>
              <Typography variant="h6">Portfolio Growth</Typography>
              <Box sx={{ minHeight: { xs: 200, md: 200 } }}>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={growthSeries}
                    margin={{ top: 10, right: 12, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid stroke="rgba(11, 31, 51, 0.08)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#5b6b7f", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={formatAxisCurrencyValue}
                      tick={{ fill: "#5b6b7f", fontSize: 12 }}
                      width={56}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={(props) => renderChartTooltip(props as any)}
                      labelFormatter={(label) => `${label}`}
                      formatter={(value) =>
                        formatTooltipCurrencyValue(
                          value,
                          numberLocale,
                          selectedCurrency.symbol
                        )
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="investedAmount"
                      name="Invested Amount"
                      stroke="#0b1f33"
                      strokeWidth={2}
                      dot={false}
                      animationDuration={500}
                    />
                    <Line
                      type="monotone"
                      dataKey="estimatedReturns"
                      name="Estimated Returns"
                      stroke="#ff7a59"
                      strokeWidth={2.25}
                      dot={false}
                      animationDuration={500}
                    />
                    <Line
                      type="monotone"
                      dataKey="portfolioValue"
                      name="Portfolio Value"
                      stroke="#0f8b8d"
                      strokeWidth={3}
                      dot={false}
                      animationDuration={500}
                    />
                    <Line
                      type="monotone"
                      dataKey="inflationAdjustedValue"
                      name="Inflation-adjusted Value"
                      stroke="#6c8a2b"
                      strokeWidth={2.25}
                      dot={false}
                      animationDuration={500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              {!hasValidInput && (
                <Typography color="error.main">
                  Enter valid investment values. In SIP mode, yearly step-up
                  must stay between 0% and 100%.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Paper>
    </Stack>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: MetricCardProps) {
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

type KeyValueProps = {
  color: string;
  label: string;
  value: string;
};

function KeyValue({ color, label, value }: KeyValueProps) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={{ xs: 1.25, md: 1 }} alignItems="center">
        <Box sx={{ width: 10, height: 10, backgroundColor: color }} />
        <Typography
          variant="h6"
          sx={{ fontSize: { xs: "1.05rem", md: "0.98rem" }, wordBreak: "break-word" }}
        >
          {value}
        </Typography>
      </Stack>
    </Box>
  );
}

export default MutualFundCalculator;
