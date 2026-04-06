"use client";

import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { toPng } from "html-to-image";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "../../lib/analytics";

type ToolShareMenuProps = {
  toolName: string;
  toolSlug: string;
  toolDescription: string;
  shareTextOverride?: string;
};

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}

function buildDownloadName(toolSlug: string) {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `${toolSlug}-${timestamp}.png`;
}

function ToolShareMenu({
  toolName,
  toolSlug,
  toolDescription,
  shareTextOverride,
}: ToolShareMenuProps) {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const sharePayload = useMemo(() => {
    const shareText =
      shareTextOverride ??
      `Found a useful tool on Tool Ferry.\n${toolDescription}\nTry it out.`;
    const copyText = currentUrl ? `${shareText}\n${currentUrl}` : shareText;

    return {
      url: currentUrl,
      title: toolName,
      shareText,
      copyText,
      shortText: truncateText(shareText, 220),
    };
  }, [currentUrl, shareTextOverride, toolDescription, toolName]);

  const copyToClipboard = async (value: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setSnackbarMessage(successMessage);
    } catch {
      setSnackbarMessage("Unable to copy share text right now.");
    }
  };

  const handleDownload = async () => {
    const root = document.querySelector(
      "[data-tool-download-root]"
    ) as HTMLElement | null;

    if (!root) {
      setSnackbarMessage("Unable to find the tool panel to download.");
      trackEvent("tool_download_error", {
        tool_slug: toolSlug,
        tool_name: toolName,
        reason: "missing_root",
      });
      return;
    }

    try {
      const dataUrl = await toPng(root, {
        cacheBust: true,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        skipFonts: true,
        backgroundColor:
          getComputedStyle(document.body).backgroundColor || "#f3f7f8",
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = buildDownloadName(toolSlug);
      link.click();
      setSnackbarMessage("Tool snapshot downloaded.");
      trackEvent("tool_download", {
        tool_slug: toolSlug,
        tool_name: toolName,
        format: "png",
      });
    } catch {
      setSnackbarMessage("Unable to download this tool right now.");
      trackEvent("tool_download_error", {
        tool_slug: toolSlug,
        tool_name: toolName,
        reason: "capture_failed",
      });
    }
  };

  const openShareWindow = (url: string, action: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    trackEvent("tool_share_click", {
      tool_slug: toolSlug,
      tool_name: toolName,
      share_action: action,
    });
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      await copyToClipboard(sharePayload.shareText, "Share text copied.");
      return;
    }

    try {
      await navigator.share({
        title: sharePayload.title,
        text: sharePayload.shortText,
        url: sharePayload.url,
      });
      trackEvent("tool_share_click", {
        tool_slug: toolSlug,
        tool_name: toolName,
        share_action: "native_share",
      });
    } catch {
      return;
    }
  };

  const actions = [
    {
      name: "Download Result",
      icon: <FileDownloadRoundedIcon />,
      onClick: handleDownload,
    },
    {
      name: "Share",
      icon: <IosShareRoundedIcon />,
      onClick: handleNativeShare,
    },
    {
      name: "Copy",
      icon: <ContentCopyRoundedIcon />,
      onClick: async () => {
        trackEvent("tool_share_click", {
          tool_slug: toolSlug,
          tool_name: toolName,
          share_action: "copy",
        });
        await copyToClipboard(sharePayload.copyText, "Share text copied.");
      },
    },
    {
      name: "LinkedIn",
      icon: <LinkedInIcon />,
      onClick: () => {
        openShareWindow(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            sharePayload.url
          )}`,
          "linkedin"
        );
      },
    },
    {
      name: "Facebook",
      icon: <FacebookRoundedIcon />,
      onClick: () => {
        openShareWindow(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            sharePayload.url
          )}`,
          "facebook"
        );
      },
    },
    {
      name: "X",
      icon: <XIcon />,
      onClick: () => {
        openShareWindow(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            sharePayload.shortText
          )}&url=${encodeURIComponent(sharePayload.url)}`,
          "x"
        );
      },
    },
    {
      name: "Email",
      icon: <EmailRoundedIcon />,
      onClick: () => {
        openShareWindow(
          `mailto:?subject=${encodeURIComponent(
            toolName
          )}&body=${encodeURIComponent(sharePayload.copyText)}`,
          "email"
        );
      },
    },
  ];

  return (
    <>
      <Paper
        sx={{
          position: "fixed",
          right: { xs: 10, sm: 14, md: 18 },
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1200,
          px: 0.9,
          py: 1.1,
          borderRadius: 0,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(18,29,44,0.98) 0%, rgba(12,20,32,0.96) 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(247,250,250,0.95) 100%)",
          boxShadow: "0 12px 28px rgba(11, 31, 51, 0.14)",
        }}
      >
        <Stack spacing={0.65} alignItems="center">
          <Typography
            sx={{
              fontSize: "0.74rem",
              fontWeight: 700,
              letterSpacing: 0.3,
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              mb: 0.35,
            }}
          >
            Share this tool
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.65 }}>
            {actions.map((action) => (
              <Tooltip
                key={action.name}
                title={action.name}
                placement="left"
                arrow
              >
                <IconButton
                  aria-label={action.name}
                  size="small"
                  onClick={action.onClick}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 0,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    color: "text.primary",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(11, 31, 51, 0.05)",
                    },
                    "& svg": {
                      fontSize: "1.1rem",
                    },
                  }}
                >
                  {action.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Stack>
      </Paper>

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={3200}
        onClose={() => setSnackbarMessage("")}
        message={snackbarMessage}
      />
    </>
  );
}

export default ToolShareMenu;
