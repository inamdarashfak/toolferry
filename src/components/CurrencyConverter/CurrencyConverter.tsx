'use client';

import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";
import ScrollToInstructionsButton from "../ScrollToInstructionsButton/ScrollToInstructionsButton";
import {
  currencyOptions,
  type CurrencyOption,
  detectDefaultCurrency,
  formatNumber,
  getCalculatorPanelSx,
  getCalculatorPaperSx,
  sanitizeNumericInput,
} from "../../lib/calculator";

const DEFAULT_VALUES = {
  amount: "100",
  fromCurrency: "USD",
  toCurrency: "INR",
};
const FRANKFURTER_API = "https://api.frankfurter.dev/v2/rates";
const RATE_CACHE_TTL_MS = 5 * 60 * 1000;

type RateResponse = Array<{
  date: string;
  rate: number;
  base: string;
  quote: string;
}>;

type CachedRate = {
  date: string;
  rate: number;
  expiresAt: number;
};

const rateCache = new Map<string, CachedRate>();
const inFlightRateRequests = new Map<string, Promise<CachedRate>>();

function getRateCacheKey(base: string, quote: string) {
  return `${base}:${quote}`;
}

function getCachedRate(base: string, quote: string) {
  const cacheKey = getRateCacheKey(base, quote);
  const cachedRate = rateCache.get(cacheKey);

  if (!cachedRate) {
    return null;
  }

  if (cachedRate.expiresAt <= Date.now()) {
    rateCache.delete(cacheKey);
    return null;
  }

  return cachedRate;
}

async function fetchExchangeRate(base: string, quote: string) {
  const cachedRate = getCachedRate(base, quote);

  if (cachedRate) {
    return cachedRate;
  }

  const cacheKey = getRateCacheKey(base, quote);
  const existingRequest = inFlightRateRequests.get(cacheKey);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async () => {
    const searchParams = new URLSearchParams({
      base,
      quotes: quote,
    });
    const response = await fetch(`${FRANKFURTER_API}?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error("Unable to fetch the latest exchange rate right now.");
    }

    const data = (await response.json()) as RateResponse;
    const rateEntry = data[0];

    if (!rateEntry?.rate) {
      throw new Error("No exchange rate was returned for this currency pair.");
    }

    const nextRate = {
      rate: rateEntry.rate,
      date: rateEntry.date,
      expiresAt: Date.now() + RATE_CACHE_TTL_MS,
    };

    rateCache.set(cacheKey, nextRate);
    return nextRate;
  })();

  inFlightRateRequests.set(cacheKey, request);

  try {
    return await request;
  } finally {
    inFlightRateRequests.delete(cacheKey);
  }
}

function CurrencySelectValue({ option }: { option: CurrencyOption }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" component="span">
      <Box
        component="span"
        sx={{
          minWidth: 28,
          fontSize: "1rem",
          lineHeight: 1,
          fontWeight: 700,
          color: "text.primary",
          textAlign: "center",
        }}
      >
        {option.symbol}
      </Box>
      <Box component="span">{option.code}</Box>
    </Stack>
  );
}

function CurrencyConverter() {
  const [amount, setAmount] = useState(DEFAULT_VALUES.amount);
  const [fromCurrency, setFromCurrency] = useState(DEFAULT_VALUES.fromCurrency);
  const [toCurrency, setToCurrency] = useState(DEFAULT_VALUES.toCurrency);
  const [liveRate, setLiveRate] = useState<number | null>(null);
  const [rateDate, setRateDate] = useState("");
  const [rateError, setRateError] = useState("");
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  useEffect(() => {
    const detected = detectDefaultCurrency().code;
    if (detected !== fromCurrency) {
      setFromCurrency(detected);
    }
  }, [fromCurrency]);

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setLiveRate(1);
      setRateDate("");
      setRateError("");
      setIsLoadingRate(false);
      return;
    }

    let isActive = true;

    async function loadRate() {
      const cachedRate = getCachedRate(fromCurrency, toCurrency);

      setIsLoadingRate(true);
      setRateError("");

      try {
        if (cachedRate) {
          setLiveRate(cachedRate.rate);
          setRateDate(cachedRate.date);
          return;
        }

        const nextRate = await fetchExchangeRate(fromCurrency, toCurrency);

        if (!isActive) {
          return;
        }

        setLiveRate(nextRate.rate);
        setRateDate(nextRate.date);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setLiveRate(null);
        setRateDate("");
        setRateError(
          error instanceof Error
            ? error.message
            : "Unable to fetch the latest exchange rate right now.",
        );
      } finally {
        if (isActive) {
          setIsLoadingRate(false);
        }
      }
    }

    void loadRate();

    return () => {
      isActive = false;
    };
  }, [fromCurrency, toCurrency]);

  const fromOption =
    currencyOptions.find((option) => option.code === fromCurrency) ?? currencyOptions[0];
  const toOption =
    currencyOptions.find((option) => option.code === toCurrency) ?? currencyOptions[0];

  const result = useMemo(() => {
    const numericAmount = Number(amount) || 0;

    if (numericAmount <= 0) {
      return {
        error: "Enter a valid amount and currency pair.",
        convertedAmount: 0,
        rate: 0,
      };
    }

    if (!liveRate) {
      return {
        error: rateError || "Unable to fetch the exchange rate for this currency pair.",
        convertedAmount: 0,
        rate: 0,
      };
    }

    return {
      error: "",
      convertedAmount: numericAmount * liveRate,
      rate: liveRate,
    };
  }, [amount, liveRate, rateError]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleReset = () => {
    setAmount(DEFAULT_VALUES.amount);
    setFromCurrency(detectDefaultCurrency().code);
    setToCurrency(DEFAULT_VALUES.toCurrency);
  };

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                Currency Converter
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Convert an amount between major currencies using the latest
              Frankfurter reference rates and compare the exchange rate instantly.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Amount"
                    value={amount}
                    onChange={(event) =>
                      setAmount(sanitizeNumericInput(event.target.value, true))
                    }
                  />

                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="From"
                    value={fromCurrency}
                    onChange={(event) => setFromCurrency(event.target.value)}
                    SelectProps={{
                      renderValue: (value) => {
                        const option =
                          currencyOptions.find((entry) => entry.code === value) ??
                          currencyOptions[0];

                        return <CurrencySelectValue option={option} />;
                      },
                    }}
                  >
                    {currencyOptions.map((option) => (
                      <MenuItem key={option.code} value={option.code}>
                        <CurrencySelectValue option={option} />
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="To"
                    value={toCurrency}
                    onChange={(event) => setToCurrency(event.target.value)}
                    SelectProps={{
                      renderValue: (value) => {
                        const option =
                          currencyOptions.find((entry) => entry.code === value) ??
                          currencyOptions[0];

                        return <CurrencySelectValue option={option} />;
                      },
                    }}
                  >
                    {currencyOptions.map((option) => (
                      <MenuItem key={option.code} value={option.code}>
                        <CurrencySelectValue option={option} />
                      </MenuItem>
                    ))}
                  </TextField>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<SwapHorizRoundedIcon />}
                      onClick={handleSwap}
                      sx={{ borderRadius: 0 }}
                    >
                      Swap
                    </Button>
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
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper sx={(theme) => ({ ...getCalculatorPanelSx(theme), minHeight: "100%" })}>
                <Stack spacing={1.5} divider={<Divider flexItem />}>
                  <Box>
                    <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 700 }}>
                      Conversion Result
                    </Typography>
                  </Box>

                  {isLoadingRate ? (
                    <Typography color="text.secondary">
                      Fetching the latest exchange rate...
                    </Typography>
                  ) : null}

                  {result.error ? (
                    <Typography color="text.secondary">{result.error}</Typography>
                  ) : (
                    <>
                      <Stack spacing={0.75}>
                        <Typography
                          sx={{
                            fontSize: { xs: "2rem", md: "2.4rem" },
                            fontWeight: 700,
                            lineHeight: 1.05,
                          }}
                        >
                          {toOption.symbol}{" "}
                          {formatNumber(result.convertedAmount, toOption.locale)}
                        </Typography>
                        <Typography color="text.secondary">
                          Converted from {fromOption.symbol} {fromOption.code} to {toOption.symbol}{" "}
                          {toOption.code}
                        </Typography>
                      </Stack>

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Reference Rate</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          1 {fromOption.code} = {formatNumber(result.rate, toOption.locale)}{" "}
                          {toOption.code}
                        </Typography>
                      </Stack>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {rateDate
                          ? `Latest available reference rate date: ${rateDate}.`
                          : "Latest available reference rate loaded from Frankfurter."}
                      </Typography>
                    </>
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

export default CurrencyConverter;
