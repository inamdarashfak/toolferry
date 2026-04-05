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
  loanAmount: "2500000",
  interestRate: "8.5",
  tenureYears: "20",
};

const PIE_COLORS = ["#0b1f33", "#0f8b8d"];

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

function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(DEFAULT_VALUES.loanAmount);
  const [interestRate, setInterestRate] = useState(DEFAULT_VALUES.interestRate);
  const [tenureYears, setTenureYears] = useState(DEFAULT_VALUES.tenureYears);
  const [currencyCode, setCurrencyCode] = useState(
    () => detectDefaultCurrency().code
  );

  const selectedCurrency =
    currencyOptions.find((option) => option.code === currencyCode) ??
    currencyOptions[0];
  const numberLocale = selectedCurrency.locale;

  const principal = Number(loanAmount) || 0;
  const annualRate = Number(interestRate) || 0;
  const years = Number(tenureYears) || 0;

  const {
    monthlyEmi,
    totalInterest,
    totalPayment,
    paymentSeries,
  } = useMemo(() => {
    if (principal <= 0 || years <= 0 || annualRate < 0) {
      return {
        monthlyEmi: 0,
        totalInterest: 0,
        totalPayment: principal,
        paymentSeries: [],
        hasValidInput: false,
      };
    }

    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;

    let emi = 0;

    if (monthlyRate === 0) {
      emi = principal / months;
    } else {
      const growthFactor = Math.pow(1 + monthlyRate, months);
      emi = (principal * monthlyRate * growthFactor) / (growthFactor - 1);
    }

    const totalAmount = emi * months;
    const totalInterestAmount = totalAmount - principal;

    let remainingBalance = principal;
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    const yearlySeries: Array<{
      label: string;
      principalPaid: number;
      interestPaid: number;
      remainingBalance: number;
    }> = [];

    for (let month = 1; month <= months; month += 1) {
      const interestForMonth =
        monthlyRate === 0 ? 0 : remainingBalance * monthlyRate;
      const principalForMonth = emi - interestForMonth;

      remainingBalance = Math.max(remainingBalance - principalForMonth, 0);
      yearlyPrincipal += principalForMonth;
      yearlyInterest += interestForMonth;

      if (month % 12 === 0 || month === months) {
        yearlySeries.push({
          label: `Year ${Math.ceil(month / 12)}`,
          principalPaid: Number(yearlyPrincipal.toFixed(2)),
          interestPaid: Number(yearlyInterest.toFixed(2)),
          remainingBalance: Number(remainingBalance.toFixed(2)),
        });
        yearlyPrincipal = 0;
        yearlyInterest = 0;
      }
    }

    return {
      monthlyEmi: emi,
      totalInterest: totalInterestAmount,
      totalPayment: totalAmount,
      paymentSeries: yearlySeries,
      hasValidInput: true,
    };
  }, [annualRate, principal, years]);

  const animatedEmi = useAnimatedNumber(monthlyEmi);
  const animatedInterest = useAnimatedNumber(totalInterest);
  const animatedPayment = useAnimatedNumber(totalPayment);
  const animatedPrincipal = useAnimatedNumber(principal);

  const chartData = useMemo(
    () => [
      { name: "Principal", value: principal },
      { name: "Interest", value: totalInterest },
    ],
    [principal, totalInterest]
  );

  const handleReset = () => {
    setLoanAmount(DEFAULT_VALUES.loanAmount);
    setInterestRate(DEFAULT_VALUES.interestRate);
    setTenureYears(DEFAULT_VALUES.tenureYears);
    setCurrencyCode(detectDefaultCurrency().code);
  };

  const summaryItems = [
    {
      label: "Monthly EMI",
      value: `${selectedCurrency.symbol} ${formatNumber(
        animatedEmi,
        numberLocale
      )}`,
    },
    {
      label: "Principal",
      value: `${selectedCurrency.symbol} ${formatNumber(
        animatedPrincipal,
        numberLocale
      )}`,
    },
    {
      label: "Total Interest",
      value: `${selectedCurrency.symbol} ${formatNumber(
        animatedInterest,
        numberLocale
      )}`,
    },
    {
      label: "Total Payment",
      value: `${selectedCurrency.symbol} ${formatNumber(
        animatedPayment,
        numberLocale
      )}`,
    },
  ];

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
                EMI Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}>
              Estimate your monthly installment, interest outflow, and total
              repayment with a simple loan setup.
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
                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "baseline" }}
                      spacing={0.5}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Loan Amount
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
                        loanAmount === ""
                          ? ""
                          : formatNumber(Number(loanAmount), numberLocale, {
                              maximumFractionDigits: 0,
                            })
                      }
                      onChange={(event) =>
                        setLoanAmount(sanitizeNumericInput(event.target.value))
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
                      max={20000000}
                      step={50000}
                      onChange={(_, value) => setLoanAmount(String(value))}
                    />
                  </Box>

                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "baseline" }}
                      spacing={0.5}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Rate of Interest
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
                      max={25}
                      step={0.1}
                      onChange={(_, value) => setInterestRate(String(value))}
                    />
                  </Box>

                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "baseline" }}
                      spacing={0.5}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Loan Tenure
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
                        setTenureYears(sanitizeNumericInput(event.target.value))
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
                      max={35}
                      step={1}
                      onChange={(_, value) => setTenureYears(String(value))}
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
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        startIcon={<AutorenewRoundedIcon />}
                        onClick={handleReset}
                        fullWidth
                        sx={{ borderRadius: 0 }}
                      >
                        Reset
                      </Button>
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
                      <Stack spacing={{ xs: 2.5, md: 2 }}>
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Principal amount
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={{ xs: 1.25, md: 1 }}
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                backgroundColor: PIE_COLORS[0],
                                borderRadius: "2px",
                              }}
                            />
                            <Typography
                              variant="h6"
                              sx={{ fontSize: { xs: "1.05rem", md: "0.98rem" }, wordBreak: "break-word" }}
                            >
                              {selectedCurrency.symbol}{" "}
                              {formatNumber(principal, numberLocale)}
                            </Typography>
                          </Stack>
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Interest amount
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={{ xs: 1.25, md: 1 }}
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                backgroundColor: PIE_COLORS[1],
                                borderRadius: "2px",
                              }}
                            />
                            <Typography
                              variant="h6"
                              sx={{ fontSize: { xs: "1.05rem", md: "0.98rem" }, wordBreak: "break-word" }}
                            >
                              {selectedCurrency.symbol}{" "}
                              {formatNumber(totalInterest, numberLocale)}
                            </Typography>
                          </Stack>
                        </Box>
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
              <Typography variant="h6">Your Amortization Details</Typography>
              <Box sx={{ minHeight: { xs: 200, md: 200 } }}>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={paymentSeries}
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
                      dataKey="principalPaid"
                      name="Principal Paid"
                      stroke="#0b1f33"
                      strokeWidth={2.25}
                      dot={false}
                      animationDuration={500}
                    />
                    <Line
                      type="monotone"
                      dataKey="interestPaid"
                      name="Interest Paid"
                      stroke="#ff7a59"
                      strokeWidth={2.25}
                      dot={false}
                      animationDuration={500}
                    />
                    <Line
                      type="monotone"
                      dataKey="remainingBalance"
                      name="Remaining Balance"
                      stroke="#0f8b8d"
                      strokeWidth={3}
                      dot={false}
                      animationDuration={500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
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

export default EmiCalculator;
