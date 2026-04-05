'use client';

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Container from "../Container/Container";
import ToolFerryLogo from "../ToolFerryLogo/ToolFerryLogo";

function Header() {
  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: "1px solid rgba(11, 31, 51, 0.08)",
        backdropFilter: "blur(14px)",
        backgroundColor: "rgba(243, 247, 248, 0.88)",
      }}
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
          />
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
