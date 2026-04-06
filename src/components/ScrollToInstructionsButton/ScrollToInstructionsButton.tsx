'use client';

import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

function ScrollToInstructionsButton() {
  const handleClick = () => {
    const target = document.getElementById("tool-instructions");

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Tooltip title="How to use this tool">
      <IconButton
        aria-label="Scroll to instructions"
        size="small"
        onClick={handleClick}
        sx={(theme) => ({
          border: `1px solid ${theme.palette.divider}`,
          color: "secondary.main",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.08)"
              : "rgba(255,255,255,0.82)",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 122, 89, 0.12)"
                : "rgba(255, 122, 89, 0.08)",
          },
        })}
      >
        <HelpOutlineRoundedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

export default ScrollToInstructionsButton;
