export const relatedTools: Record<string, string[]> = {
  'goal-calculator': [
    'mutual-fund-returns-calculator',
    'fd-interest-calculator',
    'emi-calculator',
  ],
  'emi-calculator': [
    'goal-calculator',
    'fd-interest-calculator',
    'mutual-fund-returns-calculator',
  ],
  'fd-interest-calculator': [
    'ppf-calculator',
    'mutual-fund-returns-calculator',
    'cagr-calculator',
  ],
  'ppf-calculator': [
    'fd-interest-calculator',
    'mutual-fund-returns-calculator',
    'cagr-calculator',
  ],
  'mutual-fund-returns-calculator': [
    'ppf-calculator',
    'fd-interest-calculator',
    'cagr-calculator',
  ],
  'cagr-calculator': [
    'xirr-calculator',
    'mutual-fund-returns-calculator',
    'step-up-sip-calculator',
  ],
  'swp-calculator': [
    'step-up-sip-calculator',
    'mutual-fund-returns-calculator',
    'goal-calculator',
  ],
  'step-up-sip-calculator': [
    'mutual-fund-returns-calculator',
    'swp-calculator',
    'xirr-calculator',
  ],
  'xirr-calculator': [
    'cagr-calculator',
    'mutual-fund-returns-calculator',
    'step-up-sip-calculator',
  ],
  'emergency-fund-runway-calculator': [
    'goal-calculator',
    'emi-calculator',
    'debt-payoff-planner',
  ],
  'debt-payoff-planner': [
    'emi-calculator',
    'emergency-fund-runway-calculator',
    'goal-calculator',
  ],
  'gst-calculator': [
    'invoice-generator',
    'percentage-calculator',
    'discount-calculator',
  ],
  'invoice-generator': [
    'gst-calculator',
    'percentage-calculator',
    'discount-calculator',
  ],
  'percentage-calculator': [
    'discount-calculator',
    'gst-calculator',
    'unit-converter',
  ],
  'discount-calculator': [
    'percentage-calculator',
    'gst-calculator',
    'unit-converter',
  ],
  'subscription-cost-calculator': [
    'discount-calculator',
    'can-i-afford-this-calculator',
    'addiction-price-calculator',
  ],
  'can-i-afford-this-calculator': [
    'subscription-cost-calculator',
    'discount-calculator',
    'goal-calculator',
  ],
  'addiction-price-calculator': [
    'subscription-cost-calculator',
    'can-i-afford-this-calculator',
    'percentage-calculator',
  ],
  'decision-maker-spin-the-wheel': [
    'text-formatter',
    'number-to-words-converter',
    'weekend-left-calculator',
  ],
  'coin-toss-heads-or-tails': [
    'decision-maker-spin-the-wheel',
    'weekend-left-calculator',
    'text-formatter',
  ],
  'unit-converter': [
    'currency-converter',
    'time-zone-converter',
    'color-converter',
  ],
  'currency-converter': [
    'unit-converter',
    'time-zone-converter',
    'number-to-words-converter',
  ],
  'time-zone-converter': [
    'currency-converter',
    'timestamp-converter',
    'unit-converter',
  ],
  'color-converter': ['base-number-converter', 'json-viewer', 'unit-converter'],
  'number-to-words-converter': [
    'currency-converter',
    'percentage-calculator',
    'discount-calculator',
  ],
  'text-formatter': [
    'json-viewer',
    'csv-to-json-converter',
    'json-to-csv-converter',
  ],
  'password-generator': [
    'qr-code-generator',
    'text-formatter',
    'base64-encode-decode',
  ],
  'qr-code-generator': [
    'text-formatter',
    'color-converter',
    'number-to-words-converter',
  ],
  'image-resizer-compressor': [
    'qr-code-generator',
    'color-converter',
    'text-formatter',
  ],
  'base64-encode-decode': [
    'text-formatter',
    'json-viewer',
    'base-number-converter',
  ],
  'url-encoder-decoder': [
    'base64-encode-decode',
    'json-viewer',
    'timestamp-converter',
  ],
  'uuid-generator-validator': [
    'jwt-decoder',
    'base64-encode-decode',
    'json-viewer',
  ],
  'jwt-decoder': [
    'uuid-generator-validator',
    'base64-encode-decode',
    'json-viewer',
  ],
  'json-viewer': [
    'csv-to-json-converter',
    'json-to-csv-converter',
    'base-number-converter',
  ],
  'csv-to-json-converter': [
    'json-to-csv-converter',
    'json-viewer',
    'text-formatter',
  ],
  'json-to-csv-converter': [
    'csv-to-json-converter',
    'json-viewer',
    'text-formatter',
  ],
  'base-number-converter': [
    'timestamp-converter',
    'color-converter',
    'json-viewer',
  ],
  'timestamp-converter': [
    'base-number-converter',
    'time-zone-converter',
    'json-viewer',
  ],
  'age-calculator': [
    'date-difference-calculator',
    'pregnancy-due-date-calculator',
    'goal-calculator',
  ],
  'date-difference-calculator': [
    'age-calculator',
    'pregnancy-due-date-calculator',
    'goal-calculator',
  ],
  'business-days-calculator': [
    'date-difference-calculator',
    'weekend-left-calculator',
    'age-calculator',
  ],
  'weekend-left-calculator': [
    'date-difference-calculator',
    'age-calculator',
    'goal-calculator',
  ],
  'bmi-calculator': [
    'pregnancy-due-date-calculator',
    'age-calculator',
    'date-difference-calculator',
  ],
  'screen-time-impact-calculator': [
    'sitting-time-risk-calculator',
    'biological-age-calculator',
    'bmi-calculator',
  ],
  'sitting-time-risk-calculator': [
    'screen-time-impact-calculator',
    'heart-rate-zone-calculator',
    'bmi-calculator',
  ],
  'heart-rate-zone-calculator': [
    'sitting-time-risk-calculator',
    'bmi-calculator',
    'biological-age-calculator',
  ],
  'biological-age-calculator': [
    'bmi-calculator',
    'age-calculator',
    'pregnancy-due-date-calculator',
  ],
  'pregnancy-due-date-calculator': [
    'bmi-calculator',
    'date-difference-calculator',
    'age-calculator',
  ],
}
