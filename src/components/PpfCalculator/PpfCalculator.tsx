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
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ScrollToInstructionsButton from "../ScrollToInstructionsButton/ScrollToInstructionsButton";
import { getChartTooltipStyles } from "../../lib/chartTooltip";
import {
  currencyOptions,
  detectDefaultCurrency,
  formatAxisCurrencyValue,
  formatNumber,
  formatTooltipCurrencyValue,
  getCalculatorPanelSx,
  getCalculatorPaperSx,
  sanitizeNumericInput,
  useAnimatedNumber,
} from "../../lib/calculator";
import { preserveFormattedNumberCaret } from "../../lib/formattedNumericInput";

const DEFAULT_VALUES = {
  yearlyContribution: "150000",
  interestRate: "7.1",
  durationYears: "15",
};

function PpfCalculator() {
  const theme = useTheme();
  const [yearlyContribution, setYearlyContribution] = useState(
    DEFAULT_VALUES.yearlyContribution
  );
  const [interestRate, setInterestRate] = useState(DEFAULT_VALUES.interestRate);
  const [durationYears, setDurationYears] = useState(DEFAULT_VALUES.durationYears);
  const [currencyCode, setCurrencyCode] = useState(currencyOptions[0].code);

  useEffect(() => {
    setCurrencyCode(detectDefaultCurrency().code);
  }, []);

  const selectedCurrency =
    currencyOptions.find((option) => option.code === currencyCode) ??
    currencyOptions[0];
  const numberLocale = selectedCurrency.locale;

  const yearlyAmount = Number(yearlyContribution) || 0;
  const annualRate = Number(interestRate) || 0;
  const years = Math.min(15, Math.max(1, Number(durationYears) || 0));

  const result = useMemo(() => {
    if (yearlyAmount <= 0 || annualRate < 0 || years <= 0) {
      return {
        hasValidInput: false,
        totalInvested: 0,
        interestEarned: 0,
        maturityValue: 0,
        yearlyBreakdown: [],
      };
    }

    let balance = 0;
    let invested = 0;
    const yearlyBreakdown = [];

    for (let year = 1; year <= years; year += 1) {
      invested += yearlyAmount;
      balance = (balance + yearlyAmount) * (1 + annualRate / 100);

      yearlyBreakdown.push({
        label: `Year ${year}`,
        investedAmount: Number(invested.toFixed(2)),
        maturityValue: Number(balance.toFixed(2)),
      });
    }

    return {
      hasValidInput: true,
      totalInvested: invested,
      interestEarned: balance - invested,
      maturityValue: balance,
      yearlyBreakdown,
    };
  }, [annualRate, yearlyAmount, years]);

  const animatedInvested = useAnimatedNumber(result.totalInvested);
  const animatedInterest = useAnimatedNumber(result.interestEarned);
  const animatedMaturity = useAnimatedNumber(result.maturityValue);

  const handleReset = () => {
    setYearlyContribution(DEFAULT_VALUES.yearlyContribution);
    setInterestRate(DEFAULT_VALUES.interestRate);
    setDurationYears(DEFAULT_VALUES.durationYears);
    setCurrencyCode(detectDefaultCurrency().code);
  };

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                PPF Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}>
              Estimate Public Provident Fund maturity value with a simplified annual
              contribution model, interest earned, and yearly growth trend.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      spacing={0.5}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Yearly Contribution
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedCurrency.symbol}{" "}
                        {formatNumber(yearlyAmount, numberLocale, {
                          maximumFractionDigits: 0,
                        })}
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={
                        yearlyContribution === ""
                          ? ""
                          : formatNumber(Number(yearlyContribution), numberLocale, {
                              maximumFractionDigits: 0,
                            })
                      }
                      onChange={(event) => {
                        const nextValue = sanitizeNumericInput(event.target.value);
                        preserveFormattedNumberCaret({
                          event,
                          nextValue,
                          setValue: setYearlyContribution,
                          locale: numberLocale,
                        });
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              {selectedCurrency.symbol}
                            </InputAdornment>
                          ),
                        },
                      }}
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
                        {formatNumber(annualRate, "en-US", { maximumFractionDigits: 2 })}%
                      </Typography>
                    </Stack>
                    <Slider
                      value={annualRate}
                      onChange={(_, value) => setInterestRate(String(value))}
                      min={1}
                      max={10}
                      step={0.1}
                      valueLabelDisplay="auto"
                      sx={{ color: "secondary.main" }}
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
                        Duration
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {years} years
                      </Typography>
                    </Stack>
                    <Slider
                      value={years}
                      onChange={(_, value) => setDurationYears(String(value))}
                      min={1}
                      max={15}
                      step={1}
                      marks={[
                        { value: 1, label: "1" },
                        { value: 15, label: "15" },
                      ]}
                      valueLabelDisplay="auto"
                      sx={{ color: "secondary.main" }}
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
              <Stack spacing={{ xs: 2, md: 1.75 }}>
                <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                  <Stack spacing={1.5} divider={<Divider flexItem />}>
                    <Box>
                      <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 700 }}>
                        PPF Summary
                      </Typography>
                    </Box>

                    {result.hasValidInput ? (
                      <>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          spacing={0.5}
                        >
                          <Typography color="text.secondary">Total Invested</Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {selectedCurrency.symbol} {formatNumber(animatedInvested, numberLocale)}
                          </Typography>
                        </Stack>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          spacing={0.5}
                        >
                          <Typography color="text.secondary">Interest Earned</Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {selectedCurrency.symbol} {formatNumber(animatedInterest, numberLocale)}
                          </Typography>
                        </Stack>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          spacing={0.5}
                        >
                          <Typography color="text.secondary">Maturity Value</Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {selectedCurrency.symbol} {formatNumber(animatedMaturity, numberLocale)}
                          </Typography>
                        </Stack>
                      </>
                    ) : (
                      <Typography color="text.secondary">
                        Enter a valid contribution amount, interest rate, and duration to
                        project PPF growth.
                      </Typography>
                    )}
                  </Stack>
                </Paper>

                <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 700 }}>
                        Yearly Growth
                      </Typography>
                    </Box>
                    <Box sx={{ height: { xs: 260, md: 300 }, minWidth: 0 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={result.yearlyBreakdown}>
                          <CartesianGrid
                            stroke={theme.palette.divider}
                            vertical={false}
                            strokeDasharray="3 3"
                          />
                          <XAxis
                            dataKey="label"
                            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                            axisLine={{ stroke: theme.palette.divider }}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            width={70}
                            tickFormatter={formatAxisCurrencyValue}
                          />
                          <Tooltip
                            {...getChartTooltipStyles(theme)}
                            formatter={(value) =>
                              formatTooltipCurrencyValue(
                                value,
                                numberLocale,
                                selectedCurrency.symbol
                              )
                            }
                          />
                          <Line
                            type="monotone"
                            dataKey="investedAmount"
                            stroke={theme.palette.primary.main}
                            strokeWidth={2}
                            dot={false}
                            name="Invested"
                          />
                          <Line
                            type="monotone"
                            dataKey="maturityValue"
                            stroke={theme.palette.secondary.main}
                            strokeWidth={2.5}
                            dot={false}
                            name="Value"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default PpfCalculator;
