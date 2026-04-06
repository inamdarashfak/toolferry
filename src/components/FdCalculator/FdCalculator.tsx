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
import { useEffect, useMemo, useState } from "react";
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

const compoundingOptions = [
  { label: "Monthly", value: 12 },
  { label: "Quarterly", value: 4 },
  { label: "Yearly", value: 1 },
];

const DEFAULT_VALUES = {
  depositAmount: "500000",
  interestRate: "7.25",
  tenureYears: "5",
  compounding: "4",
  inflationRate: "6",
};

const PIE_COLORS = ["#0b1f33", "#0f8b8d"];

function clampInflationRate(value: number) {
  return Math.min(8, Math.max(2, value));
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

  useEffect(() => {
    let animationFrame = 0;
    const startValue = displayValue;
    const startTime = performance.now();
    const duration = 320;

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (target - startValue) * easedProgress;

      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [target]);

  return displayValue;
}

function FdCalculator() {
  const [depositAmount, setDepositAmount] = useState(
    DEFAULT_VALUES.depositAmount
  );
  const [interestRate, setInterestRate] = useState(DEFAULT_VALUES.interestRate);
  const [tenureYears, setTenureYears] = useState(DEFAULT_VALUES.tenureYears);
  const [compounding, setCompounding] = useState(DEFAULT_VALUES.compounding);
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

  const principal = Number(depositAmount) || 0;
  const annualRate = Number(interestRate) || 0;
  const years = Number(tenureYears) || 0;
  const compoundsPerYear = Number(compounding) || 4;
  const selectedInflationRate = clampInflationRate(Number(inflationRate) || 0);

  const {
    maturityValue,
    estimatedReturns,
    inflationAdjustedValue,
    growthSeries,
    hasValidInput,
  } =
    useMemo(() => {
      if (principal <= 0 || annualRate < 0 || years <= 0) {
        return {
          maturityValue: principal,
          estimatedReturns: 0,
          inflationAdjustedValue: principal,
          growthSeries: [],
          hasValidInput: false,
        };
      }

      const ratePerPeriod = annualRate / 100 / compoundsPerYear;
      const totalPeriods = compoundsPerYear * years;
      const maturity = principal * Math.pow(1 + ratePerPeriod, totalPeriods);
      const interest = maturity - principal;

      const yearlyPoints = [];

      for (let year = 1; year <= Math.ceil(years); year += 1) {
        const effectiveYears = Math.min(year, years);
        const value =
          principal *
          Math.pow(1 + ratePerPeriod, compoundsPerYear * effectiveYears);

        yearlyPoints.push({
          label: `Year ${year}`,
          maturityValue: Number(value.toFixed(2)),
          inflationAdjustedValue: Number(
            (
              value /
              Math.pow(
                1 + selectedInflationRate / 100,
                effectiveYears
              )
            ).toFixed(2)
          ),
          investedAmount: principal,
          interestEarned: Number((value - principal).toFixed(2)),
        });
      }

      return {
        maturityValue: maturity,
        estimatedReturns: interest,
        inflationAdjustedValue:
          maturity / Math.pow(1 + selectedInflationRate / 100, years),
        growthSeries: yearlyPoints,
        hasValidInput: true,
      };
    }, [annualRate, compoundsPerYear, principal, selectedInflationRate, years]);

  const animatedPrincipal = useAnimatedNumber(principal);
  const animatedReturns = useAnimatedNumber(estimatedReturns);
  const animatedMaturity = useAnimatedNumber(maturityValue);
  const animatedInflationAdjusted = useAnimatedNumber(inflationAdjustedValue);

  const chartData = [
    { name: "Deposit", value: principal },
    { name: "Interest", value: estimatedReturns },
  ];

  const summaryItems = [
    {
      label: "Invested Amount",
      value: `${selectedCurrency.symbol} ${formatNumber(
        animatedPrincipal,
        numberLocale
      )}`,
    },
    {
      label: "Est. Returns",
      value: `${selectedCurrency.symbol} ${formatNumber(
        animatedReturns,
        numberLocale
      )}`,
    },
    {
      label: "Maturity Value",
      value: `${selectedCurrency.symbol} ${formatNumber(
        animatedMaturity,
        numberLocale
      )}`,
    },
    {
      label: "Compounding",
      value:
        compoundingOptions.find((option) => option.value === compoundsPerYear)
          ?.label ?? "Quarterly",
    },
  ];

  const handleReset = () => {
    setDepositAmount(DEFAULT_VALUES.depositAmount);
    setInterestRate(DEFAULT_VALUES.interestRate);
    setTenureYears(DEFAULT_VALUES.tenureYears);
    setCompounding(DEFAULT_VALUES.compounding);
    setInflationRate(DEFAULT_VALUES.inflationRate);
    setCurrencyCode(detectDefaultCurrency().code);
  };

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper
        sx={{
          p: { xs: 2.5, md: 2.5 },
          borderRadius: 0,
          border: "1px solid rgba(11, 31, 51, 0.08)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,248,248,0.96) 100%)",
          boxShadow: "0 20px 50px rgba(11, 31, 51, 0.07)",
        }}
      >
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                FD Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}>
              Estimate fixed deposit maturity, earned interest, and value growth
              over time with a simple compounding setup.
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
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<AutorenewRoundedIcon />}
                      onClick={handleReset}
                      sx={{
                        borderRadius: 0,
                        minHeight: 40,
                        alignSelf: { xs: "stretch", sm: "flex-start" },
                      }}
                    >
                      Reset
                    </Button>
                  </Stack>
                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      spacing={0.5}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Deposit Amount
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedCurrency.symbol}{" "}
                        {formatNumber(principal, numberLocale, {
                          maximumFractionDigits: 0,
                        })}
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={
                        depositAmount === ""
                          ? ""
                          : formatNumber(Number(depositAmount), numberLocale, {
                              maximumFractionDigits: 0,
                            })
                      }
                        onChange={(event) =>
                          preserveFormattedNumberCaret({
                            event,
                            nextValue: sanitizeNumericInput(event.target.value),
                            setValue: setDepositAmount,
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
                      value={principal || 0}
                      min={0}
                      max={10000000}
                      step={25000}
                      onChange={(_, value) => setDepositAmount(String(value))}
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
                        Interest Rate
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {interestRate || 0}%
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={interestRate}
                      onChange={(event) =>
                        setInterestRate(
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
                      max={12}
                      step={0.1}
                      onChange={(_, value) => setInterestRate(String(value))}
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
                        Tenure
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {years || 0} years
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={tenureYears}
                      onChange={(event) =>
                        setTenureYears(
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
                      max={15}
                      step={0.5}
                      onChange={(_, value) => setTenureYears(String(value))}
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
                    <Grid size={{ xs: 12, sm: 5 }}>
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
                    <Grid size={{ xs: 12, sm: 7 }}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Compounding"
                        value={compounding}
                        onChange={(event) => setCompounding(event.target.value)}
                      >
                        {compoundingOptions.map((option) => (
                          <MenuItem key={option.label} value={option.value}>
                            {option.label}
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
                sx={{
                  p: 2.25,
                  height: "100%",
                  borderRadius: 0,
                  border: "1px solid rgba(11, 31, 51, 0.08)",
                  boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
                }}
              >
                <Stack spacing={1.75}>
                  <Stack
                    divider={<Divider />}
                    sx={{
                      border: "1px solid rgba(11, 31, 51, 0.08)",
                      backgroundColor: "rgba(245, 248, 248, 0.85)",
                    }}
                  >
                    {summaryItems.map((item) => (
                      <SummaryRow
                        key={item.label}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Stack>

                  <Box
                    sx={{
                      border: "1px solid rgba(11, 31, 51, 0.08)",
                      backgroundColor: "rgba(255, 255, 255, 0.85)",
                    }}
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
                          label="Deposit amount"
                          value={`${selectedCurrency.symbol}${formatNumber(
                            principal,
                            numberLocale
                          )}`}
                          color={PIE_COLORS[0]}
                        />
                        <KeyValue
                          label="Interest earned"
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
              <Typography variant="h6">Maturity Growth</Typography>
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
                      dataKey="interestEarned"
                      name="Interest Earned"
                      stroke="#ff7a59"
                      strokeWidth={2.25}
                      dot={false}
                      animationDuration={500}
                    />
                    <Line
                      type="monotone"
                      dataKey="maturityValue"
                      name="Maturity Value"
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
                  Enter positive deposit, rate, and tenure values to see
                  results.
                </Typography>
              )}
            </Stack>
          </Paper>
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

export default FdCalculator;
