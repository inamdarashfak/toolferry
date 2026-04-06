'use client';

import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import { getTimeZones } from "@vvo/tzdb";
import Autocomplete from "@mui/material/Autocomplete";
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
import { getCalculatorPanelSx, getCalculatorPaperSx } from "../../lib/calculator";

type TimeZoneOption = {
  value: string;
  label: string;
  searchText: string;
  searchTerms: string[];
};

function normalizeSearchValue(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function formatTimeZoneLabel({
  name,
  mainCities,
  countryName,
  abbreviation,
  currentTimeFormat,
}: {
  name: string;
  mainCities: string[];
  countryName: string;
  abbreviation: string;
  currentTimeFormat: string;
}) {
  const cityLabel =
    mainCities[0] ?? name.split("/").slice(1).join(" / ").replace(/_/g, " ") ?? name;

  return `${name} • ${cityLabel} (${countryName}) ${abbreviation} ${currentTimeFormat}`;
}

function getTimeZoneOptions(): TimeZoneOption[] {
  const supportedZones =
    typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : [];
  const supportedZoneSet = new Set(supportedZones);
  const tzdbOptions = getTimeZones()
    .map((timeZone) => {
      const resolvedValue =
        supportedZoneSet.size === 0
          ? timeZone.name
          : [timeZone.name, ...timeZone.group].find((zoneName) =>
              supportedZoneSet.has(zoneName),
            );

      if (!resolvedValue) {
        return null;
      }

      const searchText = normalizeSearchValue(
        [
          timeZone.name,
          resolvedValue,
          timeZone.name.replaceAll("/", " "),
          timeZone.name.replaceAll("_", " "),
          timeZone.abbreviation,
          timeZone.alternativeName,
          timeZone.countryName,
        ...timeZone.mainCities,
        ...timeZone.group,
      ]
          .join(" "),
      );

      return {
        value: resolvedValue,
        label: formatTimeZoneLabel(timeZone),
        searchText,
        searchTerms: Array.from(new Set(searchText.split(" ").filter(Boolean))),
      };
    })
    .filter((option): option is TimeZoneOption => Boolean(option))
    .sort((left, right) => left.label.localeCompare(right.label));

  return [
    {
      value: "UTC",
      label: "UTC",
      searchText: "utc coordinated universal time",
      searchTerms: ["utc", "coordinated", "universal", "time"],
    },
    ...tzdbOptions,
  ];
}

const timeZones = getTimeZoneOptions();

function filterTimeZoneOptions(options: TimeZoneOption[], inputValue: string) {
  const normalizedInput = normalizeSearchValue(inputValue);

  if (!normalizedInput) {
    return options.slice(0, 200);
  }

  return options
    .filter(
      (option) =>
        option.searchText.includes(normalizedInput) ||
        option.searchTerms.some((term) => term.includes(normalizedInput)),
    )
    .slice(0, 200);
}

function formatDateTimeInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getFormatter(timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function getTimeZoneOffsetMilliseconds(date: Date, timeZone: string) {
  const parts = getFormatter(timeZone).formatToParts(date);
  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const utcTimestamp = Date.UTC(
    Number(lookup.year),
    Number(lookup.month) - 1,
    Number(lookup.day),
    Number(lookup.hour),
    Number(lookup.minute),
    Number(lookup.second),
  );

  return utcTimestamp - date.getTime();
}

function convertZonedDateTimeToUtc(value: string, timeZone: string) {
  if (!value) {
    return null;
  }

  const [datePart, timePart] = value.split("T");
  if (!datePart || !timePart) {
    return null;
  }

  const [yearText, monthText, dayText] = datePart.split("-");
  const [hourText, minuteText] = timePart.split(":");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  let utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));

  for (let index = 0; index < 2; index += 1) {
    const offset = getTimeZoneOffsetMilliseconds(utcGuess, timeZone);
    utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute) - offset);
  }

  return utcGuess;
}

function formatZonedDateTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getTimeZoneOffsetLabel(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "shortOffset",
  });
  const parts = formatter.formatToParts(date);
  return parts.find((part) => part.type === "timeZoneName")?.value ?? "";
}

function TimeZoneConverter() {
  const [dateTime, setDateTime] = useState(() => formatDateTimeInput(new Date()));
  const [fromTimeZone, setFromTimeZone] = useState("UTC");
  const [toTimeZone, setToTimeZone] = useState("Asia/Kolkata");
  const fromTimeZoneOption =
    timeZones.find((option) => option.value === fromTimeZone) ?? timeZones[0];
  const toTimeZoneOption =
    timeZones.find((option) => option.value === toTimeZone) ??
    timeZones.find((option) => option.value === "Asia/Kolkata") ??
    timeZones[0];

  const result = useMemo(() => {
    const utcDate = convertZonedDateTimeToUtc(dateTime, fromTimeZone);

    if (!utcDate) {
      return {
        error: "Enter a valid date and time to convert between time zones.",
        converted: "",
        source: "",
        fromOffset: "",
        toOffset: "",
      };
    }

    return {
      error: "",
      source: formatZonedDateTime(utcDate, fromTimeZone),
      converted: formatZonedDateTime(utcDate, toTimeZone),
      fromOffset: getTimeZoneOffsetLabel(utcDate, fromTimeZone),
      toOffset: getTimeZoneOffsetLabel(utcDate, toTimeZone),
    };
  }, [dateTime, fromTimeZone, toTimeZone]);

  const handleSwap = () => {
    setFromTimeZone(toTimeZone);
    setToTimeZone(fromTimeZone);
  };

  const handleReset = () => {
    setDateTime(formatDateTimeInput(new Date()));
    setFromTimeZone("UTC");
    setToTimeZone("Asia/Kolkata");
  };

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                Time Zone Converter
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Search a broad set of global time zones and compare the converted time
              and UTC offsets side by side.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Date and Time"
                    type="datetime-local"
                    value={dateTime}
                    onChange={(event) => setDateTime(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  <Autocomplete
                    disableClearable
                    fullWidth
                    options={timeZones}
                    value={fromTimeZoneOption}
                    onChange={(_, option) => setFromTimeZone(option.value)}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    getOptionLabel={(option) => option.label}
                    filterOptions={(options, state) =>
                      filterTimeZoneOptions(options, state.inputValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} size="small" label="From Time Zone" />
                    )}
                  />

                  <Autocomplete
                    disableClearable
                    fullWidth
                    options={timeZones}
                    value={toTimeZoneOption}
                    onChange={(_, option) => setToTimeZone(option.value)}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    getOptionLabel={(option) => option.label}
                    filterOptions={(options, state) =>
                      filterTimeZoneOptions(options, state.inputValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} size="small" label="To Time Zone" />
                    )}
                  />

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
                      Converted Time
                    </Typography>
                  </Box>

                  {result.error ? (
                    <Typography color="text.secondary">{result.error}</Typography>
                  ) : (
                    <>
                      <Stack spacing={0.5}>
                        <Typography color="text.secondary">Source</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.source}</Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="text.secondary">Converted</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.converted}</Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Source Offset</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.fromOffset}</Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Target Offset</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.toOffset}</Typography>
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

export default TimeZoneConverter;
