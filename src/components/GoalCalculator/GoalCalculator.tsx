'use client';

import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import TrendingFlatRoundedIcon from "@mui/icons-material/TrendingFlatRounded";
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
  Legend,
  Line,
  LineChart,
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

type GoalType = "home" | "car" | "travel" | "education" | "wedding" | "emergency" | "custom";

type ProjectionPoint = {
  label: string;
  projectedValue: number;
  goalCost: number;
};

const currencyOptions: CurrencyOption[] = [
  { code: "INR", locale: "en-IN", symbol: "Rs" },
  { code: "USD", locale: "en-US", symbol: "$" },
  { code: "EUR", locale: "de-DE", symbol: "EUR" },
  { code: "GBP", locale: "en-GB", symbol: "GBP" },
  { code: "AED", locale: "en-AE", symbol: "AED" },
];

const GOAL_TYPES: Array<{ value: GoalType; label: string; defaultName: string }> = [
  { value: "home", label: "Home", defaultName: "Dream Home" },
  { value: "car", label: "Car", defaultName: "New Car" },
  { value: "travel", label: "Travel", defaultName: "Europe Trip" },
  { value: "education", label: "Education", defaultName: "Higher Education" },
  { value: "wedding", label: "Wedding", defaultName: "Wedding Fund" },
  { value: "emergency", label: "Emergency", defaultName: "Emergency Fund" },
  { value: "custom", label: "Custom", defaultName: "My Goal" },
];

const DEFAULT_VALUES = {
  goalType: "travel" as GoalType,
  goalName: "Europe Trip",
  currentCost: "1200000",
  yearsToGoal: "5",
  currentSavings: "150000",
  monthlyContribution: "18000",
  expectedReturn: "11",
  yearlyStepUp: "8",
};

const STATUS_CONFIG = {
  behind: {
    label: "Behind",
    color: "#dc2626",
    background: "rgba(220, 38, 38, 0.08)",
  },
  close: {
    label: "Close",
    color: "#c7573a",
    background: "rgba(255, 122, 89, 0.12)",
  },
  onTrack: {
    label: "On Track",
    color: "#0f8b8d",
    background: "rgba(15, 139, 141, 0.12)",
  },
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

function formatTooltipCurrencyValue(
  value: number | string | ReadonlyArray<number | string> | undefined,
  locale: string,
  symbol: string
) {
  const normalizedValue = Array.isArray(value) ? Number(value[0]) : Number(value);

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

function clampRate(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function projectGoalPlan({
  years,
  currentSavings,
  monthlyContribution,
  annualReturn,
  currentCost,
  yearlyStepUp,
  extraMonthlyContribution = 0,
}: {
  years: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number;
  currentCost: number;
  yearlyStepUp: number;
  extraMonthlyContribution?: number;
}) {
  const months = Math.max(1, Math.round(years * 12));
  const monthlyRate = annualReturn / 12 / 100;
  const yearlySeries: ProjectionPoint[] = [];
  let projectedValue = currentSavings;
  let goalCost = currentCost;

  for (let month = 1; month <= months; month += 1) {
    const currentYearIndex = Math.floor((month - 1) / 12);
    const adjustedMonthlyContribution =
      (monthlyContribution + extraMonthlyContribution) *
      Math.pow(1 + yearlyStepUp / 100, currentYearIndex);

    projectedValue = (projectedValue + adjustedMonthlyContribution) * (1 + monthlyRate);

    if (month % 12 === 0 || month === months) {
      yearlySeries.push({
        label: `Year ${Math.ceil(month / 12)}`,
        projectedValue: Number(projectedValue.toFixed(2)),
        goalCost: Number(goalCost.toFixed(2)),
      });
    }
  }

  return {
    futureGoalCost: goalCost,
    projectedValue,
    yearlySeries,
  };
}

function calculateRequiredMonthlyContribution({
  years,
  currentSavings,
  currentCost,
  annualReturn,
  yearlyStepUp,
}: {
  years: number;
  currentSavings: number;
  currentCost: number;
  annualReturn: number;
  yearlyStepUp: number;
}) {
  let low = 0;
  let high = Math.max(currentCost, 1);

  for (let index = 0; index < 40; index += 1) {
    const mid = (low + high) / 2;
    const projection = projectGoalPlan({
      years,
      currentSavings,
      monthlyContribution: mid,
      annualReturn,
      currentCost,
      yearlyStepUp,
    });

    if (projection.projectedValue >= projection.futureGoalCost) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return high;
}

function calculateDelayMonths({
  currentProjectionValue,
  currentFutureCost,
  currentMonths,
  currentSavings,
  monthlyContribution,
  annualReturn,
  yearlyStepUp,
}: {
  currentProjectionValue: number;
  currentFutureCost: number;
  currentMonths: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number;
  yearlyStepUp: number;
}) {
  if (currentProjectionValue >= currentFutureCost) {
    return 0;
  }

  const monthlyRate = annualReturn / 12 / 100;
  const maxExtraMonths = 15 * 12;
  let projectedValue = currentProjectionValue;
  let goalCost = currentFutureCost;

  for (let extraMonth = 1; extraMonth <= maxExtraMonths; extraMonth += 1) {
    const totalMonthIndex = currentMonths + extraMonth - 1;
    const currentYearIndex = Math.floor(totalMonthIndex / 12);
    const adjustedMonthlyContribution =
      monthlyContribution * Math.pow(1 + yearlyStepUp / 100, currentYearIndex);

    projectedValue = (projectedValue + adjustedMonthlyContribution) * (1 + monthlyRate);

    if (projectedValue >= goalCost) {
      return extraMonth;
    }
  }

  return null;
}

function formatDelay(delayMonths: number | null) {
  if (delayMonths === null) {
    return "More than 15 extra years";
  }

  if (delayMonths === 0) {
    return "No delay needed";
  }

  const years = Math.floor(delayMonths / 12);
  const months = delayMonths % 12;
  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} year${years > 1 ? "s" : ""}`);
  }

  if (months > 0) {
    parts.push(`${months} month${months > 1 ? "s" : ""}`);
  }

  return parts.join(" ");
}

function GoalCalculator() {
  const [goalType, setGoalType] = useState<GoalType>(DEFAULT_VALUES.goalType);
  const [goalName, setGoalName] = useState(DEFAULT_VALUES.goalName);
  const [currentCost, setCurrentCost] = useState(DEFAULT_VALUES.currentCost);
  const [yearsToGoal, setYearsToGoal] = useState(DEFAULT_VALUES.yearsToGoal);
  const [currentSavings, setCurrentSavings] = useState(DEFAULT_VALUES.currentSavings);
  const [monthlyContribution, setMonthlyContribution] = useState(
    DEFAULT_VALUES.monthlyContribution
  );
  const [expectedReturn, setExpectedReturn] = useState(DEFAULT_VALUES.expectedReturn);
  const [yearlyStepUp, setYearlyStepUp] = useState(DEFAULT_VALUES.yearlyStepUp);
  const [currencyCode, setCurrencyCode] = useState(() => detectDefaultCurrency().code);

  const selectedCurrency =
    currencyOptions.find((option) => option.code === currencyCode) ?? currencyOptions[0];
  const numberLocale = selectedCurrency.locale;

  const currentGoalCost = Number(currentCost) || 0;
  const years = Number(yearsToGoal) || 0;
  const savedAmount = Number(currentSavings) || 0;
  const monthlyAmount = Number(monthlyContribution) || 0;
  const annualReturn = clampRate(Number(expectedReturn) || 0, 0, 30);
  const stepUpRate = clampRate(Number(yearlyStepUp) || 0, 0, 50);

  const {
    futureGoalCost,
    projectedValue,
    fundingGap,
    achievementPercentage,
    status,
    requiredMonthlyContribution,
    monthlyIncreaseNeeded,
    topUpRequiredToday,
    delayMonths,
    growthSeries,
    hasValidInput,
  } = useMemo(() => {
    if (currentGoalCost <= 0 || years <= 0 || annualReturn < 0) {
      return {
        futureGoalCost: 0,
        projectedValue: 0,
        fundingGap: 0,
        achievementPercentage: 0,
        status: STATUS_CONFIG.behind,
        requiredMonthlyContribution: 0,
        monthlyIncreaseNeeded: 0,
        topUpRequiredToday: 0,
        delayMonths: 0,
        growthSeries: [],
        hasValidInput: false,
      };
    }

    const projection = projectGoalPlan({
      years,
      currentSavings: savedAmount,
      monthlyContribution: monthlyAmount,
      annualReturn,
      currentCost: currentGoalCost,
      yearlyStepUp: stepUpRate,
    });

    const gap = projection.futureGoalCost - projection.projectedValue;
    const achievement = projection.futureGoalCost
      ? (projection.projectedValue / projection.futureGoalCost) * 100
      : 0;

    const nextStatus =
      achievement >= 100
        ? STATUS_CONFIG.onTrack
        : achievement >= 85
          ? STATUS_CONFIG.close
          : STATUS_CONFIG.behind;

    const requiredMonthly = calculateRequiredMonthlyContribution({
      years,
      currentSavings: savedAmount,
      currentCost: currentGoalCost,
      annualReturn,
      yearlyStepUp: stepUpRate,
    });

    const growthFactor = Math.pow(1 + annualReturn / 12 / 100, Math.round(years * 12));
    const topUpToday = gap > 0 && growthFactor > 0 ? gap / growthFactor : 0;
    const delay = calculateDelayMonths({
      currentProjectionValue: projection.projectedValue,
      currentFutureCost: projection.futureGoalCost,
      currentMonths: Math.max(1, Math.round(years * 12)),
      currentSavings: savedAmount,
      monthlyContribution: monthlyAmount,
      annualReturn,
      yearlyStepUp: stepUpRate,
    });

    return {
      futureGoalCost: projection.futureGoalCost,
      projectedValue: projection.projectedValue,
      fundingGap: gap,
      achievementPercentage: Math.min(achievement, 180),
      status: nextStatus,
      requiredMonthlyContribution: requiredMonthly,
      monthlyIncreaseNeeded: Math.max(requiredMonthly - monthlyAmount, 0),
      topUpRequiredToday: Math.max(topUpToday, 0),
      delayMonths: delay,
      growthSeries: projection.yearlySeries,
      hasValidInput: true,
    };
  }, [
    annualReturn,
    currentGoalCost,
    monthlyAmount,
    savedAmount,
    stepUpRate,
    years,
  ]);

  const animatedFutureCost = useAnimatedNumber(futureGoalCost);
  const animatedProjectedValue = useAnimatedNumber(projectedValue);
  const animatedGap = useAnimatedNumber(Math.abs(fundingGap));
  const animatedRequiredMonthly = useAnimatedNumber(requiredMonthlyContribution);

  const goalDisplayName = goalName.trim() || "My Goal";

  const handleGoalTypeChange = (nextGoalType: GoalType) => {
    setGoalType(nextGoalType);

    if (goalName.trim() === "" || goalName === DEFAULT_VALUES.goalName) {
      const selectedType = GOAL_TYPES.find((item) => item.value === nextGoalType);
      if (selectedType) {
        setGoalName(selectedType.defaultName);
      }
    }
  };

  const handleReset = () => {
    setGoalType(DEFAULT_VALUES.goalType);
    setGoalName(DEFAULT_VALUES.goalName);
    setCurrentCost(DEFAULT_VALUES.currentCost);
    setYearsToGoal(DEFAULT_VALUES.yearsToGoal);
    setCurrentSavings(DEFAULT_VALUES.currentSavings);
    setMonthlyContribution(DEFAULT_VALUES.monthlyContribution);
    setExpectedReturn(DEFAULT_VALUES.expectedReturn);
    setYearlyStepUp(DEFAULT_VALUES.yearlyStepUp);
    setCurrencyCode(detectDefaultCurrency().code);
  };

  const recommendationCards = [
    {
      title: "Increase Monthly",
      value: `${selectedCurrency.symbol} ${formatNumber(
        requiredMonthlyContribution,
        numberLocale
      )}/mo`,
      accent: "#0f8b8d",
      background:
        "linear-gradient(180deg, rgba(15, 139, 141, 0.12) 0%, rgba(255,255,255,0.96) 100%)",
      eyebrow: fundingGap > 0 ? "Stay on schedule" : "Current pace works",
      detail:
        fundingGap > 0
          ? `Add ${selectedCurrency.symbol} ${formatNumber(
              monthlyIncreaseNeeded,
              numberLocale
            )} more each month to stay on schedule.`
          : "Your current monthly plan is already enough for this goal.",
    },
    {
      title: "Add One-time Boost",
      value: `${selectedCurrency.symbol} ${formatNumber(topUpRequiredToday, numberLocale)}`,
      accent: "#c7573a",
      background:
        "linear-gradient(180deg, rgba(255, 122, 89, 0.14) 0%, rgba(255,255,255,0.96) 100%)",
      eyebrow: fundingGap > 0 ? "Fastest catch-up" : "Optional cushion",
      detail:
        fundingGap > 0
          ? "A lump sum today can reduce or eliminate the shortfall without changing your SIP."
          : "No extra top-up is needed at the current pace.",
    },
    {
      title: "Keep Current Pace",
      value: formatDelay(delayMonths),
      accent: "#0b1f33",
      background:
        "linear-gradient(180deg, rgba(11, 31, 51, 0.08) 0%, rgba(255,255,255,0.96) 100%)",
      eyebrow: "Lower monthly pressure",
      detail:
        delayMonths === null
          ? "At the current pace, this goal remains out of reach within the extra delay window."
          : delayMonths === 0
            ? "You can stay with the current plan and still hit the goal on time."
            : "If you do not want to increase savings, this is the delay to expect.",
    },
  ];

  return (
    <Stack spacing={2.5}>
      <Paper
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 0,
          border: "1px solid rgba(11, 31, 51, 0.08)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,248,248,0.96) 100%)",
          boxShadow: "0 20px 50px rgba(11, 31, 51, 0.07)",
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ maxWidth: 860 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "2rem" } }}>
                Goal Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Turn a real-life goal into a practical savings plan. See whether
              your current plan can fund it,
              and which adjustment path gets you there most cleanly.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper
                sx={{
                  p: 2.25,
                  borderRadius: 0,
                  border: "1px solid rgba(11, 31, 51, 0.08)",
                  boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
                }}
              >
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {GOAL_TYPES.map((type) => (
                        <Button
                          key={type.value}
                          variant={goalType === type.value ? "contained" : "outlined"}
                          color={goalType === type.value ? "primary" : "inherit"}
                          size="small"
                          onClick={() => handleGoalTypeChange(type.value)}
                          sx={{ borderRadius: 0 }}
                        >
                          {type.label}
                        </Button>
                      ))}
                    </Stack>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<AutorenewRoundedIcon />}
                      onClick={handleReset}
                      sx={{ borderRadius: 0, alignSelf: { xs: "stretch", sm: "flex-start" } }}
                    >
                      Reset
                    </Button>
                  </Stack>

                  <TextField
                    fullWidth
                    size="small"
                    label="Goal Name"
                    value={goalName}
                    onChange={(event) => setGoalName(event.target.value)}
                    helperText="Use a real target like Bali trip, MBA fund, or first car."
                  />

                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      spacing={0.5}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Current Cost of Goal
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedCurrency.symbol}{" "}
                        {formatNumber(currentGoalCost, numberLocale, {
                          maximumFractionDigits: 0,
                        })}
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={
                        currentCost === ""
                          ? ""
                          : formatNumber(Number(currentCost), numberLocale, {
                              maximumFractionDigits: 0,
                            })
                      }
                      onChange={(event) =>
                        setCurrentCost(sanitizeNumericInput(event.target.value))
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
                      value={currentGoalCost || 0}
                      min={0}
                      max={10000000}
                      step={50000}
                      onChange={(_, value) => setCurrentCost(String(value))}
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
                        Years to Goal
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {years || 0} years
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={yearsToGoal}
                      onChange={(event) =>
                        setYearsToGoal(sanitizeNumericInput(event.target.value, true))
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
                      max={25}
                      step={1}
                      onChange={(_, value) => setYearsToGoal(String(value))}
                    />
                  </Box>

                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          spacing={0.5}
                          sx={{ mb: 1 }}
                        >
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Current Savings
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedCurrency.symbol}{" "}
                            {formatNumber(savedAmount, numberLocale, {
                              maximumFractionDigits: 0,
                            })}
                          </Typography>
                        </Stack>
                        <TextField
                          fullWidth
                          size="small"
                          value={
                            currentSavings === ""
                              ? ""
                              : formatNumber(Number(currentSavings), numberLocale, {
                                  maximumFractionDigits: 0,
                                })
                          }
                          onChange={(event) =>
                            setCurrentSavings(sanitizeNumericInput(event.target.value))
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {selectedCurrency.symbol}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          spacing={0.5}
                          sx={{ mb: 1 }}
                        >
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Monthly Contribution
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedCurrency.symbol}{" "}
                            {formatNumber(monthlyAmount, numberLocale, {
                              maximumFractionDigits: 0,
                            })}
                          </Typography>
                        </Stack>
                        <TextField
                          fullWidth
                          size="small"
                          value={
                            monthlyContribution === ""
                              ? ""
                              : formatNumber(Number(monthlyContribution), numberLocale, {
                                  maximumFractionDigits: 0,
                                })
                          }
                          onChange={(event) =>
                            setMonthlyContribution(
                              sanitizeNumericInput(event.target.value)
                            )
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {selectedCurrency.symbol}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      spacing={0.5}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Expected Return
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {annualReturn}%
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={expectedReturn}
                      onChange={(event) =>
                        setExpectedReturn(
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
                      value={annualReturn}
                      min={0}
                      max={20}
                      step={0.1}
                      onChange={(_, value) => setExpectedReturn(String(value))}
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
                        Yearly Step-up
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stepUpRate}%
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={yearlyStepUp}
                      onChange={(event) =>
                        setYearlyStepUp(
                          sanitizeNumericInput(event.target.value, true)
                        )
                      }
                      helperText="Increase the monthly contribution every year."
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                    <Slider
                      size="small"
                      sx={{ mt: 1 }}
                      value={stepUpRate}
                      min={0}
                      max={20}
                      step={1}
                      onChange={(_, value) => setYearlyStepUp(String(value))}
                    />
                  </Box>

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
                  <Box
                    sx={{
                      border: "1px solid rgba(11, 31, 51, 0.08)",
                      backgroundColor: "rgba(245, 248, 248, 0.85)",
                    }}
                  >
                    <SummaryRow label="Goal" value={goalDisplayName} />
                    <Divider />
                    <SummaryRow
                      label="Goal Cost"
                      value={`${selectedCurrency.symbol} ${formatNumber(
                        animatedFutureCost,
                        numberLocale
                      )}`}
                    />
                    <Divider />
                    <SummaryRow
                      label="Projected Value"
                      value={`${selectedCurrency.symbol} ${formatNumber(
                        animatedProjectedValue,
                        numberLocale
                      )}`}
                    />
                    <Divider />
                    <SummaryRow
                      label={fundingGap > 0 ? "Funding Gap" : "Projected Surplus"}
                      value={`${selectedCurrency.symbol} ${formatNumber(
                        animatedGap,
                        numberLocale
                      )}`}
                    />
                  </Box>

                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 0,
                      border: "1px solid rgba(11, 31, 51, 0.08)",
                      background: status.background,
                    }}
                  >
                    <Stack spacing={1.25}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.75}
                      >
                        <Typography variant="h6">Are You On Track?</Typography>
                        <Typography sx={{ color: status.color, fontWeight: 800 }}>
                          {status.label}
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          height: 10,
                          backgroundColor: "rgba(11, 31, 51, 0.08)",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            width: `${Math.min(achievementPercentage, 100)}%`,
                            height: "100%",
                            backgroundColor: status.color,
                          }}
                        />
                      </Box>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {fundingGap > 0
                          ? `Your current plan is projected to fund ${formatNumber(
                              achievementPercentage,
                              numberLocale,
                              { maximumFractionDigits: 0 }
                            )}% of this goal.`
                          : `Your current plan is projected to reach this goal with a cushion of ${selectedCurrency.symbol} ${formatNumber(
                              Math.abs(fundingGap),
                              numberLocale
                            )}.`}
                      </Typography>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <TrendingFlatRoundedIcon sx={{ color: status.color, fontSize: 18 }} />
                        <Typography sx={{ color: status.color, fontWeight: 700 }}>
                          Required monthly pace: {selectedCurrency.symbol}{" "}
                          {formatNumber(animatedRequiredMonthly, numberLocale)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>

                  <Grid container spacing={1.5}>
                    {recommendationCards.map((card) => (
                      <Grid key={card.title} size={{ xs: 12, sm: 4 }}>
                        <Paper
                          sx={{
                            p: 0,
                            height: "100%",
                            borderRadius: 0,
                            border: "1px solid rgba(11, 31, 51, 0.08)",
                            background: card.background,
                            boxShadow: "0 14px 28px rgba(11, 31, 51, 0.05)",
                            overflow: "hidden",
                          }}
                        >
                          <Stack spacing={0}>
                            <Box
                              sx={{
                                px: 1.5,
                                py: 0.9,
                                borderBottom: "1px solid rgba(11, 31, 51, 0.08)",
                                backgroundColor: "rgba(255,255,255,0.42)",
                              }}
                            >
                              <Stack spacing={0.35}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: card.accent,
                                    fontWeight: 800,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    fontSize: "0.66rem",
                                  }}
                                >
                                  {card.eyebrow}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 700, fontSize: "0.92rem" }}
                                >
                                  {card.title}
                                </Typography>
                              </Stack>
                            </Box>

                            <Stack spacing={1} sx={{ p: 1.5, height: "100%" }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontSize: "1rem",
                                  lineHeight: 1.25,
                                  color: card.accent,
                                  fontWeight: 800,
                                }}
                              >
                                {card.value}
                              </Typography>
                              <Box
                                sx={{
                                  width: 34,
                                  height: 2,
                                  backgroundColor: card.accent,
                                }}
                              />
                              <Typography
                                color="text.secondary"
                                sx={{ lineHeight: 1.55, fontSize: "0.84rem" }}
                              >
                                {card.detail}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Paper
            sx={{
              p: 2.25,
              borderRadius: 0,
              border: "1px solid rgba(11, 31, 51, 0.08)",
              boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6">Journey View</Typography>
              <Box sx={{ minHeight: { xs: 220, md: 260 } }}>
                <ResponsiveContainer width="100%" height={260}>
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
                      dataKey="projectedValue"
                      name="Projected Portfolio"
                      stroke="#0f8b8d"
                      strokeWidth={3}
                      dot={false}
                      animationDuration={500}
                    />
                    <Line
                      type="monotone"
                      dataKey="goalCost"
                      name="Goal Cost"
                      stroke="#ff7a59"
                      strokeWidth={2.25}
                      dot={false}
                      animationDuration={500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              {!hasValidInput && (
                <Typography color="error.main">
                  Enter valid cost, timeline, and rate values to build a plan.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Paper>
    </Stack>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      spacing={0.75}
      sx={{ px: 2, py: 1.5 }}
    >
      <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          lineHeight: 1.2,
          fontSize: "1.05rem",
          wordBreak: "break-word",
          textAlign: { xs: "left", sm: "right" },
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

export default GoalCalculator;
