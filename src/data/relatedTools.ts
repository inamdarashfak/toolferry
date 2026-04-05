export const relatedTools: Record<string, string[]> = {
  "goal-calculator": [
    "mutual-fund-returns-calculator",
    "fd-interest-calculator",
    "emi-calculator",
  ],
  "emi-calculator": [
    "goal-calculator",
    "fd-interest-calculator",
    "mutual-fund-returns-calculator",
  ],
  "fd-interest-calculator": [
    "goal-calculator",
    "mutual-fund-returns-calculator",
    "emi-calculator",
  ],
  "mutual-fund-returns-calculator": [
    "goal-calculator",
    "fd-interest-calculator",
    "emi-calculator",
  ],
  "gst-calculator": ["text-formatter", "unit-converter", "json-viewer"],
  "unit-converter": ["gst-calculator", "age-calculator", "text-formatter"],
  "text-formatter": ["json-viewer", "unit-converter", "gst-calculator"],
  "json-viewer": ["text-formatter", "unit-converter", "gst-calculator"],
  "age-calculator": ["pregnancy-due-date-calculator", "unit-converter", "goal-calculator"],
  "pregnancy-due-date-calculator": ["age-calculator", "goal-calculator", "unit-converter"],
};
