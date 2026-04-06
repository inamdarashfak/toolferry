import type { Theme } from "@mui/material/styles";

export function getChartTooltipStyles(theme: Theme) {
  return {
    contentStyle: {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(11, 19, 32, 0.96)"
          : "rgba(255, 255, 255, 0.98)",
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 0,
      boxShadow:
        theme.palette.mode === "dark"
          ? "0 12px 24px rgba(0, 0, 0, 0.28)"
          : "0 10px 20px rgba(11, 31, 51, 0.12)",
    },
    itemStyle: {
      color: theme.palette.text.primary,
    },
    labelStyle: {
      color: theme.palette.text.secondary,
      fontWeight: 700,
      marginBottom: 4,
    },
    wrapperStyle: {
      outline: "none",
    },
  } as const;
}
