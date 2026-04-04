import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import UnfoldLessRoundedIcon from "@mui/icons-material/UnfoldLessRounded";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type ContextMenuState = {
  mouseX: number;
  mouseY: number;
  keyText: string | null;
  valueText: string;
} | null;

const SAMPLE_JSON = `{
  "user": {
    "id": 42,
    "name": "Aarav Shah",
    "active": true,
    "roles": ["admin", "editor"],
    "profile": {
      "email": "aarav@example.com",
      "location": {
        "city": "Mumbai",
        "country": "India"
      }
    }
  },
  "meta": {
    "source": "ToolFerry",
    "version": 1
  }
}`;

function isExpandable(value: JsonValue): value is JsonValue[] | Record<string, JsonValue> {
  return typeof value === "object" && value !== null;
}

function getValueSummary(value: JsonValue) {
  if (Array.isArray(value)) {
    return value.length === 0 ? "[]" : "[..]";
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "object") {
    return Object.keys(value).length === 0 ? "{}" : "{..}";
  }

  if (typeof value === "string") {
    return `"${value}"`;
  }

  return String(value);
}

function collectExpandablePaths(value: JsonValue, path = "root"): string[] {
  if (!isExpandable(value)) {
    return [];
  }

  const current = [path];
  const children = Array.isArray(value)
    ? value.flatMap((item, index) => collectExpandablePaths(item, `${path}.${index}`))
    : Object.entries(value).flatMap(([key, child]) =>
        collectExpandablePaths(child, `${path}.${key}`)
      );

  return [...current, ...children];
}

function serializeJsonValue(value: JsonValue) {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "number" || typeof value === "boolean" || value === null) {
    return String(value);
  }

  return JSON.stringify(value, null, 2);
}

function formatKeyLabel(key: string) {
  if (key === "root") {
    return "Root";
  }

  if (/^\d+$/.test(key)) {
    return key;
  }

  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getNodeSearchText(nodeKey: string | undefined, value: JsonValue) {
  const keyText = nodeKey ?? "";
  const ownValueText = isExpandable(value) ? getValueSummary(value) : serializeJsonValue(value);

  return `${keyText} ${ownValueText}`.toLowerCase();
}

function collectSearchMatches(
  value: JsonValue,
  query: string,
  path = "root",
  nodeKey?: string
): string[] {
  const matches: string[] = [];
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return matches;
  }

  if (getNodeSearchText(nodeKey, value).includes(normalizedQuery)) {
    matches.push(path);
  }

  if (!isExpandable(value)) {
    return matches;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      matches.push(
        ...collectSearchMatches(item, normalizedQuery, `${path}.${index}`, String(index))
      );
    });
  } else {
    Object.entries(value).forEach(([key, child]) => {
      matches.push(...collectSearchMatches(child, normalizedQuery, `${path}.${key}`, key));
    });
  }

  return matches;
}

function getAncestorPaths(path: string) {
  const segments = path.split(".");
  const ancestors: string[] = [];

  for (let index = 1; index < segments.length; index += 1) {
    ancestors.push(segments.slice(0, index).join("."));
  }

  return ancestors;
}

function renderHighlightedText(text: string, query: string, highlightSx = {}) {
  if (!query.trim()) {
    return text;
  }

  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  const parts: Array<{ text: string; match: boolean }> = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const matchIndex = normalizedText.indexOf(normalizedQuery, startIndex);

    if (matchIndex === -1) {
      parts.push({ text: text.slice(startIndex), match: false });
      break;
    }

    if (matchIndex > startIndex) {
      parts.push({ text: text.slice(startIndex, matchIndex), match: false });
    }

    parts.push({
      text: text.slice(matchIndex, matchIndex + query.length),
      match: true,
    });

    startIndex = matchIndex + query.length;
  }

  return parts.map((part, index) => (
    <Box
      key={`${part.text}-${index}`}
      component="span"
      sx={
        part.match
          ? {
              backgroundColor: "rgba(250, 204, 21, 0.35)",
              borderRadius: "2px",
              ...highlightSx,
            }
          : undefined
      }
    >
      {part.text}
    </Box>
  ));
}

type JsonTreeNodeProps = {
  activeMatchPath: string | null;
  expandedPaths: Set<string>;
  matchedPaths: Set<string>;
  onContextMenu: (
    event: React.MouseEvent,
    payload: { keyText: string | null; valueText: string }
  ) => void;
  onToggle: (path: string) => void;
  path: string;
  depth?: number;
  nodeKey?: string;
  searchQuery: string;
  value: JsonValue;
};

function JsonTreeNode({
  activeMatchPath,
  expandedPaths,
  matchedPaths,
  onContextMenu,
  onToggle,
  path,
  depth = 0,
  nodeKey,
  searchQuery,
  value,
}: JsonTreeNodeProps) {
  const expandable = isExpandable(value);
  const isExpanded = expandedPaths.has(path);
  const isMatched = matchedPaths.has(path);
  const isActiveMatch = activeMatchPath === path;

  return (
    <Box sx={{ pl: depth === 0 ? 0 : 1.25 }} data-json-path={path}>
      <Button
        color="inherit"
        onClick={() => expandable && onToggle(path)}
        onContextMenu={(event) =>
          onContextMenu(event, {
            keyText: nodeKey ?? null,
            valueText: serializeJsonValue(value),
          })
        }
        sx={{
          px: 0,
          py: 0.15,
          borderRadius: "6px",
          justifyContent: "flex-start",
          minWidth: 0,
          textTransform: "none",
          alignItems: "flex-start",
          width: "100%",
          cursor: expandable ? "pointer" : "default",
          backgroundColor: isActiveMatch
            ? "rgba(15, 139, 141, 0.14)"
            : isMatched
              ? "rgba(250, 204, 21, 0.14)"
              : "transparent",
          "&:hover": {
            backgroundColor: expandable
              ? "rgba(11, 31, 51, 0.045)"
              : "rgba(11, 31, 51, 0.025)",
          },
        }}
      >
        <Box
          sx={{
            width: 16,
            minWidth: 16,
            height: 16,
            mt: "1px",
            mr: 0.75,
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {expandable ? (
            <Box
              component="span"
              sx={{
                width: 14,
                height: 14,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(15, 139, 141, 0.3)",
                color: "secondary.main",
                backgroundColor: "rgba(15, 139, 141, 0.06)",
                fontSize: "0.72rem",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {isExpanded ? "-" : "+"}
            </Box>
          ) : (
            <Box
              component="span"
              sx={{
                width: 14,
                height: 14,
              }}
            />
          )}
        </Box>

        <Typography
          component="span"
          sx={{
            fontFamily: '"Roboto Mono", "Menlo", monospace',
            fontSize: "0.82rem",
            lineHeight: 1.5,
            textAlign: "left",
            color: "#0b1f33",
            wordBreak: "break-word",
          }}
        >
          {nodeKey !== undefined &&
            renderHighlightedText(formatKeyLabel(nodeKey), searchQuery, {
              color: "#0f6f74",
              fontWeight: 700,
            })}
          {nodeKey !== undefined && <Box component="span">: </Box>}
          {expandable ? (
            <Box
              component="span"
              sx={{
                color: "#475569",
                backgroundColor: "rgba(148, 163, 184, 0.14)",
                px: 0.75,
                py: 0.15,
                borderRadius: "999px",
                fontSize: "0.76rem",
              }}
            >
              {renderHighlightedText(getValueSummary(value), searchQuery)}
            </Box>
          ) : (
            <PrimitiveValue value={value} searchQuery={searchQuery} />
          )}
        </Typography>
      </Button>

      {expandable && isExpanded && (
        <Stack spacing={0}>
          {Array.isArray(value)
            ? value.map((item, index) => (
                <JsonTreeNode
                  activeMatchPath={activeMatchPath}
                  key={`${path}.${index}`}
                  expandedPaths={expandedPaths}
                  matchedPaths={matchedPaths}
                  onContextMenu={onContextMenu}
                  onToggle={onToggle}
                  path={`${path}.${index}`}
                  depth={depth + 1}
                  nodeKey={String(index)}
                  searchQuery={searchQuery}
                  value={item}
                />
              ))
            : Object.entries(value).map(([key, child]) => (
                <JsonTreeNode
                  activeMatchPath={activeMatchPath}
                  key={`${path}.${key}`}
                  expandedPaths={expandedPaths}
                  matchedPaths={matchedPaths}
                  onContextMenu={onContextMenu}
                  onToggle={onToggle}
                  path={`${path}.${key}`}
                  depth={depth + 1}
                  nodeKey={key}
                  searchQuery={searchQuery}
                  value={child}
                />
              ))}
        </Stack>
      )}
    </Box>
  );
}

function PrimitiveValue({
  value,
  searchQuery,
}: {
  value: Exclude<JsonValue, JsonValue[] | Record<string, JsonValue>>;
  searchQuery: string;
}) {
  if (typeof value === "string") {
    return (
      <Box
        component="span"
        sx={{
          color: "#166534",
          backgroundColor: "rgba(34, 197, 94, 0.08)",
          px: 0.5,
          py: 0.1,
          borderRadius: "4px",
        }}
      >
        {renderHighlightedText(`"${value}"`, searchQuery)}
      </Box>
    );
  }

  if (typeof value === "number") {
    return (
      <Box
        component="span"
        sx={{
          color: "#7c3aed",
          fontWeight: 700,
        }}
      >
        {renderHighlightedText(String(value), searchQuery)}
      </Box>
    );
  }

  if (typeof value === "boolean") {
    return (
      <Box
        component="span"
        sx={{
          color: "#b45309",
          fontWeight: 700,
        }}
      >
        {renderHighlightedText(String(value), searchQuery)}
      </Box>
    );
  }

  return (
    <Box
      component="span"
      sx={{
        color: "#dc2626",
        fontWeight: 700,
      }}
    >
      {renderHighlightedText("null", searchQuery)}
    </Box>
  );
}

function JsonViewer() {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);

  const parsed = useMemo(() => {
    try {
      return {
        value: JSON.parse(jsonInput) as JsonValue,
        error: "",
      };
    } catch (error) {
      return {
        value: null,
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  }, [jsonInput]);

  const expandablePaths = useMemo(
    () => (parsed.value ? collectExpandablePaths(parsed.value) : []),
    [parsed.value]
  );

  const searchMatches = useMemo(
    () => (parsed.value && searchQuery.trim() ? collectSearchMatches(parsed.value, searchQuery) : []),
    [parsed.value, searchQuery]
  );

  const activeMatchPath = searchMatches[activeMatchIndex] ?? null;
  const matchedPaths = useMemo(() => new Set(searchMatches), [searchMatches]);

  useEffect(() => {
    if (!searchMatches.length) {
      setActiveMatchIndex(0);
      return;
    }

    setActiveMatchIndex((current) => Math.min(current, searchMatches.length - 1));
  }, [searchMatches]);

  useEffect(() => {
    if (!searchQuery.trim() || !searchMatches.length) {
      return;
    }

    setExpandedPaths((current) => {
      const next = new Set(current);

      searchMatches.forEach((path) => {
        getAncestorPaths(path).forEach((ancestor) => next.add(ancestor));
      });

      return next;
    });
  }, [searchMatches, searchQuery]);

  useEffect(() => {
    if (!activeMatchPath) {
      return;
    }

    const escapedPath = CSS.escape(activeMatchPath);
    const target = document.querySelector(`[data-json-path="${escapedPath}"]`);

    if (target instanceof HTMLElement) {
      target.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [activeMatchPath]);

  const handleToggle = (path: string) => {
    setExpandedPaths((current) => {
      const next = new Set(current);

      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }

      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedPaths(new Set(expandablePaths));
  };

  const handleCollapseAll = () => {
    setExpandedPaths(new Set());
  };

  const handleFormatInput = () => {
    if (parsed.value) {
      setJsonInput(JSON.stringify(parsed.value, null, 2));
    }
  };

  const handleReset = () => {
    setJsonInput(SAMPLE_JSON);
    setExpandedPaths(new Set());
    setContextMenu(null);
    setSearchQuery("");
    setActiveMatchIndex(0);
  };

  const handleNodeContextMenu = (
    event: React.MouseEvent,
    payload: { keyText: string | null; valueText: string }
  ) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
      keyText: payload.keyText,
      valueText: payload.valueText,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleCopy = async (value: string) => {
    if (!navigator?.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(value);
    handleCloseContextMenu();
  };

  const handleNextMatch = () => {
    if (!searchMatches.length) {
      return;
    }

    setActiveMatchIndex((current) => (current + 1) % searchMatches.length);
  };

  const handlePreviousMatch = () => {
    if (!searchMatches.length) {
      return;
    }

    setActiveMatchIndex(
      (current) => (current - 1 + searchMatches.length) % searchMatches.length
    );
  };

  return (
    <Stack spacing={2.5}>
      <Paper
        sx={{
          p: { xs: 2, md: 2.25 },
          borderRadius: 0,
          border: "1px solid rgba(11, 31, 51, 0.08)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,248,248,0.96) 100%)",
          boxShadow: "0 20px 50px rgba(11, 31, 51, 0.07)",
        }}
      >
        <Stack spacing={1.75}>
          <Box sx={{ maxWidth: 760 }}>
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: "1.4rem", md: "1.8rem" }, mb: 0.5 }}
            >
              JSON Viewer
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7, fontSize: "0.95rem" }}>
              Paste raw JSON and explore it in a clean collapsible tree with
              expandable objects and arrays.
            </Typography>
          </Box>

          <Paper
            sx={{
              p: 1.25,
              borderRadius: 0,
              border: "1px solid rgba(11, 31, 51, 0.08)",
              boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
            }}
          >
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <TextField
                size="small"
                label="Search JSON"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                sx={{ minWidth: { xs: "100%", sm: 220 } }}
              />
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={handlePreviousMatch}
                sx={{ borderRadius: 0, py: 0.4, fontSize: "0.72rem" }}
                disabled={!searchMatches.length}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={handleNextMatch}
                sx={{ borderRadius: 0, py: 0.4, fontSize: "0.72rem" }}
                disabled={!searchMatches.length}
              >
                Next
              </Button>
              {searchQuery.trim() && (
                <Typography
                  sx={{
                    alignSelf: "center",
                    color: "text.secondary",
                    fontSize: "0.78rem",
                    px: 0.5,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  {searchMatches.length
                    ? `${activeMatchIndex + 1} of ${searchMatches.length}`
                    : "No matches"}
                </Typography>
              )}
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<UnfoldMoreRoundedIcon />}
                onClick={handleExpandAll}
                sx={{ borderRadius: 0, py: 0.4, fontSize: "0.72rem" }}
                disabled={!parsed.value}
              >
                Expand all
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<UnfoldLessRoundedIcon />}
                onClick={handleCollapseAll}
                sx={{ borderRadius: 0, py: 0.4, fontSize: "0.72rem" }}
                disabled={!parsed.value}
              >
                Collapse all
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={handleFormatInput}
                sx={{ borderRadius: 0, py: 0.4, fontSize: "0.72rem" }}
                disabled={!parsed.value}
              >
                Format JSON
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<AutorenewRoundedIcon />}
                onClick={handleReset}
                sx={{ borderRadius: 0, py: 0.4, fontSize: "0.72rem" }}
              >
                Reset
              </Button>
            </Stack>
          </Paper>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(320px, 40%) 1fr" },
              gap: 2,
              alignItems: "stretch",
            }}
          >
            <Paper
              sx={{
                p: 1.75,
                borderRadius: 0,
                border: "1px solid rgba(11, 31, 51, 0.08)",
                boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
              }}
            >
              <Stack spacing={1}>
                <TextField
                  multiline
                  minRows={12}
                  fullWidth
                  label="Raw JSON"
                  value={jsonInput}
                  onChange={(event) => setJsonInput(event.target.value)}
                />
                {parsed.error && (
                  <Typography color="error.main" sx={{ fontSize: "0.85rem" }}>
                    {parsed.error}
                  </Typography>
                )}
              </Stack>
            </Paper>

            <Paper
              sx={{
                p: 1.75,
                borderRadius: 0,
                border: "1px solid rgba(11, 31, 51, 0.08)",
                boxShadow: "0 14px 30px rgba(11, 31, 51, 0.045)",
                minWidth: 0,
              }}
            >
              <Stack spacing={1}>
                <Typography
                  variant="overline"
                  sx={{ color: "secondary.main", fontWeight: 700, lineHeight: 1 }}
                >
                  Parsed Tree
                </Typography>

                <Paper
                  sx={{
                    p: 1.25,
                    borderRadius: 0,
                    border: "1px solid rgba(11, 31, 51, 0.08)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,248,248,0.92) 100%)",
                    minHeight: { xs: 300, sm: 340, md: 360 },
                    overflow: "auto",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
                  }}
                >
                  {parsed.value ? (
                    <JsonTreeNode
                      activeMatchPath={activeMatchPath}
                      expandedPaths={expandedPaths}
                      matchedPaths={matchedPaths}
                      onContextMenu={handleNodeContextMenu}
                      onToggle={handleToggle}
                      path="root"
                      nodeKey="root"
                      searchQuery={searchQuery}
                      value={parsed.value}
                    />
                  ) : (
                    <Typography color="text.secondary">
                      Enter valid JSON to view the tree.
                    </Typography>
                  )}
                </Paper>
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </Paper>

      <Menu
        open={Boolean(contextMenu)}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {contextMenu?.keyText && (
          <MenuItem onClick={() => handleCopy(contextMenu.keyText ?? "")}>
            Copy key
          </MenuItem>
        )}
        <MenuItem onClick={() => handleCopy(contextMenu?.valueText ?? "")}>
          Copy value
        </MenuItem>
        {contextMenu?.keyText && (
          <MenuItem
            onClick={() =>
              handleCopy(`${JSON.stringify(contextMenu.keyText)}: ${contextMenu.valueText}`)
            }
          >
            Copy key-value
          </MenuItem>
        )}
      </Menu>
    </Stack>
  );
}

export default JsonViewer;
