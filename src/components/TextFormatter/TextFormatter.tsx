'use client';

import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import PublishedWithChangesRoundedIcon from "@mui/icons-material/PublishedWithChangesRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useRef, useState } from "react";
import ScrollToInstructionsButton from "../ScrollToInstructionsButton/ScrollToInstructionsButton";

type TransformKey =
  | "none"
  | "uppercase"
  | "lowercase"
  | "titleCase"
  | "sentenceCase"
  | "capitalizeWords"
  | "trimText"
  | "trimEachLine"
  | "collapseSpaces"
  | "normalizeLineBreaks"
  | "removeEmptyLines"
  | "sortLinesAsc"
  | "sortLinesDesc"
  | "dedupeLines"
  | "reverseLines"
  | "slugify"
  | "snakeCase"
  | "kebabCase"
  | "camelCase"
  | "removeNumbers"
  | "removeSpecialCharacters"
  | "findReplace"
  | "prefixLines"
  | "suffixLines";

type TransformDefinition = {
  key: TransformKey;
  label: string;
  group: "Case" | "Cleanup" | "Lines" | "Convert" | "Replace";
};

type TransformGroup = TransformDefinition["group"];
type DiffSegment = {
  type: "equal" | "added" | "removed";
  value: string;
};

const transformDefinitions: TransformDefinition[] = [
  { key: "uppercase", label: "UPPERCASE", group: "Case" },
  { key: "lowercase", label: "lowercase", group: "Case" },
  { key: "titleCase", label: "Title Case", group: "Case" },
  { key: "sentenceCase", label: "Sentence case", group: "Case" },
  { key: "capitalizeWords", label: "Capitalize Words", group: "Case" },
  { key: "trimText", label: "Trim text", group: "Cleanup" },
  { key: "trimEachLine", label: "Trim each line", group: "Cleanup" },
  { key: "collapseSpaces", label: "Collapse spaces", group: "Cleanup" },
  { key: "normalizeLineBreaks", label: "Normalize line breaks", group: "Cleanup" },
  { key: "removeEmptyLines", label: "Remove empty lines", group: "Cleanup" },
  { key: "sortLinesAsc", label: "Sort A-Z", group: "Lines" },
  { key: "sortLinesDesc", label: "Sort Z-A", group: "Lines" },
  { key: "dedupeLines", label: "Dedupe lines", group: "Lines" },
  { key: "reverseLines", label: "Reverse lines", group: "Lines" },
  { key: "slugify", label: "Slugify", group: "Convert" },
  { key: "snakeCase", label: "snake_case", group: "Convert" },
  { key: "kebabCase", label: "kebab-case", group: "Convert" },
  { key: "camelCase", label: "camelCase", group: "Convert" },
  { key: "removeNumbers", label: "Remove numbers", group: "Convert" },
  {
    key: "removeSpecialCharacters",
    label: "Remove special chars",
    group: "Convert",
  },
  { key: "findReplace", label: "Find + replace", group: "Replace" },
  { key: "prefixLines", label: "Prefix lines", group: "Replace" },
  { key: "suffixLines", label: "Suffix lines", group: "Replace" },
];

function toTitleCase(text: string) {
  return text
    .toLowerCase()
    .replace(/\b([a-z])/g, (match) => match.toUpperCase());
}

function toSentenceCase(text: string) {
  return text
    .toLowerCase()
    .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) => match.toUpperCase());
}

function capitalizeWords(text: string) {
  return text.replace(/\b([a-zA-Z])/g, (match) => match.toUpperCase());
}

function trimEachLine(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .join("\n");
}

function collapseSpaces(text: string) {
  return text.replace(/[ \t]+/g, " ");
}

function normalizeLineBreaks(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function removeEmptyLines(text: string) {
  return normalizeLineBreaks(text)
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n");
}

function sortLines(text: string, descending = false) {
  const sorted = normalizeLineBreaks(text)
    .split("\n")
    .sort((a, b) => a.localeCompare(b));

  return (descending ? sorted.reverse() : sorted).join("\n");
}

function dedupeLines(text: string) {
  const seen = new Set<string>();

  return normalizeLineBreaks(text)
    .split("\n")
    .filter((line) => {
      if (seen.has(line)) {
        return false;
      }

      seen.add(line);
      return true;
    })
    .join("\n");
}

function reverseLines(text: string) {
  return normalizeLineBreaks(text).split("\n").reverse().join("\n");
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toSeparatedWords(text: string) {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toSnakeCase(text: string) {
  return toSeparatedWords(text)
    .map((word) => word.toLowerCase())
    .join("_");
}

function toKebabCase(text: string) {
  return toSeparatedWords(text)
    .map((word) => word.toLowerCase())
    .join("-");
}

function toCamelCase(text: string) {
  const words = toSeparatedWords(text).map((word) => word.toLowerCase());

  if (words.length === 0) {
    return "";
  }

  return `${words[0]}${words
    .slice(1)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")}`;
}

function removeNumbers(text: string) {
  return text.replace(/[0-9]/g, "");
}

function removeSpecialCharacters(text: string) {
  return text.replace(/[^a-zA-Z0-9\s]/g, "");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyTransform(
  key: TransformKey,
  input: string,
  helpers: {
    findText: string;
    replaceText: string;
    prefixText: string;
    suffixText: string;
    isCaseSensitive: boolean;
  }
) {
  switch (key) {
    case "uppercase":
      return input.toUpperCase();
    case "lowercase":
      return input.toLowerCase();
    case "titleCase":
      return toTitleCase(input);
    case "sentenceCase":
      return toSentenceCase(input);
    case "capitalizeWords":
      return capitalizeWords(input);
    case "trimText":
      return input.trim();
    case "trimEachLine":
      return trimEachLine(input);
    case "collapseSpaces":
      return collapseSpaces(input);
    case "normalizeLineBreaks":
      return normalizeLineBreaks(input);
    case "removeEmptyLines":
      return removeEmptyLines(input);
    case "sortLinesAsc":
      return sortLines(input);
    case "sortLinesDesc":
      return sortLines(input, true);
    case "dedupeLines":
      return dedupeLines(input);
    case "reverseLines":
      return reverseLines(input);
    case "slugify":
      return slugify(input);
    case "snakeCase":
      return toSnakeCase(input);
    case "kebabCase":
      return toKebabCase(input);
    case "camelCase":
      return toCamelCase(input);
    case "removeNumbers":
      return removeNumbers(input);
    case "removeSpecialCharacters":
      return removeSpecialCharacters(input);
    case "findReplace":
      if (!helpers.findText) {
        return input;
      }

      if (helpers.isCaseSensitive) {
        return input.split(helpers.findText).join(helpers.replaceText);
      }

      return input.replace(
        new RegExp(escapeRegExp(helpers.findText), "gi"),
        helpers.replaceText
      );
    case "prefixLines":
      return normalizeLineBreaks(input)
        .split("\n")
        .map((line) => `${helpers.prefixText}${line}`)
        .join("\n");
    case "suffixLines":
      return normalizeLineBreaks(input)
        .split("\n")
        .map((line) => `${line}${helpers.suffixText}`)
        .join("\n");
    case "none":
    default:
      return input;
  }
}

function getWordCount(text: string) {
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

function getLineCount(text: string) {
  if (text.length === 0) {
    return 0;
  }

  return normalizeLineBreaks(text).split("\n").length;
}

function tokenizeForDiff(text: string) {
  return text.split(/(\s+)/).filter((token) => token.length > 0);
}

function buildDiffSegments(original: string, modified: string): DiffSegment[] {
  const originalTokens = tokenizeForDiff(original);
  const modifiedTokens = tokenizeForDiff(modified);
  const rowCount = originalTokens.length + 1;
  const colCount = modifiedTokens.length + 1;
  const lcs: number[][] = Array.from({ length: rowCount }, () =>
    Array(colCount).fill(0)
  );

  for (let i = originalTokens.length - 1; i >= 0; i -= 1) {
    for (let j = modifiedTokens.length - 1; j >= 0; j -= 1) {
      if (originalTokens[i] === modifiedTokens[j]) {
        lcs[i][j] = lcs[i + 1][j + 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i + 1][j], lcs[i][j + 1]);
      }
    }
  }

  const segments: DiffSegment[] = [];
  let i = 0;
  let j = 0;

  while (i < originalTokens.length && j < modifiedTokens.length) {
    if (originalTokens[i] === modifiedTokens[j]) {
      segments.push({ type: "equal", value: originalTokens[i] });
      i += 1;
      j += 1;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      segments.push({ type: "removed", value: originalTokens[i] });
      i += 1;
    } else {
      segments.push({ type: "added", value: modifiedTokens[j] });
      j += 1;
    }
  }

  while (i < originalTokens.length) {
    segments.push({ type: "removed", value: originalTokens[i] });
    i += 1;
  }

  while (j < modifiedTokens.length) {
    segments.push({ type: "added", value: modifiedTokens[j] });
    j += 1;
  }

  return segments;
}

function TextFormatter() {
  const theme = useTheme();
  const stackEditors = useMediaQuery(theme.breakpoints.down("sm"));
  const splitterContainerRef = useRef<HTMLDivElement | null>(null);
  const [inputText, setInputText] = useState("");
  const [activeTransform, setActiveTransform] = useState<TransformKey>("none");
  const [selectedGroup, setSelectedGroup] = useState<TransformGroup>("Case");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [prefixText, setPrefixText] = useState("");
  const [suffixText, setSuffixText] = useState("");
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(38);
  const [isDragging, setIsDragging] = useState(false);

  const helperFieldsVisible =
    activeTransform === "findReplace" ||
    activeTransform === "prefixLines" ||
    activeTransform === "suffixLines";

  const outputText = useMemo(
    () =>
      applyTransform(activeTransform, inputText, {
        findText,
        replaceText,
        prefixText,
        suffixText,
        isCaseSensitive,
      }),
    [
      activeTransform,
      findText,
      inputText,
      isCaseSensitive,
      prefixText,
      replaceText,
      suffixText,
    ]
  );

  const activeTransformLabel =
    transformDefinitions.find((item) => item.key === activeTransform)?.label ?? "Live preview";

  const stats = useMemo(
    () => ({
      characters: outputText.length,
      words: getWordCount(outputText),
      lines: getLineCount(outputText),
      readingTime: Math.max(1, Math.ceil(getWordCount(outputText) / 200)),
    }),
    [outputText]
  );

  const diffSegments = useMemo(
    () => buildDiffSegments(inputText, outputText),
    [inputText, outputText]
  );

  const groupedTransforms = useMemo(() => {
    return transformDefinitions.reduce<Record<string, TransformDefinition[]>>((acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }

      acc[item.group].push(item);
      return acc;
    }, {});
  }, []);

  const availableTransforms = groupedTransforms[selectedGroup] ?? [];

  const handleCopy = async () => {
    if (!navigator?.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const handleReset = () => {
    setInputText("");
    setActiveTransform("none");
    setSelectedGroup("Case");
    setFindText("");
    setReplaceText("");
    setPrefixText("");
    setSuffixText("");
    setIsCaseSensitive(false);
    setCopied(false);
    setShowDiff(false);
  };

  const handleUseOutputAsInput = () => {
    setInputText(outputText);
    setCopied(false);
  };

  useEffect(() => {
    if (stackEditors && isDragging) {
      setIsDragging(false);
    }
  }, [isDragging, stackEditors]);

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handlePointerMove = (event: MouseEvent) => {
      if (!splitterContainerRef.current) {
        return;
      }

      const bounds = splitterContainerRef.current.getBoundingClientRect();
      const nextWidth = ((event.clientX - bounds.left) / bounds.width) * 100;
      const clampedWidth = Math.min(70, Math.max(30, nextWidth));

      setLeftPaneWidth(clampedWidth);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
    };
  }, [isDragging]);

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper
        sx={{
          p: { xs: 2.5, md: 2.5 },
          borderRadius: 0,
          border: "1px solid rgba(11, 31, 51, 0.08)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,248,248,0.96) 100%)",
          boxShadow: "0 20px 50px rgba(11, 31, 51, 0.07)",
        }}
      >
        <Stack spacing={{ xs: 2.25, md: 2 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.55rem", md: "1.8rem" } }}>
                Text Formatter
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Clean, transform, and prepare plain text with quick everyday
              formatting actions.
            </Typography>
          </Box>

          <Paper
            sx={{
              p: 1.75,
              borderRadius: 0,
              border: "1px solid rgba(11, 31, 51, 0.08)",
              boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
            }}
          >
            <Stack spacing={1.5}>
              <Stack
                divider={<Divider />}
                sx={{
                  border: "1px solid rgba(11, 31, 51, 0.08)",
                  backgroundColor: "rgba(245, 248, 248, 0.85)",
                }}
              >
                <SummaryRow label="Active transform" value={activeTransformLabel} />
                <SummaryRow label="Characters" value={String(stats.characters)} />
                <SummaryRow label="Words" value={String(stats.words)} />
                <SummaryRow label="Lines" value={String(stats.lines)} />
                <SummaryRow
                  label="Reading time"
                  value={`${stats.readingTime} min`}
                />
              </Stack>

              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Tool Group"
                    value={selectedGroup}
                    onChange={(event) => {
                      const nextGroup = event.target.value as TransformGroup;
                      const nextTransforms = groupedTransforms[nextGroup] ?? [];

                      setSelectedGroup(nextGroup);

                      if (
                        activeTransform !== "none" &&
                        !nextTransforms.some((item) => item.key === activeTransform)
                      ) {
                        setActiveTransform("none");
                      }
                    }}
                  >
                    {Object.keys(groupedTransforms).map((group) => (
                      <MenuItem key={group} value={group}>
                        {group}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 8 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Action"
                    value={activeTransform}
                    onChange={(event) =>
                      setActiveTransform(event.target.value as TransformKey)
                    }
                  >
                    <MenuItem value="none">Live preview only</MenuItem>
                    {availableTransforms.map((item) => (
                      <MenuItem key={item.key} value={item.key}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              {helperFieldsVisible && (
                <Grid container spacing={1}>
                  {activeTransform === "findReplace" && (
                    <>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Find"
                          value={findText}
                          onChange={(event) => setFindText(event.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Replace"
                          value={replaceText}
                          onChange={(event) => setReplaceText(event.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={isCaseSensitive}
                              onChange={(event) =>
                                setIsCaseSensitive(event.target.checked)
                              }
                            />
                          }
                          label="Case sensitive"
                        />
                      </Grid>
                    </>
                  )}

                  {activeTransform === "prefixLines" && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Prefix"
                        value={prefixText}
                        onChange={(event) => setPrefixText(event.target.value)}
                      />
                    </Grid>
                  )}

                  {activeTransform === "suffixLines" && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Suffix"
                        value={suffixText}
                        onChange={(event) => setSuffixText(event.target.value)}
                      />
                    </Grid>
                  )}
                </Grid>
              )}

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Button
                  variant={showDiff ? "contained" : "outlined"}
                  color={showDiff ? "primary" : "inherit"}
                  size="small"
                  onClick={() => setShowDiff((current) => !current)}
                  sx={{ borderRadius: 0, py: 0.55, fontSize: "0.75rem" }}
                >
                  {showDiff ? "Hide diff" : "View diff"}
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<AutorenewRoundedIcon />}
                  onClick={handleReset}
                  sx={{ borderRadius: 0, py: 0.55, fontSize: "0.75rem" }}
                >
                  Reset
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<PublishedWithChangesRoundedIcon />}
                  onClick={handleUseOutputAsInput}
                  sx={{ borderRadius: 0, py: 0.55, fontSize: "0.75rem" }}
                >
                  Use output as input
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<ContentCopyRoundedIcon />}
                  onClick={handleCopy}
                  sx={{ borderRadius: 0, py: 0.55, fontSize: "0.75rem" }}
                >
                  {copied ? "Copied" : "Copy output"}
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Box
            ref={splitterContainerRef}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: "stretch",
              userSelect: isDragging ? "none" : "auto",
            }}
          >
            <Box sx={{ flex: stackEditors ? "1 1 100%" : `0 0 ${leftPaneWidth}%`, minWidth: 0 }}>
              <Paper
                sx={{
                  p: 2.25,
                  borderRadius: 0,
                  border: "1px solid rgba(11, 31, 51, 0.08)",
                  boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
                }}
              >
                <Stack spacing={2}>
                  <TextField
                    multiline
                    minRows={stackEditors ? 10 : 16}
                    fullWidth
                    label="Original Text"
                    value={inputText}
                    onChange={(event) => setInputText(event.target.value)}
                  />
                </Stack>
              </Paper>
            </Box>

            {!stackEditors && (
              <Box
                role="separator"
                aria-orientation="vertical"
                onMouseDown={() => setIsDragging(true)}
                sx={{
                  width: 10,
                  mx: -0.5,
                  cursor: "col-resize",
                  position: "relative",
                  flex: "0 0 auto",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "50%",
                    width: "2px",
                    transform: "translateX(-50%)",
                    backgroundColor: isDragging
                      ? "secondary.main"
                      : "rgba(11, 31, 51, 0.12)",
                  },
                }}
              />
            )}

            <Box sx={{ flex: stackEditors ? "1 1 100%" : `1 1 ${100 - leftPaneWidth}%`, minWidth: 0 }}>
              <Paper
                sx={{
                  p: 2.25,
                  height: "100%",
                  borderRadius: 0,
                  border: "1px solid rgba(11, 31, 51, 0.08)",
                  boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
                }}
              >
                <Stack spacing={2}>
                  {showDiff ? (
                    <Paper
                      sx={{
                        p: 2,
                        minHeight: { xs: 260, sm: 320, md: 366 },
                        borderRadius: 0,
                        border: "1px solid rgba(11, 31, 51, 0.08)",
                        backgroundColor: "rgba(245, 248, 248, 0.75)",
                        overflow: "auto",
                      }}
                    >
                      <Stack spacing={1.25}>
                        <Typography
                          variant="overline"
                          sx={{ color: "secondary.main", fontWeight: 700 }}
                        >
                          Diff View
                        </Typography>
                        <Box
                          sx={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            fontFamily: '"Roboto Mono", "Menlo", monospace',
                            fontSize: "0.9rem",
                            lineHeight: 1.7,
                          }}
                        >
                          {diffSegments.length === 0 ? (
                            <Typography color="text.secondary">
                              No changes to highlight.
                            </Typography>
                          ) : (
                            diffSegments.map((segment, index) => (
                              <Box
                                key={`${segment.type}-${index}`}
                                component="span"
                                sx={
                                  segment.type === "added"
                                    ? {
                                        backgroundColor: "rgba(34, 197, 94, 0.16)",
                                        color: "#166534",
                                      }
                                    : segment.type === "removed"
                                      ? {
                                          backgroundColor: "rgba(239, 68, 68, 0.14)",
                                          color: "#991b1b",
                                          textDecoration: "line-through",
                                        }
                                      : undefined
                                }
                              >
                                {segment.value}
                              </Box>
                            ))
                          )}
                        </Box>
                      </Stack>
                    </Paper>
                  ) : (
                    <TextField
                      multiline
                      minRows={stackEditors ? 10 : 16}
                      fullWidth
                      label="Output"
                      value={outputText}
                      InputProps={{ readOnly: true }}
                    />
                  )}
                </Stack>
              </Paper>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      spacing={0.75}
      sx={{
        px: 1.5,
        py: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.8rem" }}
      >
        {label}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          lineHeight: 1.2,
          fontSize: "0.95rem",
          wordBreak: "break-word",
          textAlign: { xs: "left", sm: "right" },
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

export default TextFormatter;
