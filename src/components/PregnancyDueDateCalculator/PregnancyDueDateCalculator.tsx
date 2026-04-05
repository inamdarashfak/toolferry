import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import ScrollToInstructionsButton from "../ScrollToInstructionsButton/ScrollToInstructionsButton";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const DEFAULT_CYCLE_LENGTH = 28;

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
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

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getDaysBetween(fromDate: Date, toDate: Date) {
  const utcFrom = Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const utcTo = Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

  return Math.floor((utcTo - utcFrom) / MILLISECONDS_PER_DAY);
}

function getDefaultLastPeriodDate() {
  return formatDateInput(addDays(new Date(), -84));
}

function getGestationLabel(daysPregnant: number) {
  if (daysPregnant < 0) {
    return "Not started";
  }

  const weeks = Math.floor(daysPregnant / 7);
  const days = daysPregnant % 7;

  return `${weeks} weeks ${days} days`;
}

function PregnancyDueDateCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState(getDefaultLastPeriodDate);
  const [cycleLength, setCycleLength] = useState(String(DEFAULT_CYCLE_LENGTH));

  const result = useMemo(() => {
    const parsedLastPeriodDate = parseDateInput(lastPeriodDate);
    const cycleLengthNumber = Number(cycleLength) || 0;

    if (!parsedLastPeriodDate) {
      return {
        error: "Enter a valid first day of the last menstrual period.",
        values: null,
      };
    }

    if (cycleLengthNumber < 21 || cycleLengthNumber > 45) {
      return {
        error: "Cycle length should stay between 21 and 45 days.",
        values: null,
      };
    }

    const cycleAdjustment = cycleLengthNumber - DEFAULT_CYCLE_LENGTH;
    const dueDate = addDays(parsedLastPeriodDate, 280 + cycleAdjustment);
    const conceptionDate = addDays(parsedLastPeriodDate, cycleLengthNumber - 14);
    const today = new Date();
    const daysPregnant = getDaysBetween(parsedLastPeriodDate, today);
    const daysRemaining = getDaysBetween(today, dueDate);
    const trimester =
      daysPregnant < 13 * 7 ? "First trimester" : daysPregnant < 28 * 7 ? "Second trimester" : "Third trimester";

    return {
      error: "",
      values: {
        dueDate,
        conceptionDate,
        daysPregnant,
        daysRemaining,
        trimester,
      },
    };
  }, [cycleLength, lastPeriodDate]);

  const handleReset = () => {
    setLastPeriodDate(getDefaultLastPeriodDate());
    setCycleLength(String(DEFAULT_CYCLE_LENGTH));
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
                Pregnancy Due Date Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Estimate your due date from the first day of your last period and adjust
              for shorter or longer cycle lengths.
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
                    label="First Day of Last Period"
                    type="date"
                    value={lastPeriodDate}
                    onChange={(event) => setLastPeriodDate(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      spacing={0.5}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Cycle Length
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cycleLength || DEFAULT_CYCLE_LENGTH} days
                      </Typography>
                    </Stack>

                    <TextField
                      fullWidth
                      size="small"
                      value={cycleLength}
                      onChange={(event) =>
                        setCycleLength(event.target.value.replace(/[^0-9]/g, ""))
                      }
                    />

                    <Slider
                      size="small"
                      sx={{ mt: 1 }}
                      value={Number(cycleLength) || DEFAULT_CYCLE_LENGTH}
                      min={21}
                      max={45}
                      step={1}
                      onChange={(_, value) => setCycleLength(String(value))}
                    />
                  </Box>

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
                    <Typography
                      variant="overline"
                      sx={{ color: "secondary.main", fontWeight: 700 }}
                    >
                      Pregnancy Estimate
                    </Typography>
                  </Box>

                  {result.values ? (
                    <>
                      <SummaryRow
                        label="Estimated Due Date"
                        value={formatLongDate(result.values.dueDate)}
                      />
                      <SummaryRow
                        label="Estimated Conception Date"
                        value={formatLongDate(result.values.conceptionDate)}
                      />
                      <SummaryRow
                        label="Pregnancy Progress"
                        value={getGestationLabel(result.values.daysPregnant)}
                      />
                      <SummaryRow
                        label="Current Stage"
                        value={result.values.trimester}
                      />
                      <SummaryRow
                        label="Days Remaining"
                        value={String(Math.max(result.values.daysRemaining, 0))}
                      />
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

          <Paper
            sx={{
              p: 2,
              borderRadius: 0,
              border: "1px solid rgba(11, 31, 51, 0.08)",
              backgroundColor: "rgba(245, 248, 248, 0.82)",
            }}
          >
            <Stack spacing={0.75}>
              <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 700 }}>
                Note
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                This estimate is based on the first day of the last menstrual period and
                a 280-day pregnancy, adjusted for cycle length. Early ultrasound dating
                is typically more accurate than LMP-based estimation.
              </Typography>
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
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography sx={{ fontWeight: 700, wordBreak: "break-word" }}>{value}</Typography>
    </Stack>
  );
}

export default PregnancyDueDateCalculator;
