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
import { useMemo, useState } from "react";
import ScrollToInstructionsButton from "../ScrollToInstructionsButton/ScrollToInstructionsButton";

type LinearUnit = {
  label: string;
  symbol: string;
  toBase: number;
};

type UnitCategory =
  | {
      label: string;
      kind: "linear";
      baseLabel: string;
      units: Record<string, LinearUnit>;
    }
  | {
      label: string;
      kind: "temperature";
      baseLabel: string;
      units: Record<
        string,
        {
          label: string;
          symbol: string;
          toBase: (value: number) => number;
          fromBase: (value: number) => number;
        }
      >;
    }
  | {
      label: string;
      kind: "fuelEconomy";
      baseLabel: string;
      units: Record<string, { label: string; symbol: string; toKmpl: number }>;
    };

const unitCategories: Record<string, UnitCategory> = {
  area: {
    label: "Area",
    kind: "linear",
    baseLabel: "square meter",
    units: {
      sqm: { label: "Square Meter", symbol: "m²", toBase: 1 },
      sqkm: { label: "Square Kilometer", symbol: "km²", toBase: 1_000_000 },
      sqcm: { label: "Square Centimeter", symbol: "cm²", toBase: 0.0001 },
      sqft: { label: "Square Foot", symbol: "ft²", toBase: 0.09290304 },
      sqin: { label: "Square Inch", symbol: "in²", toBase: 0.00064516 },
      acre: { label: "Acre", symbol: "ac", toBase: 4046.8564224 },
      hectare: { label: "Hectare", symbol: "ha", toBase: 10000 },
    },
  },
  dataTransferRate: {
    label: "Data Transfer Rate",
    kind: "linear",
    baseLabel: "bit per second",
    units: {
      bps: { label: "Bit per second", symbol: "bps", toBase: 1 },
      kbps: { label: "Kilobit per second", symbol: "kbps", toBase: 1_000 },
      mbps: { label: "Megabit per second", symbol: "Mbps", toBase: 1_000_000 },
      gbps: { label: "Gigabit per second", symbol: "Gbps", toBase: 1_000_000_000 },
      Bps: { label: "Byte per second", symbol: "B/s", toBase: 8 },
      KBps: { label: "Kilobyte per second", symbol: "KB/s", toBase: 8_000 },
      MBps: { label: "Megabyte per second", symbol: "MB/s", toBase: 8_000_000 },
    },
  },
  digitalStorage: {
    label: "Digital Storage",
    kind: "linear",
    baseLabel: "byte",
    units: {
      B: { label: "Byte", symbol: "B", toBase: 1 },
      KB: { label: "Kilobyte", symbol: "KB", toBase: 1024 },
      MB: { label: "Megabyte", symbol: "MB", toBase: 1024 ** 2 },
      GB: { label: "Gigabyte", symbol: "GB", toBase: 1024 ** 3 },
      TB: { label: "Terabyte", symbol: "TB", toBase: 1024 ** 4 },
      bit: { label: "Bit", symbol: "b", toBase: 1 / 8 },
    },
  },
  energy: {
    label: "Energy",
    kind: "linear",
    baseLabel: "joule",
    units: {
      joule: { label: "Joule", symbol: "J", toBase: 1 },
      kilojoule: { label: "Kilojoule", symbol: "kJ", toBase: 1_000 },
      calorie: { label: "Calorie", symbol: "cal", toBase: 4.184 },
      kilocalorie: { label: "Kilocalorie", symbol: "kcal", toBase: 4184 },
      wattHour: { label: "Watt-hour", symbol: "Wh", toBase: 3600 },
      kilowattHour: { label: "Kilowatt-hour", symbol: "kWh", toBase: 3_600_000 },
    },
  },
  frequency: {
    label: "Frequency",
    kind: "linear",
    baseLabel: "hertz",
    units: {
      hertz: { label: "Hertz", symbol: "Hz", toBase: 1 },
      kilohertz: { label: "Kilohertz", symbol: "kHz", toBase: 1_000 },
      megahertz: { label: "Megahertz", symbol: "MHz", toBase: 1_000_000 },
      gigahertz: { label: "Gigahertz", symbol: "GHz", toBase: 1_000_000_000 },
    },
  },
  fuelEconomy: {
    label: "Fuel Economy",
    kind: "fuelEconomy",
    baseLabel: "kilometer per liter",
    units: {
      kmpl: { label: "Kilometer per liter", symbol: "km/L", toKmpl: 1 },
      mpl: { label: "Mile per liter", symbol: "mi/L", toKmpl: 1.609344 },
      mpgUS: {
        label: "Miles per gallon (US)",
        symbol: "mpg",
        toKmpl: 0.425143707,
      },
      mpgImp: {
        label: "Miles per gallon (UK)",
        symbol: "mpg (UK)",
        toKmpl: 0.35400619,
      },
      l100km: { label: "Liter per 100 km", symbol: "L/100km", toKmpl: 1 },
    },
  },
  length: {
    label: "Length",
    kind: "linear",
    baseLabel: "meter",
    units: {
      meter: { label: "Meter", symbol: "m", toBase: 1 },
      kilometer: { label: "Kilometer", symbol: "km", toBase: 1000 },
      centimeter: { label: "Centimeter", symbol: "cm", toBase: 0.01 },
      millimeter: { label: "Millimeter", symbol: "mm", toBase: 0.001 },
      inch: { label: "Inch", symbol: "in", toBase: 0.0254 },
      foot: { label: "Foot", symbol: "ft", toBase: 0.3048 },
      yard: { label: "Yard", symbol: "yd", toBase: 0.9144 },
      mile: { label: "Mile", symbol: "mi", toBase: 1609.344 },
    },
  },
  mass: {
    label: "Mass",
    kind: "linear",
    baseLabel: "kilogram",
    units: {
      kilogram: { label: "Kilogram", symbol: "kg", toBase: 1 },
      gram: { label: "Gram", symbol: "g", toBase: 0.001 },
      milligram: { label: "Milligram", symbol: "mg", toBase: 0.000001 },
      metricTon: { label: "Metric Ton", symbol: "t", toBase: 1000 },
      pound: { label: "Pound", symbol: "lb", toBase: 0.45359237 },
      ounce: { label: "Ounce", symbol: "oz", toBase: 0.028349523125 },
    },
  },
  planeAngle: {
    label: "Plane Angle",
    kind: "linear",
    baseLabel: "radian",
    units: {
      radian: { label: "Radian", symbol: "rad", toBase: 1 },
      degree: { label: "Degree", symbol: "°", toBase: Math.PI / 180 },
      gradian: { label: "Gradian", symbol: "gon", toBase: Math.PI / 200 },
      revolution: { label: "Revolution", symbol: "rev", toBase: Math.PI * 2 },
    },
  },
  pressure: {
    label: "Pressure",
    kind: "linear",
    baseLabel: "pascal",
    units: {
      pascal: { label: "Pascal", symbol: "Pa", toBase: 1 },
      kilopascal: { label: "Kilopascal", symbol: "kPa", toBase: 1000 },
      bar: { label: "Bar", symbol: "bar", toBase: 100000 },
      psi: { label: "PSI", symbol: "psi", toBase: 6894.757293168 },
      atmosphere: { label: "Atmosphere", symbol: "atm", toBase: 101325 },
    },
  },
  speed: {
    label: "Speed",
    kind: "linear",
    baseLabel: "meter per second",
    units: {
      mps: { label: "Meter per second", symbol: "m/s", toBase: 1 },
      kph: { label: "Kilometer per hour", symbol: "km/h", toBase: 0.2777777778 },
      mph: { label: "Mile per hour", symbol: "mph", toBase: 0.44704 },
      knot: { label: "Knot", symbol: "kn", toBase: 0.5144444444 },
      fps: { label: "Foot per second", symbol: "ft/s", toBase: 0.3048 },
    },
  },
  temperature: {
    label: "Temperature",
    kind: "temperature",
    baseLabel: "celsius",
    units: {
      celsius: {
        label: "Celsius",
        symbol: "°C",
        toBase: (value) => value,
        fromBase: (value) => value,
      },
      fahrenheit: {
        label: "Fahrenheit",
        symbol: "°F",
        toBase: (value) => ((value - 32) * 5) / 9,
        fromBase: (value) => (value * 9) / 5 + 32,
      },
      kelvin: {
        label: "Kelvin",
        symbol: "K",
        toBase: (value) => value - 273.15,
        fromBase: (value) => value + 273.15,
      },
    },
  },
  volume: {
    label: "Volume",
    kind: "linear",
    baseLabel: "liter",
    units: {
      liter: { label: "Liter", symbol: "L", toBase: 1 },
      milliliter: { label: "Milliliter", symbol: "mL", toBase: 0.001 },
      cubicMeter: { label: "Cubic meter", symbol: "m³", toBase: 1000 },
      gallonUS: { label: "Gallon (US)", symbol: "gal", toBase: 3.785411784 },
      quartUS: { label: "Quart (US)", symbol: "qt", toBase: 0.946352946 },
      pintUS: { label: "Pint (US)", symbol: "pt", toBase: 0.473176473 },
      cupUS: { label: "Cup (US)", symbol: "cup", toBase: 0.2365882365 },
    },
  },
};

const DEFAULT_CATEGORY = "length";

function sanitizeNumericInput(value: string) {
  const sanitized = value.replace(/[^0-9.-]/g, "");
  const isNegative = sanitized.startsWith("-");
  const unsigned = isNegative ? sanitized.slice(1) : sanitized;
  const [integerPart, ...decimals] = unsigned.split(".");
  const rebuilt = `${integerPart}${decimals.length ? `.${decimals.join("")}` : ""}`;

  return `${isNegative ? "-" : ""}${rebuilt}`;
}

function formatResult(value: number) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
  }).format(Number(value.toFixed(8)));
}

function convertValue(
  category: UnitCategory,
  fromKey: string,
  toKey: string,
  rawValue: number
) {
  if (category.kind === "linear") {
    const fromUnit = category.units[fromKey];
    const toUnit = category.units[toKey];
    const baseValue = rawValue * fromUnit.toBase;

    return baseValue / toUnit.toBase;
  }

  if (category.kind === "temperature") {
    const fromUnit = category.units[fromKey];
    const toUnit = category.units[toKey];
    const baseValue = fromUnit.toBase(rawValue);

    return toUnit.fromBase(baseValue);
  }

  const fromUnit = category.units[fromKey];
  const toUnit = category.units[toKey];

  if (fromKey === "l100km") {
    const kmplValue = rawValue === 0 ? 0 : 100 / rawValue;

    if (toKey === "l100km") {
      return rawValue;
    }

    return kmplValue / toUnit.toKmpl;
  }

  const kmplValue = rawValue * fromUnit.toKmpl;

  if (toKey === "l100km") {
    return kmplValue === 0 ? 0 : 100 / kmplValue;
  }

  return kmplValue / toUnit.toKmpl;
}

function UnitConverter() {
  const [categoryKey, setCategoryKey] = useState(DEFAULT_CATEGORY);
  const [inputValue, setInputValue] = useState("1");

  const category = unitCategories[categoryKey];
  const unitKeys = Object.keys(category.units);

  const [fromUnitKey, setFromUnitKey] = useState(unitKeys[0]);
  const [toUnitKey, setToUnitKey] = useState(unitKeys[1] ?? unitKeys[0]);

  const units = category.units;
  const fromUnit = units[fromUnitKey];
  const toUnit = units[toUnitKey];
  const numericValue = Number(inputValue) || 0;

  const convertedValue = useMemo(() => {
    if (!fromUnitKey || !toUnitKey) {
      return 0;
    }

    return convertValue(category, fromUnitKey, toUnitKey, numericValue);
  }, [category, fromUnitKey, numericValue, toUnitKey]);

  const conversionHint = useMemo(() => {
    const baseConversion = convertValue(category, fromUnitKey, toUnitKey, 1);

    return `1 ${fromUnit.symbol} = ${formatResult(baseConversion)} ${toUnit.symbol}`;
  }, [category, fromUnit.symbol, fromUnitKey, toUnit.symbol, toUnitKey]);

  const handleCategoryChange = (nextCategoryKey: string) => {
    const nextCategory = unitCategories[nextCategoryKey];
    const nextUnitKeys = Object.keys(nextCategory.units);

    setCategoryKey(nextCategoryKey);
    setFromUnitKey(nextUnitKeys[0]);
    setToUnitKey(nextUnitKeys[1] ?? nextUnitKeys[0]);
  };

  const handleSwap = () => {
    setFromUnitKey(toUnitKey);
    setToUnitKey(fromUnitKey);
  };

  const handleReset = () => {
    const defaultCategory = unitCategories[DEFAULT_CATEGORY];
    const defaultUnitKeys = Object.keys(defaultCategory.units);

    setCategoryKey(DEFAULT_CATEGORY);
    setFromUnitKey(defaultUnitKeys[0]);
    setToUnitKey(defaultUnitKeys[1] ?? defaultUnitKeys[0]);
    setInputValue("1");
  };

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
                Unit Converter
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}>
              Pick a category, choose the units you want, and convert instantly in
              a compact everyday-friendly layout.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper
                sx={{
                  p: { xs: 2.25, md: 2 },
                  borderRadius: 0,
                  border: "1px solid rgba(11, 31, 51, 0.08)",
                  boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
                }}
              >
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Converter"
                    value={categoryKey}
                    onChange={(event) => handleCategoryChange(event.target.value)}
                  >
                    {Object.entries(unitCategories).map(([key, item]) => (
                      <MenuItem key={key} value={key}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    size="small"
                    label="Value"
                    value={inputValue}
                    onChange={(event) =>
                      setInputValue(sanitizeNumericInput(event.target.value))
                    }
                  />

                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="From"
                        value={fromUnitKey}
                        onChange={(event) => setFromUnitKey(event.target.value)}
                      >
                        {unitKeys.map((key) => (
                          <MenuItem key={key} value={key}>
                            {units[key].label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="To"
                        value={toUnitKey}
                        onChange={(event) => setToUnitKey(event.target.value)}
                      >
                        {unitKeys.map((key) => (
                          <MenuItem key={key} value={key}>
                            {units[key].label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<SwapHorizRoundedIcon />}
                      onClick={handleSwap}
                      fullWidth
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
                      fullWidth
                      sx={{ borderRadius: 0 }}
                    >
                      Reset
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper
                sx={{
                  p: 2.25,
                  height: "100%",
                  borderRadius: 0,
                  border: "1px solid rgba(11, 31, 51, 0.08)",
                  boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
                }}
              >
                <Stack spacing={2}>
                  <Stack
                    divider={<Divider />}
                    sx={{
                      border: "1px solid rgba(11, 31, 51, 0.08)",
                      backgroundColor: "rgba(245, 248, 248, 0.85)",
                    }}
                  >
                    <SummaryRow
                      label="Category"
                      value={category.label}
                    />
                    <SummaryRow
                      label="From"
                      value={`${formatResult(numericValue)} ${fromUnit.symbol}`}
                    />
                    <SummaryRow
                      label="To"
                      value={`${formatResult(convertedValue)} ${toUnit.symbol}`}
                    />
                    <SummaryRow
                      label="Base Unit"
                      value={category.baseLabel}
                    />
                  </Stack>

                  <Divider />

                  <Paper
                    sx={{
                      p: 2.5,
                      borderRadius: 0,
                      border: "1px solid rgba(11, 31, 51, 0.08)",
                      backgroundColor: "rgba(255, 255, 255, 0.92)",
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography
                        variant="overline"
                        sx={{ color: "secondary.main", fontWeight: 700 }}
                      >
                        Converted Result
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          lineHeight: 1.1,
                          fontSize: { xs: "1.65rem", md: "2rem" },
                          wordBreak: "break-word",
                        }}
                      >
                        {formatResult(convertedValue)} {toUnit.symbol}
                      </Typography>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {conversionHint}
                      </Typography>
                    </Stack>
                  </Paper>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
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
        px: 2,
        py: 1.5,
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

export default UnitConverter;
