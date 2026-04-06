export type ToolSeoContent = {
  category: string
  intro: string
  audience: string
  highlights: string[]
  faqs: Array<{
    question: string
    answer: string
  }>
}

export const toolSeoContent: Record<string, ToolSeoContent> = {
  'goal-calculator': {
    category: 'Finance',
    intro:
      'Use the Goal Calculator to turn a future purchase or milestone into a clear savings plan with projected value, funding gaps, and practical catch-up options.',
    audience:
      'This tool is useful for anyone planning a home purchase, travel goal, education fund, wedding budget, or any other milestone that needs a time-based savings strategy.',
    highlights: [
      'Turn a target cost into a time-based savings plan.',
      'See whether your current strategy is on track or behind.',
      'Compare catch-up options without leaving the page.',
    ],
    faqs: [
      {
        question: 'What does the Goal Calculator show?',
        answer:
          'It compares your target goal cost with your current savings plan and shows whether you are on track, close, or behind by the chosen target date.',
      },
      {
        question: 'Can I include savings I already have?',
        answer:
          'Yes. Current savings are added as your starting amount, and the tool projects how they can grow alongside your monthly contributions.',
      },
      {
        question: 'What if my current plan is not enough?',
        answer:
          'The tool suggests practical alternatives such as increasing monthly contributions, adding a one-time top-up, or delaying the goal timeline.',
      },
    ],
  },
  'emi-calculator': {
    category: 'Finance',
    intro:
      'Use the EMI Calculator to estimate monthly payments, total interest, and full repayment cost for home, car, or personal loans.',
    audience:
      'This tool is useful for borrowers comparing loan options before applying or checking how interest rate and tenure changes affect monthly affordability.',
    highlights: [
      'Estimate EMI before applying for a loan.',
      'Compare how rate and tenure change repayment cost.',
      'Understand total interest alongside monthly affordability.',
    ],
    faqs: [
      {
        question: 'What is EMI?',
        answer:
          'EMI stands for Equated Monthly Instalment, the fixed monthly amount paid toward a loan over the repayment term.',
      },
      {
        question: 'Does changing the tenure affect the EMI?',
        answer:
          'Yes. A longer tenure usually reduces the monthly EMI but increases the total interest paid over the life of the loan.',
      },
      {
        question: 'Can I use this for any type of loan?',
        answer:
          'Yes. You can use it for most standard reducing-balance loans by entering the loan amount, annual interest rate, and tenure.',
      },
    ],
  },
  'fd-interest-calculator': {
    category: 'Finance',
    intro:
      'Use the FD Interest Calculator to estimate maturity value, total interest earned, and fixed deposit growth over time with different compounding frequencies.',
    audience:
      'This tool is useful for anyone comparing fixed deposit offers and wanting to understand how rate, tenure, and compounding frequency affect maturity value.',
    highlights: [
      'Compare fixed deposit scenarios quickly.',
      'Understand the impact of compounding frequency.',
      'View nominal and inflation-adjusted maturity outcomes.',
    ],
    faqs: [
      {
        question: 'What does compounding frequency mean in an FD?',
        answer:
          'Compounding frequency controls how often earned interest is added back to the deposit, which can affect the final maturity value.',
      },
      {
        question: 'Does this tool show nominal and inflation-adjusted results?',
        answer:
          'Yes. It shows the standard maturity value and an inflation-adjusted view so you can compare nominal returns with estimated real purchasing power.',
      },
      {
        question: 'Can I compare short-term and long-term FDs here?',
        answer:
          'Yes. Adjust the tenure and interest rate to compare different deposit scenarios quickly.',
      },
    ],
  },
  'ppf-calculator': {
    category: 'Finance',
    intro:
      'Use the PPF Calculator to estimate annual contribution growth, interest earned, and maturity value over the chosen investment period.',
    audience:
      'This tool is useful for savers and long-term planners who want a quick Public Provident Fund projection without manually calculating yearly compounding.',
    highlights: [
      'Estimate maturity value from annual PPF contributions.',
      'See total invested amount and interest earned separately.',
      'Track how the balance grows year by year.',
    ],
    faqs: [
      {
        question: 'What does the PPF Calculator show?',
        answer:
          'It shows the projected maturity value, total invested amount, estimated interest earned, and a yearly growth trend based on the selected annual contribution and interest rate.',
      },
      {
        question: 'Does this support yearly contributions?',
        answer:
          'Yes. This version uses a simplified annual contribution model so you can estimate long-term PPF growth quickly.',
      },
      {
        question: 'Can I change the interest rate assumption?',
        answer:
          'Yes. You can adjust the annual interest rate to test different PPF return assumptions.',
      },
    ],
  },
  'mutual-fund-returns-calculator': {
    category: 'Finance',
    intro:
      'Use the Mutual Fund Returns Calculator to estimate lump-sum or SIP growth with projected returns, total value, and inflation-adjusted output.',
    audience:
      'This tool is useful for investors comparing one-time and monthly SIP plans, especially when testing different return rates, timelines, and yearly step-up scenarios.',
    highlights: [
      'Switch between lump-sum and SIP planning.',
      'Model step-up investing over longer timelines.',
      'Compare nominal and inflation-adjusted outcomes.',
    ],
    faqs: [
      {
        question: 'Can I calculate both SIP and lump-sum investments?',
        answer:
          'Yes. You can switch between one-time investment mode and monthly SIP mode depending on how you plan to invest.',
      },
      {
        question: 'What does step-up mean in SIP mode?',
        answer:
          'Step-up increases your SIP amount every year, which helps model a savings plan that grows with your income.',
      },
      {
        question: 'Why is there an inflation-adjusted value?',
        answer:
          'It helps you compare the projected portfolio value with an estimated real-value view after accounting for the selected inflation assumption.',
      },
    ],
  },
  'cagr-calculator': {
    category: 'Finance',
    intro:
      'Use the CAGR Calculator to find the compounded annual growth rate between an initial value and a final value across a selected time period.',
    audience:
      'This tool is useful for investors, analysts, and business users comparing growth over time and wanting a cleaner annualized rate than a simple total return figure.',
    highlights: [
      'Convert total growth into an annualized rate.',
      'Compare performance across different time periods.',
      'See CAGR alongside absolute gain and growth multiple.',
    ],
    faqs: [
      {
        question: 'What is CAGR?',
        answer:
          'CAGR stands for Compounded Annual Growth Rate, which expresses how fast a value grows per year on an annualized basis over a given time period.',
      },
      {
        question: 'Why use CAGR instead of total return?',
        answer:
          'CAGR makes it easier to compare performance across different durations because it normalizes the growth into a yearly rate.',
      },
      {
        question: 'Can I use this beyond investments?',
        answer:
          'Yes. You can use it for any scenario where you need annualized growth between a starting value and an ending value.',
      },
    ],
  },
  'gst-calculator': {
    category: 'Finance',
    intro:
      'Use the GST Calculator to quickly work out tax amounts for inclusive or exclusive GST pricing and see the final amount instantly.',
    audience:
      'This tool is useful for business owners, freelancers, shoppers, and finance teams who need a quick GST breakdown without manual calculation.',
    highlights: [
      'Check inclusive and exclusive GST instantly.',
      'See the tax amount and final total together.',
      'Test different GST rates without reworking formulas.',
    ],
    faqs: [
      {
        question: 'What is the difference between inclusive and exclusive GST?',
        answer:
          'Inclusive GST means the tax is already part of the entered amount, while exclusive GST means the tax is added on top of the base amount.',
      },
      {
        question: 'Can I try different GST rates?',
        answer:
          'Yes. You can change the GST rate to compare different tax slabs and pricing scenarios.',
      },
      {
        question: 'Is the final amount shown immediately?',
        answer:
          'Yes. The output updates as you change the amount, GST rate, or pricing mode.',
      },
    ],
  },
  'percentage-calculator': {
    category: 'Finance',
    intro:
      'Use the Percentage Calculator to solve common percentage problems such as finding a percent of a number, reversing a percentage, or calculating percentage change.',
    audience:
      'This tool is useful for students, shoppers, business users, and anyone who needs quick percentage math without switching between formulas.',
    highlights: [
      'Switch between common percentage calculation modes.',
      'Handle percentage-of, reverse percentage, and percentage change.',
      'Get a clear result from one compact workflow.',
    ],
    faqs: [
      {
        question: 'What percentage calculations are included?',
        answer:
          'The tool supports finding a percentage of a value, checking what percentage one number is of another, and measuring percentage increase or decrease between two values.',
      },
      {
        question: 'Can I calculate percentage increase and decrease?',
        answer:
          'Yes. The percentage change mode shows whether the result is an increase or a decrease based on the starting and ending values.',
      },
      {
        question: 'Is this useful for discounts and markups?',
        answer:
          'Yes. It can be used for many everyday scenarios, including discounts, growth comparisons, score changes, and price analysis.',
      },
    ],
  },
  'discount-calculator': {
    category: 'Finance',
    intro:
      'Use the Discount Calculator to calculate discount savings, reduced sale price, and final amount after optional tax.',
    audience:
      'This tool is useful for shoppers, sellers, and small business teams who want a quick sale-price breakdown without manual percentage math.',
    highlights: [
      'Calculate discount amount and savings instantly.',
      'See subtotal after discount before tax.',
      'Optionally add tax for a final payable amount.',
    ],
    faqs: [
      {
        question: 'What does the Discount Calculator show?',
        answer:
          'It shows the discount amount, the reduced subtotal after discount, the optional tax amount, and the final payable total.',
      },
      {
        question: 'Can I include tax after the discount?',
        answer:
          'Yes. Enter a tax percentage if you want the tool to calculate the final amount after discount and tax together.',
      },
      {
        question: 'Does the tool work with any currency?',
        answer:
          'Yes. You can switch the display currency for the result summary while keeping the same discount logic.',
      },
    ],
  },
  'unit-converter': {
    category: 'Conversion Tools',
    intro:
      'Use the Unit Converter to switch between everyday measurement units across categories like length, temperature, speed, area, weight, and storage.',
    audience:
      'This tool is useful for students, professionals, and anyone who needs fast unit conversions without searching for formulas manually.',
    highlights: [
      'Convert common measurement units in one place.',
      'Switch categories without leaving the page.',
      'Use live conversions for quick checks and comparisons.',
    ],
    faqs: [
      {
        question: 'What unit categories are available?',
        answer:
          'The converter supports several everyday categories such as length, weight, area, temperature, speed, and digital storage.',
      },
      {
        question: 'Can I reverse the conversion direction?',
        answer:
          'Yes. Use the swap action to reverse the selected from and to units quickly.',
      },
      {
        question: 'Does the result update live?',
        answer:
          'Yes. The converted value changes immediately as you edit the input or switch units.',
      },
    ],
  },
  'currency-converter': {
    category: 'Conversion Tools',
    intro:
      'Use the Currency Converter to switch an amount between major currencies using the latest available Frankfurter reference rates.',
    audience:
      'This tool is useful for shoppers, travelers, freelancers, and anyone who needs a quick cross-currency estimate without opening a separate finance app.',
    highlights: [
      'Convert between major currencies quickly.',
      'See the converted amount and latest available reference rate together.',
      'Swap the currency direction with one action.',
    ],
    faqs: [
      {
        question: 'What does the Currency Converter show?',
        answer:
          'It shows the converted amount along with the reference exchange rate between the selected currencies.',
      },
      {
        question: 'Are these live market exchange rates?',
        answer:
          'They are fetched from Frankfurter as the latest available reference rates, which are useful for conversion but should not be treated as real-time trading quotes.',
      },
      {
        question: 'Can I reverse the conversion direction?',
        answer:
          'Yes. Use the swap action to switch the from and to currencies instantly.',
      },
    ],
  },
  'time-zone-converter': {
    category: 'Conversion Tools',
    intro:
      'Use the Time Zone Converter to search global time zones and compare converted times with UTC offsets.',
    audience:
      'This tool is useful for remote teams, travelers, recruiters, and anyone scheduling meetings across regions.',
    highlights: [
      'Search a broad set of global time zones.',
      'Compare source and target UTC offsets.',
      'Handle meeting planning and travel timing more easily.',
    ],
    faqs: [
      {
        question: 'What does the Time Zone Converter show?',
        answer:
          'It shows the source time, converted target time, and the timezone offsets for both selections.',
      },
      {
        question: 'Can I change both source and target zones?',
        answer:
          'Yes. You can select both the source timezone and the destination timezone before converting.',
      },
      {
        question: 'Is this useful for meeting planning?',
        answer:
          'Yes. It is especially useful when you need to compare the same date and time across different cities or regions.',
      },
    ],
  },
  'color-converter': {
    category: 'Conversion Tools',
    intro:
      'Use the Color Converter to switch between HEX, RGB, and HSL values and preview the color at the same time.',
    audience:
      'This tool is useful for designers, frontend developers, marketers, and anyone working with brand or UI colors.',
    highlights: [
      'Convert between HEX, RGB, and HSL.',
      'Preview the color instantly.',
      'Edit from the format you already have.',
    ],
    faqs: [
      {
        question: 'What color formats are supported?',
        answer:
          'The converter supports HEX, RGB, and HSL formats in one tool.',
      },
      {
        question: 'Can I start from any one of the formats?',
        answer:
          'Yes. You can edit HEX, RGB, or HSL input and the tool updates the other formats when the value is valid.',
      },
      {
        question: 'Does it show a live preview?',
        answer:
          'Yes. A live preview block helps you confirm the converted color visually.',
      },
    ],
  },
  'number-to-words-converter': {
    category: 'Conversion Tools',
    intro:
      'Use the Number to Words Converter to turn a numeric value into English words for documents, forms, or written references.',
    audience:
      'This tool is useful for office work, education, finance paperwork, and any scenario where a number also needs a written version.',
    highlights: [
      'Convert numbers into English words quickly.',
      'Handle common decimal phrasing.',
      'Useful for forms, checks, and written records.',
    ],
    faqs: [
      {
        question: 'What does the Number to Words Converter show?',
        answer:
          'It converts the entered numeric value into English words so you can copy the written version directly.',
      },
      {
        question: 'Does it support decimals?',
        answer:
          'Yes. Decimal values are converted using a simple spoken-style point format.',
      },
      {
        question: 'Is this a multi-language tool?',
        answer:
          'No. This version focuses on English output only.',
      },
    ],
  },
  'text-formatter': {
    category: 'Text Tools',
    intro:
      'Use the Text Formatter to clean, transform, sort, replace, and restructure text from one lightweight workspace.',
    audience:
      'This tool is useful for writers, marketers, developers, and operations teams who regularly clean or transform copied text before publishing or processing it.',
    highlights: [
      'Clean copied text faster.',
      'Apply repeated formatting actions without manual edits.',
      'Handle sorting, casing, and replacement from one workspace.',
    ],
    faqs: [
      {
        question: 'What kinds of text changes can I make?',
        answer:
          'You can apply case changes, cleanup actions, formatting utilities, sorting, line-based operations, and other text transformations depending on the selected action.',
      },
      {
        question: 'Can I use find and replace inside the tool?',
        answer:
          'Yes. Some formatter actions include dedicated find and replace inputs so you can update repeated text quickly.',
      },
      {
        question: 'Is the original text overwritten permanently?',
        answer:
          'No. The tool updates the working text in the page, and you can reset it to start over with a clean input.',
      },
    ],
  },
  'json-viewer': {
    category: 'Developer Tools',
    intro:
      'Use the JSON Viewer to inspect nested JSON with a collapsible tree, search tools, and quick copy actions for keys and values.',
    audience:
      'This tool is useful for developers, analysts, QA teams, and API users who need to inspect raw JSON more clearly than a plain text area allows.',
    highlights: [
      'Inspect nested JSON with a readable tree view.',
      'Search and jump through matching keys or values.',
      'Copy useful parts of JSON without manual parsing.',
    ],
    faqs: [
      {
        question: 'Can I search inside the JSON tree?',
        answer:
          'Yes. The viewer includes search controls so you can jump through matching keys or values more easily.',
      },
      {
        question: 'Does it support nested arrays and objects?',
        answer:
          'Yes. The tree view is designed for deeply nested JSON structures and lets you expand or collapse sections as needed.',
      },
      {
        question: 'Can I copy values directly from the viewer?',
        answer:
          'Yes. The viewer includes copy actions that make it easier to reuse keys, values, or specific paths.',
      },
    ],
  },
  'csv-to-json-converter': {
    category: 'Developer Tools',
    intro:
      'Use the CSV to JSON Converter to turn tabular CSV input into formatted JSON output for inspection and reuse.',
    audience:
      'This tool is useful for developers, analysts, QA teams, and operations users moving data between spreadsheets and applications.',
    highlights: [
      'Convert CSV into structured JSON quickly.',
      'Works well for small tabular datasets and quick testing.',
      'Formats the output for easier reading.',
    ],
    faqs: [
      {
        question: 'What CSV format does this version expect?',
        answer:
          'This version expects a header row followed by one or more data rows.',
      },
      {
        question: 'What does the output look like?',
        answer:
          'The output is a formatted JSON array where each row becomes an object keyed by the CSV headers.',
      },
      {
        question: 'Can I use quoted CSV values?',
        answer:
          'Yes. Basic quoted values and escaped quotes are supported for normal CSV conversion workflows.',
      },
    ],
  },
  'json-to-csv-converter': {
    category: 'Developer Tools',
    intro:
      'Use the JSON to CSV Converter to transform a JSON array of flat objects into CSV with header columns.',
    audience:
      'This tool is useful for developers, analysts, and spreadsheet users who need to move structured data into CSV quickly.',
    highlights: [
      'Convert flat JSON arrays into CSV.',
      'Generate header columns automatically.',
      'Useful for spreadsheet import and export tasks.',
    ],
    faqs: [
      {
        question: 'What JSON shape does this converter support?',
        answer:
          'This version supports arrays of flat objects with string, number, boolean, or empty values.',
      },
      {
        question: 'What happens with nested JSON?',
        answer:
          'Nested objects or arrays are treated as unsupported in this version and trigger a validation message.',
      },
      {
        question: 'Does it create CSV headers automatically?',
        answer:
          'Yes. Header columns are generated from the object keys found in the input array.',
      },
    ],
  },
  'base-number-converter': {
    category: 'Developer Tools',
    intro:
      'Use the Binary / Decimal / Hex Converter to switch a whole number between base 2, base 10, and base 16 representations.',
    audience:
      'This tool is useful for developers, students, and anyone working with low-level values, encodings, or debugging output.',
    highlights: [
      'Convert between binary, decimal, and hexadecimal.',
      'Works from a single input base selection.',
      'Good for debugging and learning number systems.',
    ],
    faqs: [
      {
        question: 'What bases are supported?',
        answer:
          'The tool supports binary, decimal, and hexadecimal conversions.',
      },
      {
        question: 'Can I input the number in any one of those bases?',
        answer:
          'Yes. Select the input base first, enter the value, and the tool converts it to the other supported bases.',
      },
      {
        question: 'Does it support decimal fractions?',
        answer:
          'No. This version focuses on whole-number conversion only.',
      },
    ],
  },
  'timestamp-converter': {
    category: 'Developer Tools',
    intro:
      'Use the Timestamp Converter to turn Unix timestamps into readable dates and convert selected dates back into seconds or milliseconds.',
    audience:
      'This tool is useful for developers, support teams, data analysts, and anyone working with logs or API timestamps.',
    highlights: [
      'Convert Unix timestamps into readable time.',
      'Convert dates back into seconds or milliseconds.',
      'Compare UTC and local output together.',
    ],
    faqs: [
      {
        question: 'What does the Timestamp Converter show?',
        answer:
          'It shows UTC time, local time, and timestamp values in seconds and milliseconds depending on the selected mode.',
      },
      {
        question: 'Can I convert in both directions?',
        answer:
          'Yes. You can switch between timestamp-to-date and date-to-timestamp modes.',
      },
      {
        question: 'Does it support seconds and milliseconds?',
        answer:
          'Yes. Timestamp input can be handled as either seconds or milliseconds, and the output shows both forms.',
      },
    ],
  },
  'age-calculator': {
    category: 'Date Tools',
    intro:
      'Use the Age Calculator to find the exact difference between two dates in years, months, and days.',
    audience:
      'This tool is useful for personal records, HR forms, education paperwork, and any situation where exact age or date duration matters.',
    highlights: [
      'Find exact date differences without manual counting.',
      'See years, months, and days together.',
      'Use it for age checks or general duration calculations.',
    ],
    faqs: [
      {
        question: 'What dates do I need to enter?',
        answer:
          'Enter the birth date or start date and compare it against the current date or any selected end date.',
      },
      {
        question: 'Does it show more than just years?',
        answer:
          'Yes. The calculator breaks the result into years, months, and days for a more precise answer.',
      },
      {
        question: 'Can I use it to find duration between any two dates?',
        answer:
          'Yes. It works for exact date differences, not just age from birth date.',
      },
    ],
  },
  'date-difference-calculator': {
    category: 'Date Tools',
    intro:
      'Use the Date Difference Calculator to measure exact time between two dates in years, months, days, and total days.',
    audience:
      'This tool is useful for project planning, travel duration checks, paperwork, billing cycles, and any scenario where exact date gaps matter.',
    highlights: [
      'Measure exact calendar difference between two dates.',
      'See years, months, days, and total days together.',
      'Use it for planning, admin, or general date checks.',
    ],
    faqs: [
      {
        question: 'What does the Date Difference Calculator show?',
        answer:
          'It shows the exact calendar difference in years, months, and days, along with the total number of days between the selected dates.',
      },
      {
        question: 'Can I use this for non-age date comparisons?',
        answer:
          'Yes. It is designed for any two-date comparison, including events, projects, subscriptions, or personal planning.',
      },
      {
        question: 'What happens if the start date is later than the end date?',
        answer:
          'The tool shows a validation message so you can correct the date order before calculating the difference.',
      },
    ],
  },
  'bmi-calculator': {
    category: 'Health Tools',
    intro:
      'Use the BMI Calculator to find body mass index from your height and weight and check the standard BMI category instantly.',
    audience:
      'This tool is useful for anyone who wants a quick body mass index estimate as a general screening check using either metric or imperial inputs.',
    highlights: [
      'Calculate BMI from height and weight in seconds.',
      'Switch between metric and imperial inputs.',
      'See the standard BMI category alongside the score.',
    ],
    faqs: [
      {
        question: 'What does the BMI Calculator show?',
        answer:
          'It shows your body mass index value and the matching standard BMI category based on the height and weight you enter.',
      },
      {
        question: 'Can I use metric and imperial units?',
        answer:
          'Yes. The tool supports metric inputs such as centimeters and kilograms as well as imperial inputs such as feet, inches, and pounds.',
      },
      {
        question: 'Is BMI a medical diagnosis?',
        answer:
          'No. BMI is a general screening measure and should not be treated as a medical diagnosis on its own.',
      },
    ],
  },
  'biological-age-calculator': {
    category: 'Health Tools',
    intro:
      'Use the Biological Age Calculator to estimate a lifestyle-based biological age from your actual age, body measurements, and habit inputs.',
    audience:
      'This tool is useful for adults who want a simple, non-medical wellness estimate based on exercise, sleep, smoking, stress, alcohol intake, and BMI-related body metrics.',
    highlights: [
      'Compare estimated biological age with your actual age.',
      'See how BMI and daily habits affect the estimate.',
      'Review factors that are pushing the estimate older or younger.',
    ],
    faqs: [
      {
        question: 'What does the Biological Age Calculator show?',
        answer:
          'It estimates a wellness-based biological age, compares it with your chronological age, calculates BMI from your measurements, and highlights which habits are helping or hurting the estimate.',
      },
      {
        question: 'Is this a medical diagnosis or clinical age test?',
        answer:
          'No. This is a non-medical educational estimate based on simplified lifestyle and body-metric assumptions, not a clinical biological age assessment.',
      },
      {
        question: 'Do I need to know my BMI already?',
        answer:
          'No. The tool calculates BMI automatically from the height and weight values you enter.',
      },
    ],
  },
  'pregnancy-due-date-calculator': {
    category: 'Health Tools',
    intro:
      'Use the Pregnancy Due Date Calculator to estimate due date, conception date, pregnancy progress, and time remaining based on LMP.',
    audience:
      'This tool is useful for expectant parents who want a quick due date estimate and a simple progress view between key pregnancy milestones.',
    highlights: [
      'Estimate due date from last menstrual period.',
      'Check pregnancy progress and remaining time quickly.',
      'Use a simple reference view for milestone planning.',
    ],
    faqs: [
      {
        question: 'How is the due date estimated?',
        answer:
          'The due date is estimated from the last menstrual period using a standard pregnancy timeline calculation.',
      },
      {
        question: 'Does it show pregnancy progress too?',
        answer:
          'Yes. The tool also estimates pregnancy week, trimester progress, and the days remaining until the due date.',
      },
      {
        question: 'Is this a medical diagnosis tool?',
        answer:
          'No. It is a planning and estimation tool, and clinical advice should always come from a qualified medical professional.',
      },
    ],
  },
}
