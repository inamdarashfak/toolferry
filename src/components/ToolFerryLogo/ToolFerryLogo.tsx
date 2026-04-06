import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

type ToolFerryLogoProps = {
  compact?: boolean;
};

function ToolFerryLogo({ compact = false }: ToolFerryLogoProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        px: isDark ? { xs: 0.55, sm: 0.7 } : 0,
        py: isDark ? { xs: 0.3, sm: 0.35 } : 0,
        borderRadius: isDark ? "8px" : 0,
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "none",
        background:
          isDark
            ? "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(245,247,250,0.92) 100%)"
            : "transparent",
        boxShadow: isDark ? "0 4px 10px rgba(0, 0, 0, 0.14)" : "none",
      }}
    >
      <Box
        component="img"
        src="/toolferry-logo-transparent.png"
        alt="ToolFerry"
        sx={{
          display: "block",
          width: compact ? { xs: 110, sm: 135 } : { xs: 220, sm: 280 },
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </Box>
  );
}

export default ToolFerryLogo;
