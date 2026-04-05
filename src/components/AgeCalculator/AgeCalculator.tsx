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

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDefaultBirthDate() {
  const today = new Date();
  return formatDateInput(new Date(today.getFullYear() - 25, today.getMonth(), today.getDate()));
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

function calculateExactAge(fromDate: Date, toDate: Date) {
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
    totalMonths: years * 12 + months,
    totalDays,
  };
}

const DEFAULT_TO_DATE = formatDateInput(new Date());

function AgeCalculator() {
  const [birthDate, setBirthDate] = useState(getDefaultBirthDate);
  const [toDate, setToDate] = useState(DEFAULT_TO_DATE);

  const result = useMemo(() => {
    const parsedBirthDate = parseDateInput(birthDate);
    const parsedToDate = parseDateInput(toDate);

    if (!parsedBirthDate || !parsedToDate) {
      return {
        error: "Enter valid dates to calculate age.",
        age: null,
      };
    }

    const age = calculateExactAge(parsedBirthDate, parsedToDate);

    if (!age) {
      return {
        error: "Birth date cannot be later than the age calculation date.",
        age: null,
      };
    }

    return {
      error: "",
      age,
    };
  }, [birthDate, toDate]);

  const handleReset = () => {
    setBirthDate(getDefaultBirthDate());
    setToDate(formatDateInput(new Date()));
  };

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
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "2rem" } }}>
                Age Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Calculate exact age in years, months, and days from a birth date up to
              any selected date.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper
                sx={{
                  p: 2.25,
                  borderRadius: 0,
                  border: "1px solid rgba(11, 31, 51, 0.08)",
                  boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
                }}
              >
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Date of Birth"
                    type="date"
                    value={birthDate}
                    onChange={(event) => setBirthDate(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="Age As On"
                    type="date"
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
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
              <Paper
                sx={{
                  p: 2.25,
                  borderRadius: 0,
                  border: "1px solid rgba(11, 31, 51, 0.08)",
                  boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
                  minHeight: "100%",
                }}
              >
                <Stack spacing={1.5} divider={<Divider flexItem />}>
                  <Box>
                    <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 700 }}>
                      Exact Age
                    </Typography>
                  </Box>

                  {result.age ? (
                    <>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Years</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.age.years}</Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Months</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.age.months}</Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Days</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.age.days}</Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Total Months</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.age.totalMonths}</Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Total Days</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {new Intl.NumberFormat("en-IN").format(result.age.totalDays)}
                        </Typography>
                      </Stack>
                    </>
                  ) : (
                    <Typography color="error.main" sx={{ fontSize: "0.95rem" }}>
                      {result.error}
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

export default AgeCalculator;
