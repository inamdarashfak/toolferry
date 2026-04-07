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
        background: "transparent",
      }}
    >
      <Box
        component="img"
        src={isDark ? "/iconDarkMode-transparent.png" : "/iconLightMode-transparent.png"}
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
