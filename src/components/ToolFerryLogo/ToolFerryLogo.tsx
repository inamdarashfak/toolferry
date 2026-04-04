import Box from "@mui/material/Box";

type ToolFerryLogoProps = {
  compact?: boolean;
};

function ToolFerryLogo({ compact = false }: ToolFerryLogoProps) {
  return (
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
  );
}

export default ToolFerryLogo;
