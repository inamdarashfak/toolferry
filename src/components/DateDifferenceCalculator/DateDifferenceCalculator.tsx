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
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from "../../lib/calculator";

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateInput(value: string) {
  if (!value) {
    return null;
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!year || !month || !day) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function getPreviousMonthDays(referenceDate: Date) {
  return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0).getDate();
}

function calculateExactDifference(fromDate: Date, toDate: Date) {
  if (fromDate > toDate) {
    return null;
  }

  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = toDate.getMonth() - fromDate.getMonth();
  let days = toDate.getDate() - fromDate.getDate();

  if (days < 0) {
    days += getPreviousMonthDays(toDate);
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const utcFrom = Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const utcTo = Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  const totalDays = Math.floor((utcTo - utcFrom) / millisecondsPerDay);

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks: totalDays / 7,
  };
}

function getDefaultStartDate() {
  const today = new Date();
  return formatDateInput(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
}

function DateDifferenceCalculator() {
  const [startDate, setStartDate] = useState(getDefaultStartDate);
  const [endDate, setEndDate] = useState(() => formatDateInput(new Date()));

  const result = useMemo(() => {
    const parsedStartDate = parseDateInput(startDate);
    const parsedEndDate = parseDateInput(endDate);

    if (!parsedStartDate || !parsedEndDate) {
      return {
        error: "Enter valid dates to calculate the difference.",
        difference: null,
      };
    }

    const difference = calculateExactDifference(parsedStartDate, parsedEndDate);

    if (!difference) {
      return {
        error: "Start date cannot be later than the end date.",
        difference: null,
      };
    }

    return {
      error: "",
      difference,
    };
  }, [endDate, startDate]);

  const handleReset = () => {
    setStartDate(getDefaultStartDate());
    setEndDate(formatDateInput(new Date()));
  };

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                Date Difference Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}>
              Measure the time between two dates as a calendar difference in years,
              months, and days, plus the total number of days.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    InputLabelProps={{ shrink: true }}
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
                      Difference Summary
                    </Typography>
                  </Box>

                  {result.difference ? (
                    <>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Years</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.difference.years}</Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Months</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.difference.months}</Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Days</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.difference.days}</Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Total Days</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.difference.totalDays}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Approx. Weeks</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.difference.totalWeeks.toFixed(1)}
                        </Typography>
                      </Stack>
                    </>
                  ) : (
                    <Typography color="error.main">{result.error}</Typography>
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

export default DateDifferenceCalculator;
