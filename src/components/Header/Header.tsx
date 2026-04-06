'use client';

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Container from "../Container/Container";
import { useColorMode } from "../Providers/Providers";
import ToolFerryLogo from "../ToolFerryLogo/ToolFerryLogo";

function Header() {
  const { mode, toggleColorMode } = useColorMode();
  const isDark = mode === "dark";

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: "blur(14px)",
        backgroundColor: isDark
          ? "rgba(9, 17, 27, 0.84)"
          : "rgba(243, 247, 248, 0.88)",
      })}
    >
      <Container>
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, sm: 68 },
            gap: { xs: 1.5, sm: 2 },
            py: { xs: 1, sm: 0 },
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <Box
            component={Link}
            href="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              display: "inline-flex",
              alignItems: "center",
              py: 0.5,
            }}
          >
            <ToolFerryLogo />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }} />

          <Stack
            direction="row"
            spacing={1}
            sx={{
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "flex-start", sm: "flex-end" },
              flexWrap: "wrap",
            }}
          >
            <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
              <IconButton
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                onClick={toggleColorMode}
                sx={(theme) => ({
                  border: `1px solid ${theme.palette.divider}`,
                  color: theme.palette.text.primary,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.72)",
                  "&:hover": {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(255, 122, 89, 0.08)",
                  },
                })}
              >
                {isDark ? <LightModeRoundedIcon fontSize="small" /> : <DarkModeRoundedIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </Container>

      <Box
        sx={{
          backgroundColor: "#ff7a59",
          px: 2,
          py: 1,
        }}
      >
        <Typography
          sx={{
            color: "#ffffff",
            fontWeight: 800,
            textAlign: "center",
            fontSize: { xs: "0.82rem", sm: "0.86rem" },
            letterSpacing: "0.01em",
          }}
        >
          Welcome to ToolFerry. New tools are added regularly, so check back often.
        </Typography>
      </Box>
    </AppBar>
  );
}

export default Header;
