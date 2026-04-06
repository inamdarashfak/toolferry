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
import { getCalculatorPanelSx, getCalculatorPaperSx } from "../../lib/calculator";

type BaseMode = "binary" | "decimal" | "hexadecimal";

const DEFAULT_VALUES = {
  mode: "decimal" as BaseMode,
  value: "255",
};

function parseBigIntValue(value: string, mode: BaseMode) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (mode === "binary") {
    if (!/^[01]+$/.test(trimmed)) {
      throw new Error("Binary input can contain only 0 and 1.");
    }
    return BigInt(`0b${trimmed}`);
  }

  if (mode === "hexadecimal") {
    if (!/^[0-9a-fA-F]+$/.test(trimmed)) {
      throw new Error("Hex input can contain only 0-9 and A-F.");
    }
    return BigInt(`0x${trimmed}`);
  }

  if (!/^-?\d+$/.test(trimmed)) {
    throw new Error("Decimal input can contain only whole numbers.");
  }

  return BigInt(trimmed);
}

function BaseNumberConverter() {
  const [mode, setMode] = useState<BaseMode>(DEFAULT_VALUES.mode);
  const [value, setValue] = useState(DEFAULT_VALUES.value);

  const result = useMemo(() => {
    try {
      const numericValue = parseBigIntValue(value, mode);

      if (numericValue === null) {
        return {
          error: "Enter a value to convert.",
          binary: "",
          decimal: "",
          hexadecimal: "",
        };
      }

      return {
        error: "",
        binary: numericValue.toString(2),
        decimal: numericValue.toString(10),
        hexadecimal: numericValue.toString(16).toUpperCase(),
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unable to convert the value.",
        binary: "",
        decimal: "",
        hexadecimal: "",
      };
    }
  }, [mode, value]);

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                Binary / Decimal / Hex Converter
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Convert a whole number between binary, decimal, and hexadecimal
              representations from one input field.
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
                    label="Input Base"
                    value={mode}
                    onChange={(event) => setMode(event.target.value as BaseMode)}
                  >
                    <MenuItem value="binary">Binary</MenuItem>
                    <MenuItem value="decimal">Decimal</MenuItem>
                    <MenuItem value="hexadecimal">Hexadecimal</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    size="small"
                    label="Value"
                    value={value}
                    onChange={(event) => setValue(event.target.value.trim())}
                  />

                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    startIcon={<AutorenewRoundedIcon />}
                    onClick={() => {
                      setMode(DEFAULT_VALUES.mode);
                      setValue(DEFAULT_VALUES.value);
                    }}
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
                        <Typography color="text.secondary">Binary</Typography>
                        <Typography sx={{ fontWeight: 700, wordBreak: "break-all" }}>
                          {result.binary}
                        </Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="text.secondary">Decimal</Typography>
                        <Typography sx={{ fontWeight: 700, wordBreak: "break-all" }}>
                          {result.decimal}
                        </Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="text.secondary">Hexadecimal</Typography>
                        <Typography sx={{ fontWeight: 700, wordBreak: "break-all" }}>
                          {result.hexadecimal}
                        </Typography>
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

export default BaseNumberConverter;
