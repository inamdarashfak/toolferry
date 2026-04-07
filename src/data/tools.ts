import type { Tool } from '../types/tool'

export const tools: Tool[] = [
  {
    name: 'Goal Calculator',
    description:
      'Turn a future purchase or milestone into an action-ready savings plan with gaps and catch-up paths.',
    metaDescription:
      'Use the Goal Calculator to plan a future purchase or milestone with savings projections, funding gaps, and catch-up options.',
    slug: 'goal-calculator',
    categorySlug: 'finance',
    homeRank: 1,
  },
  {
    name: 'EMI Calculator',
    description:
      'Plan loans with live EMI estimates, payment breakdowns, and interactive charts.',
    metaDescription:
      'Use the EMI Calculator to estimate monthly EMI, interest cost, and total payment for home, car, or personal loans.',
    slug: 'emi-calculator',
    categorySlug: 'finance',
    isFeatured: true,
    homeRank: 1,
  },
  {
    name: 'FD Interest Calculator',
    description:
      'Check fixed deposit returns with a focused and beginner-friendly layout.',
    metaDescription:
      'Use the FD Interest Calculator to estimate maturity value, interest earned, and fixed deposit growth over time.',
    slug: 'fd-interest-calculator',
    categorySlug: 'finance',
    isFeatured: true,
    homeRank: 1,
  },
  {
    name: 'PPF Calculator',
    description:
      'Estimate Public Provident Fund growth with yearly contributions, maturity value, and interest earned.',
    metaDescription:
      'Use the PPF Calculator to estimate yearly contribution growth, total interest earned, and maturity value over time.',
    slug: 'ppf-calculator',
    categorySlug: 'finance',
    homeRank: 2,
  },
  {
    name: 'Mutual Fund Returns Calculator',
    description:
      'Estimate one-time or SIP-based mutual fund growth with instant return summaries.',
    metaDescription:
      'Use the Mutual Fund Returns Calculator to estimate SIP or lump-sum growth, returns, and total portfolio value.',
    slug: 'mutual-fund-returns-calculator',
    categorySlug: 'finance',
    homeRank: 3,
  },
  {
    name: 'CAGR Calculator',
    description:
      'Measure annualized growth between a starting value and ending value over any chosen period.',
    metaDescription:
      'Use the CAGR Calculator to find compounded annual growth rate between an initial value and a final value.',
    slug: 'cagr-calculator',
    categorySlug: 'finance',
    homeRank: 4,
  },
  {
    name: 'GST Calculator',
    description:
      'Calculate GST amounts quickly with clear input and output sections.',
    metaDescription:
      'Use the GST Calculator to calculate inclusive or exclusive GST, tax amount, and final total instantly.',
    slug: 'gst-calculator',
    categorySlug: 'finance',
    isFeatured: true,
    homeRank: 1,
  },
  {
    name: 'Percentage Calculator',
    description:
      'Handle common percentage calculations like percent-of, reverse percent, and percentage change.',
    metaDescription:
      'Use the Percentage Calculator to find percentages, reverse percentages, and calculate percentage increase or decrease.',
    slug: 'percentage-calculator',
    categorySlug: 'finance',
    homeRank: 2,
  },
  {
    name: 'Discount Calculator',
    description:
      'Work out discount savings, reduced subtotal, and final price after optional tax.',
    metaDescription:
      'Use the Discount Calculator to calculate discount amount, sale price, savings, and final total after tax.',
    slug: 'discount-calculator',
    categorySlug: 'finance',
    homeRank: 3,
  },
  {
    name: 'Unit Converter',
    description:
      'Convert common units across everyday categories from one lightweight page.',
    metaDescription:
      'Use the Unit Converter to convert values across length, speed, storage, temperature, area, and more.',
    slug: 'unit-converter',
    categorySlug: 'conversion-tools',
    isFeatured: true,
    homeRank: 1,
  },
  {
    name: 'Currency Converter',
    description:
      'Convert between major currencies and compare the reference exchange rate instantly.',
    metaDescription:
      'Use the Currency Converter to convert between major currencies and check the reference exchange rate.',
    slug: 'currency-converter',
    categorySlug: 'conversion-tools',
    homeRank: 2,
  },
  {
    name: 'Time Zone Converter',
    description:
      'Convert a date and time between time zones and compare UTC offsets quickly.',
    metaDescription:
      'Use the Time Zone Converter to search global time zones and compare converted times with UTC offsets.',
    slug: 'time-zone-converter',
    categorySlug: 'conversion-tools',
    homeRank: 3,
  },
  {
    name: 'Color Converter',
    description:
      'Convert colors between HEX, RGB, and HSL with a live preview.',
    metaDescription:
      'Use the Color Converter to convert HEX, RGB, and HSL values with an instant color preview.',
    slug: 'color-converter',
    categorySlug: 'conversion-tools',
    homeRank: 4,
  },
  {
    name: 'Number to Words Converter',
    description:
      'Convert numeric values into English words for quick written references.',
    metaDescription:
      'Use the Number to Words Converter to turn numbers into English words for checks, forms, and documents.',
    slug: 'number-to-words-converter',
    categorySlug: 'conversion-tools',
    homeRank: 5,
  },
  {
    name: 'Text Formatter',
    description:
      'Format, clean, and transform text with simple utility-based actions.',
    metaDescription:
      'Use the Text Formatter to clean, transform, sort, replace, and convert text with simple utility tools.',
    slug: 'text-formatter',
    categorySlug: 'utilities',
    isFeatured: true,
    homeRank: 1,
  },
  {
    name: 'JSON Viewer',
    description:
      'Paste raw JSON and inspect nested objects and arrays in a collapsible tree view.',
    metaDescription:
      'Use the JSON Viewer to inspect raw JSON in a searchable, collapsible tree and copy keys or values more easily.',
    slug: 'json-viewer',
    categorySlug: 'developer-tools',
    homeRank: 1,
  },
  {
    name: 'CSV to JSON Converter',
    description:
      'Convert CSV with a header row into formatted JSON for easier reuse.',
    metaDescription:
      'Use the CSV to JSON Converter to turn CSV data with headers into formatted JSON output.',
    slug: 'csv-to-json-converter',
    categorySlug: 'developer-tools',
    homeRank: 2,
  },
  {
    name: 'JSON to CSV Converter',
    description:
      'Convert JSON arrays of flat objects into CSV with generated headers.',
    metaDescription:
      'Use the JSON to CSV Converter to convert flat JSON arrays into CSV output with header columns.',
    slug: 'json-to-csv-converter',
    categorySlug: 'developer-tools',
    homeRank: 3,
  },
  {
    name: 'Binary / Decimal / Hex Converter',
    description:
      'Convert whole numbers between binary, decimal, and hexadecimal formats.',
    metaDescription:
      'Use the Binary / Decimal / Hex Converter to switch whole numbers between base 2, base 10, and base 16.',
    slug: 'base-number-converter',
    categorySlug: 'developer-tools',
    homeRank: 4,
  },
  {
    name: 'Timestamp Converter',
    description:
      'Convert Unix timestamps into readable dates and convert dates back into timestamps.',
    metaDescription:
      'Use the Timestamp Converter to convert Unix timestamps to dates and dates back to seconds or milliseconds.',
    slug: 'timestamp-converter',
    categorySlug: 'developer-tools',
    homeRank: 5,
  },
  {
    name: 'Age Calculator',
    description: 'Find exact age in years, months, and days between two dates.',
    metaDescription:
      'Use the Age Calculator to find exact age and duration in years, months, and days between two dates.',
    slug: 'age-calculator',
    categorySlug: 'date-tools',
    homeRank: 1,
  },
  {
    name: 'Date Difference Calculator',
    description:
      'Measure total days and exact calendar difference between any two dates.',
    metaDescription:
      'Use the Date Difference Calculator to find the exact years, months, days, and total days between two dates.',
    slug: 'date-difference-calculator',
    categorySlug: 'date-tools',
    homeRank: 2,
  },
  {
    name: 'Pregnancy Due Date Calculator',
    description:
      'Estimate due date, conception date, and pregnancy progress from LMP.',
    metaDescription:
      'Use the Pregnancy Due Date Calculator to estimate due date, conception date, pregnancy progress, and days remaining.',
    slug: 'pregnancy-due-date-calculator',
    categorySlug: 'health-tools',
    homeRank: 1,
  },
  {
    name: 'BMI Calculator',
    description:
      'Calculate body mass index from height and weight with a quick category result.',
    metaDescription:
      'Use the BMI Calculator to find body mass index from height and weight and check the standard BMI category.',
    slug: 'bmi-calculator',
    categorySlug: 'health-tools',
    homeRank: 2,
  },
  {
    name: 'Biological Age Calculator',
    description:
      'Estimate a lifestyle-based biological age from your actual age, body metrics, and everyday habits.',
    metaDescription:
      'Use the Biological Age Calculator to estimate a wellness-based biological age from age, BMI-related body metrics, sleep, exercise, smoking, and stress.',
    slug: 'biological-age-calculator',
    categorySlug: 'health-tools',
    homeRank: 3,
  },
]
