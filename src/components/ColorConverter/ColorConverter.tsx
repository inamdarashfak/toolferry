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
import { getCalculatorPanelSx, getCalculatorPaperSx } from "../../lib/calculator";

const DEFAULT_HEX = "#ff7a59";

type Rgb = { r: number; g: number; b: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function parseHex(hex: string): Rgb | null {
  const normalized = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function parseRgb(rgb: string): Rgb | null {
  const values = rgb.split(",").map((value) => Number(value.trim()));
  if (values.length !== 3 || values.some((value) => Number.isNaN(value))) {
    return null;
  }

  return {
    r: clamp(values[0], 0, 255),
    g: clamp(values[1], 0, 255),
    b: clamp(values[2], 0, 255),
  };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const hue = ((h % 360) + 360) % 360;
  const saturation = clamp(s / 100, 0, 1);
  const lightness = clamp(l / 100, 0, 1);

  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness - c / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (hue < 60) {
    red = c;
    green = x;
  } else if (hue < 120) {
    red = x;
    green = c;
  } else if (hue < 180) {
    green = c;
    blue = x;
  } else if (hue < 240) {
    green = x;
    blue = c;
  } else if (hue < 300) {
    red = x;
    blue = c;
  } else {
    red = c;
    blue = x;
  }

  return {
    r: Math.round((red + m) * 255),
    g: Math.round((green + m) * 255),
    b: Math.round((blue + m) * 255),
  };
}

function parseHsl(hsl: string): Rgb | null {
  const cleaned = hsl.replace(/%/g, "");
  const values = cleaned.split(",").map((value) => Number(value.trim()));
  if (values.length !== 3 || values.some((value) => Number.isNaN(value))) {
    return null;
  }

  return hslToRgb(values[0], values[1], values[2]);
}

function rgbToHex({ r, g, b }: Rgb) {
  return `#${[r, g, b]
    .map((value) => clamp(value, 0, 255).toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

function rgbToHsl({ r, g, b }: Rgb) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  let hue = 0;
  if (delta !== 0) {
    if (max === red) {
      hue = ((green - blue) / delta) % 6;
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }
  }

  hue = Math.round(hue * 60);
  if (hue < 0) {
    hue += 360;
  }

  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return `${hue}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%`;
}

function ColorConverter() {
  const [hexInput, setHexInput] = useState(DEFAULT_HEX);
  const [rgbInput, setRgbInput] = useState("255, 122, 89");
  const [hslInput, setHslInput] = useState("14, 100%, 67%");
  const [activeFormat, setActiveFormat] = useState<"hex" | "rgb" | "hsl">("hex");

  const result = useMemo(() => {
    const rgb =
      activeFormat === "hex"
        ? parseHex(hexInput)
        : activeFormat === "rgb"
          ? parseRgb(rgbInput)
          : parseHsl(hslInput);

    if (!rgb) {
      return {
        error: "Enter a valid HEX, RGB, or HSL color format.",
        hex: "",
        rgb: "",
        hsl: "",
        preview: DEFAULT_HEX,
      };
    }

    return {
      error: "",
      hex: rgbToHex(rgb),
      rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
      hsl: rgbToHsl(rgb),
      preview: rgbToHex(rgb),
    };
  }, [activeFormat, hexInput, hslInput, rgbInput]);

  const handleReset = () => {
    setHexInput(DEFAULT_HEX);
    setRgbInput("255, 122, 89");
    setHslInput("14, 100%, 67%");
    setActiveFormat("hex");
  };

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                Color Converter
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Convert colors between HEX, RGB, and HSL and preview the result
              instantly from one compact workspace.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="HEX"
                    value={hexInput}
                    onChange={(event) => {
                      setActiveFormat("hex");
                      setHexInput(event.target.value);
                    }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="RGB"
                    value={rgbInput}
                    onChange={(event) => {
                      setActiveFormat("rgb");
                      setRgbInput(event.target.value);
                    }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="HSL"
                    value={hslInput}
                    onChange={(event) => {
                      setActiveFormat("hsl");
                      setHslInput(event.target.value);
                    }}
                  />

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
                      Converted Color
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      height: 84,
                      border: "1px solid rgba(11, 31, 51, 0.08)",
                      backgroundColor: result.preview,
                    }}
                  />

                  {result.error ? (
                    <Typography color="text.secondary">{result.error}</Typography>
                  ) : (
                    <>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">HEX</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.hex}</Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">RGB</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.rgb}</Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">HSL</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{result.hsl}</Typography>
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

export default ColorConverter;
