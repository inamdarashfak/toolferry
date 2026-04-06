'use client';

import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";
import ScrollToInstructionsButton from "../ScrollToInstructionsButton/ScrollToInstructionsButton";
import {
  currencyOptions,
  detectDefaultCurrency,
  formatNumber,
  getCalculatorPanelSx,
  getCalculatorPaperSx,
  sanitizeNumericInput,
  useAnimatedNumber,
} from "../../lib/calculator";
import { preserveFormattedNumberCaret } from "../../lib/formattedNumericInput";

const DEFAULT_VALUES = {
  originalPrice: "4999",
  discountRate: "20",
  taxRate: "0",
};

function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState(DEFAULT_VALUES.originalPrice);
  const [discountRate, setDiscountRate] = useState(DEFAULT_VALUES.discountRate);
  const [taxRate, setTaxRate] = useState(DEFAULT_VALUES.taxRate);
  const [currencyCode, setCurrencyCode] = useState(currencyOptions[0].code);

  useEffect(() => {
    setCurrencyCode(detectDefaultCurrency().code);
  }, []);

  const selectedCurrency =
    currencyOptions.find((option) => option.code === currencyCode) ??
    currencyOptions[0];
  const numberLocale = selectedCurrency.locale;

  const originalAmount = Number(originalPrice) || 0;
  const discountPercent = Number(discountRate) || 0;
  const taxPercent = Number(taxRate) || 0;

  const result = useMemo(() => {
    if (originalAmount < 0 || discountPercent < 0 || taxPercent < 0) {
      return {
        hasValidInput: false,
        discountAmount: 0,
        discountedSubtotal: 0,
        taxAmount: 0,
        finalPrice: 0,
      };
    }

    const discountAmount = originalAmount * (discountPercent / 100);
    const discountedSubtotal = originalAmount - discountAmount;
    const taxAmount = discountedSubtotal * (taxPercent / 100);

    return {
      hasValidInput: true,
      discountAmount,
      discountedSubtotal,
      taxAmount,
      finalPrice: discountedSubtotal + taxAmount,
    };
  }, [discountPercent, originalAmount, taxPercent]);

  const animatedDiscount = useAnimatedNumber(result.discountAmount);
  const animatedSubtotal = useAnimatedNumber(result.discountedSubtotal);
  const animatedTax = useAnimatedNumber(result.taxAmount);
  const animatedFinal = useAnimatedNumber(result.finalPrice);

  const handleReset = () => {
    setOriginalPrice(DEFAULT_VALUES.originalPrice);
    setDiscountRate(DEFAULT_VALUES.discountRate);
    setTaxRate(DEFAULT_VALUES.taxRate);
    setCurrencyCode(detectDefaultCurrency().code);
  };

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                Discount Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}>
              Calculate discount savings, the reduced subtotal, and the final amount after
              optional tax in one place.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Original Price"
                    value={
                      originalPrice === ""
                        ? ""
                        : formatNumber(Number(originalPrice), numberLocale, {
                            maximumFractionDigits: 0,
                          })
                    }
                    onChange={(event) => {
                      const nextValue = sanitizeNumericInput(event.target.value);
                      preserveFormattedNumberCaret({
                        event,
                        nextValue,
                        setValue: setOriginalPrice,
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

                  <TextField
                    fullWidth
                    size="small"
                    label="Discount (%)"
                    value={discountRate}
                    onChange={(event) => setDiscountRate(sanitizeNumericInput(event.target.value, true))}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="Tax After Discount (%)"
                    value={taxRate}
                    onChange={(event) => setTaxRate(sanitizeNumericInput(event.target.value, true))}
                  />

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
              <Paper sx={(theme) => ({ ...getCalculatorPanelSx(theme), minHeight: "100%" })}>
                <Stack spacing={1.5} divider={<Divider flexItem />}>
                  <Box>
                    <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 700 }}>
                      Discount Summary
                    </Typography>
                  </Box>

                  {result.hasValidInput ? (
                    <>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">You Save</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {selectedCurrency.symbol}{" "}
                          {formatNumber(animatedDiscount, numberLocale)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Subtotal After Discount</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {selectedCurrency.symbol}{" "}
                          {formatNumber(animatedSubtotal, numberLocale)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Tax Amount</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {selectedCurrency.symbol} {formatNumber(animatedTax, numberLocale)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Final Price</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {selectedCurrency.symbol} {formatNumber(animatedFinal, numberLocale)}
                        </Typography>
                      </Stack>
                    </>
                  ) : (
                    <Typography color="text.secondary">
                      Enter valid non-negative values for price, discount, and tax to see the
                      result.
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

export default DiscountCalculator;
