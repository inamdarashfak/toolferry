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
    name: 'SWP Calculator',
    description:
      'Project fixed withdrawals from an investment corpus and see how long the balance can last.',
    metaDescription:
      'Use the SWP Calculator to estimate monthly withdrawals, ending balance, and how long your corpus may support a withdrawal plan.',
    slug: 'swp-calculator',
    categorySlug: 'finance',
    homeRank: 5,
  },
  {
    name: 'Step-Up SIP Calculator',
    description:
      'Estimate how increasing SIP contributions every year can change your long-term corpus.',
    metaDescription:
      'Use the Step-Up SIP Calculator to project growing SIP contributions, invested amount, returns, and final portfolio value.',
    slug: 'step-up-sip-calculator',
    categorySlug: 'finance',
    isFeatured: true,
    homeRank: 6,
  },
  {
    name: 'XIRR Calculator',
    description:
      'Calculate annualized returns for investments with irregular cash flows and dates.',
    metaDescription:
      'Use the XIRR Calculator to calculate annualized return from irregular dated cash flows such as SIPs, top-ups, and redemptions.',
    slug: 'xirr-calculator',
    categorySlug: 'finance',
    homeRank: 7,
  },
  {
    name: 'Emergency Fund Runway Calculator',
    description:
      'See how many months your savings can cover and how long it may take to reach your target cushion.',
    metaDescription:
      'Use the Emergency Fund Runway Calculator to measure current savings runway, target emergency fund size, and the gap still left to fund.',
    slug: 'emergency-fund-runway-calculator',
    categorySlug: 'finance',
    homeRank: 8,
  },
  {
    name: 'Debt Payoff Planner',
    description:
      'Compare avalanche and snowball debt strategies with balances, rates, and payment inputs.',
    metaDescription:
      'Use the Debt Payoff Planner to compare avalanche and snowball repayment strategies, payoff time, and total interest cost.',
    slug: 'debt-payoff-planner',
    categorySlug: 'finance',
    isFeatured: true,
    homeRank: 9,
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
    name: 'Invoice Generator',
    description:
      'Create a GST-friendly invoice with line items, taxes, totals, and a live printable preview.',
    metaDescription:
      'Use the Invoice Generator to create GST-friendly invoices with business details, client details, line items, tax totals, and PDF-ready print output.',
    slug: 'invoice-generator',
    categorySlug: 'finance',
    isFeatured: true,
    homeRank: 2,
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
    name: 'Subscription Cost Calculator',
    description:
      'Turn recurring subscription prices into daily, monthly, yearly, and long-term totals.',
    metaDescription:
      'Use the Subscription Cost Calculator to compare recurring plan prices across daily, monthly, yearly, and 5-year cost views.',
    slug: 'subscription-cost-calculator',
    categorySlug: 'finance',
    homeRank: 10,
  },
  {
    name: 'Can I Afford This? Calculator',
    description:
      'Check whether a purchase fits your monthly budget after essentials and savings.',
    metaDescription:
      'Use the Can I Afford This? Calculator to compare income, expenses, savings goals, and item price in one simple monthly budget check.',
    slug: 'can-i-afford-this-calculator',
    categorySlug: 'finance',
    homeRank: 11,
  },
  {
    name: 'Addiction Price Calculator',
    description:
      'Estimate how much a repeated habit costs per day, month, year, and beyond.',
    metaDescription:
      'Use the Addiction Price Calculator to estimate daily, monthly, yearly, and long-term spend from repeated per-unit habit costs.',
    slug: 'addiction-price-calculator',
    categorySlug: 'finance',
    homeRank: 12,
  },
  {
    name: 'Decision Maker (Spin the Wheel)',
    description:
      'Add custom choices, spin the wheel, and get one random answer with a fast playful interaction.',
    metaDescription:
      'Use the Decision Maker (Spin the Wheel) to enter custom options, spin a random wheel, and pick one result instantly.',
    slug: 'decision-maker-spin-the-wheel',
    categorySlug: 'utilities',
    homeRank: 2,
  },
  {
    name: 'Coin Toss (Heads or Tails)',
    description:
      'Flip a coin with a smooth animation and reveal a fair random heads-or-tails result after the toss.',
    metaDescription:
      'Use the Coin Toss tool to flip a virtual coin with animation, fair random results, streak tracking, and recent flip history.',
    slug: 'coin-toss-heads-or-tails',
    categorySlug: 'utilities',
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
    name: 'QR Code Generator',
    description:
      'Generate QR codes for links, text, Wi-Fi access, and contact details.',
    metaDescription:
      'Use the QR Code Generator to create QR codes for URLs, plain text, Wi-Fi login details, and contact cards.',
    slug: 'qr-code-generator',
    categorySlug: 'utilities',
    isFeatured: true,
    homeRank: 4,
  },
  {
    name: 'Password Generator',
    description:
      'Generate strong passwords with adjustable length and character options.',
    metaDescription:
      'Use the Password Generator to create strong passwords with custom length, letters, numbers, and symbols.',
    slug: 'password-generator',
    categorySlug: 'utilities',
    isFeatured: true,
    homeRank: 5,
  },
  {
    name: 'Image Resizer / Compressor',
    description:
      'Resize and compress one image directly in the browser and download the result.',
    metaDescription:
      'Use the Image Resizer / Compressor to resize images, reduce file size, and download the processed result directly in your browser.',
    slug: 'image-resizer-compressor',
    categorySlug: 'utilities',
    homeRank: 6,
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
    name: 'Base64 Encode / Decode',
    description:
      'Encode plain text into Base64 or decode Base64 back into readable text.',
    metaDescription:
      'Use the Base64 Encode / Decode tool to convert text to Base64 and decode Base64 text back into readable output.',
    slug: 'base64-encode-decode',
    categorySlug: 'developer-tools',
    homeRank: 6,
  },
  {
    name: 'URL Encoder / Decoder',
    description:
      'Encode full URL text or decode encoded strings back into readable values.',
    metaDescription:
      'Use the URL Encoder / Decoder to safely encode URL text and decode encoded URL strings back into readable output.',
    slug: 'url-encoder-decoder',
    categorySlug: 'developer-tools',
    homeRank: 7,
  },
  {
    name: 'UUID Generator / Validator',
    description:
      'Generate UUID v1, v4, or v7 values and validate pasted UUID strings.',
    metaDescription:
      'Use the UUID Generator / Validator to create UUID v1, v4, and v7 values or validate existing UUID strings.',
    slug: 'uuid-generator-validator',
    categorySlug: 'developer-tools',
    homeRank: 8,
  },
  {
    name: 'JWT Decoder',
    description:
      'Decode JWT header and payload values and inspect common token claims.',
    metaDescription:
      'Use the JWT Decoder to inspect JWT header and payload data, time claims, and token details directly in your browser.',
    slug: 'jwt-decoder',
    categorySlug: 'developer-tools',
    homeRank: 9,
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
    name: 'Business Days Calculator',
    description:
      'Count business days, weekend days, and total days between two selected dates.',
    metaDescription:
      'Use the Business Days Calculator to count working days, weekend days, and total days between two dates.',
    slug: 'business-days-calculator',
    categorySlug: 'date-tools',
    homeRank: 3,
  },
  {
    name: 'Weekend Left Calculator',
    description:
      'Count how many weekends, Saturdays, and Sundays are left in the year from any date.',
    metaDescription:
      'Use the Weekend Left Calculator to check how many weekends, Saturdays, and Sundays remain in the current year.',
    slug: 'weekend-left-calculator',
    categorySlug: 'date-tools',
    homeRank: 3,
  },
  {
    name: 'Meal Calories, Protein, Fiber & Fats Calculator',
    description:
      'Search foods, stack a meal, and total calories, protein, fiber, and fats in one place.',
    metaDescription:
      'Use the Meal Calories, Protein, Fiber & Fats Calculator to search foods, add multiple items to a meal, and total calories, protein, fiber, and fats with a simple meal verdict.',
    slug: 'food-macro-counter',
    categorySlug: 'health-tools',
    homeRank: 1,
  },
  {
    name: 'Plan My Meals',
    description:
      'Build a practical day of meals with client-side recommendations, serving guidance, and nutrition estimates.',
    metaDescription:
      'Use Plan My Meals to generate a practical breakfast, lunch, dinner, and snack plan from the food dataset using your goal, preferences, and body details.',
    slug: 'plan-my-meals',
    categorySlug: 'health-tools',
    homeRank: 1,
  },
  {
    name: 'Pregnancy Due Date Calculator',
    description:
      'Estimate due date, conception date, and pregnancy progress from LMP.',
    metaDescription:
      'Use the Pregnancy Due Date Calculator to estimate due date, conception date, pregnancy progress, and days remaining.',
    slug: 'pregnancy-due-date-calculator',
    categorySlug: 'health-tools',
    homeRank: 2,
  },
  {
    name: 'BMI Calculator',
    description:
      'Calculate body mass index from height and weight with a quick category result.',
    metaDescription:
      'Use the BMI Calculator to find body mass index from height and weight and check the standard BMI category.',
    slug: 'bmi-calculator',
    categorySlug: 'health-tools',
    homeRank: 3,
  },
  {
    name: 'Screen Time Impact Calculator',
    description:
      'Turn daily screen time into yearly hours, full days, and a simple impact estimate.',
    metaDescription:
      'Use the Screen Time Impact Calculator to convert daily screen time into yearly hours, equivalent days, and a potential productivity-loss estimate.',
    slug: 'screen-time-impact-calculator',
    categorySlug: 'health-tools',
    homeRank: 4,
  },
  {
    name: 'Sitting Time Risk Calculator',
    description:
      'Estimate a simple sedentary risk level and get a stand-up reminder interval.',
    metaDescription:
      'Use the Sitting Time Risk Calculator to estimate a simple health risk level from daily sitting hours and get a suggested stand-up interval.',
    slug: 'sitting-time-risk-calculator',
    categorySlug: 'health-tools',
    homeRank: 5,
  },
  {
    name: 'Heart Rate Zone Calculator',
    description:
      'Estimate fat-burn, cardio, and peak training zones from your age.',
    metaDescription:
      'Use the Heart Rate Zone Calculator to estimate max heart rate and training zones such as fat-burn and cardio from age.',
    slug: 'heart-rate-zone-calculator',
    categorySlug: 'health-tools',
    homeRank: 6,
  },
  {
    name: 'Biological Age Calculator',
    description:
      'Estimate a lifestyle-based biological age from your actual age, body metrics, and everyday habits.',
    metaDescription:
      'Use the Biological Age Calculator to estimate a wellness-based biological age from age, BMI-related body metrics, sleep, exercise, smoking, and stress.',
    slug: 'biological-age-calculator',
    categorySlug: 'health-tools',
    homeRank: 7,
  },
  {
    name: 'Circadian Rhythm Optimizer',
    description:
      'Turn wake-up time and your current location into morning light and evening dim-light windows.',
    metaDescription:
      'Use the Circadian Rhythm Optimizer to map wake-up time and current location into light windows for morning sunlight and evening dim-light habits.',
    slug: 'circadian-rhythm-optimizer',
    categorySlug: 'health-tools',
    homeRank: 8,
  },
]
