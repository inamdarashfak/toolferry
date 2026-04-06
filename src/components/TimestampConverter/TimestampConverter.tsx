'use client';

import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import ScrollToInstructionsButton from "../ScrollToInstructionsButton/ScrollToInstructionsButton";
import { getCalculatorPanelSx, getCalculatorPaperSx, sanitizeNumericInput } from "../../lib/calculator";

type Mode = "timestampToDate" | "dateToTimestamp";
type Unit = "seconds" | "milliseconds";

function formatDateTimeInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const DEFAULT_VALUES = {
  mode: "timestampToDate" as Mode,
  unit: "seconds" as Unit,
  timestamp: `${Math.floor(Date.now() / 1000)}`,
  dateTime: formatDateTimeInput(new Date()),
};

function TimestampConverter() {
  const [mode, setMode] = useState<Mode>(DEFAULT_VALUES.mode);
  const [unit, setUnit] = useState<Unit>(DEFAULT_VALUES.unit);
  const [timestamp, setTimestamp] = useState(DEFAULT_VALUES.timestamp);
  const [dateTime, setDateTime] = useState(DEFAULT_VALUES.dateTime);

  const result = useMemo(() => {
    if (mode === "timestampToDate") {
      const numericValue = Number(timestamp);
      if (!Number.isFinite(numericValue) || numericValue <= 0) {
        return {
          error: "Enter a valid Unix timestamp.",
          utcValue: "",
          localValue: "",
          seconds: "",
          milliseconds: "",
        };
      }

      const date =
        unit === "seconds" ? new Date(numericValue * 1000) : new Date(numericValue);

      if (Number.isNaN(date.getTime())) {
        return {
          error: "Enter a valid Unix timestamp.",
          utcValue: "",
          localValue: "",
          seconds: "",
          milliseconds: "",
        };
      }

      return {
        error: "",
        utcValue: date.toUTCString(),
        localValue: date.toLocaleString(),
        seconds: `${Math.floor(date.getTime() / 1000)}`,
        milliseconds: `${date.getTime()}`,
      };
    }

    if (!dateTime) {
      return {
        error: "Choose a valid date and time.",
        utcValue: "",
        localValue: "",
        seconds: "",
        milliseconds: "",
      };
    }

    const date = new Date(dateTime);
    if (Number.isNaN(date.getTime())) {
      return {
        error: "Choose a valid date and time.",
        utcValue: "",
        localValue: "",
        seconds: "",
        milliseconds: "",
      };
    }

    return {
      error: "",
      utcValue: date.toUTCString(),
      localValue: date.toLocaleString(),
      seconds: `${Math.floor(date.getTime() / 1000)}`,
      milliseconds: `${date.getTime()}`,
    };
  }, [dateTime, mode, timestamp, unit]);

  const handleReset = () => {
    setMode(DEFAULT_VALUES.mode);
    setUnit(DEFAULT_VALUES.unit);
    setTimestamp(DEFAULT_VALUES.timestamp);
    setDateTime(DEFAULT_VALUES.dateTime);
  };

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                Timestamp Converter
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Convert Unix timestamps into readable dates and convert selected
              dates back into seconds or milliseconds.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Mode"
                    value={mode}
                    onChange={(event) => setMode(event.target.value as Mode)}
                  >
                    <MenuItem value="timestampToDate">Timestamp to Date</MenuItem>
                    <MenuItem value="dateToTimestamp">Date to Timestamp</MenuItem>
                  </TextField>

                  {mode === "timestampToDate" ? (
                    <>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Timestamp Unit"
                        value={unit}
                        onChange={(event) => setUnit(event.target.value as Unit)}
                      >
                        <MenuItem value="seconds">Seconds</MenuItem>
                        <MenuItem value="milliseconds">Milliseconds</MenuItem>
                      </TextField>
                      <TextField
                        fullWidth
                        size="small"
                        label="Unix Timestamp"
                        value={timestamp}
                        onChange={(event) =>
                          setTimestamp(sanitizeNumericInput(event.target.value))
                        }
                      />
                    </>
                  ) : (
                    <TextField
                      fullWidth
                      size="small"
                      label="Date and Time"
                      type="datetime-local"
                      value={dateTime}
                      onChange={(event) => setDateTime(event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}

                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    startIcon={<AutorenewRoundedIcon />}
                    onClick={handleReset}
                    sx={{ alignSelf: "flex-start", borderRadius: 0 }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper sx={(theme) => ({ ...getCalculatorPanelSx(theme), minHeight: "100%" })}>
                <Stack spacing={1.5} divider={<Divider flexItem />}>
                  <Box>
                    <Typography variant="overline" sx={{ color: "secondary.main", fontWeight: 700 }}>
                      Converted Values
                    </Typography>
                  </Box>

                  {result.error ? (
                    <Typography color="text.secondary">{result.error}</Typography>
                  ) : (
                    <>
                      <Stack spacing={0.5}>
                        <Typography color="text.secondary">UTC</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.utcValue}</Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="text.secondary">Local Time</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.localValue}</Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Seconds</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.seconds}</Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Milliseconds</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.milliseconds}</Typography>
                      </Stack>
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

export default TimestampConverter;
