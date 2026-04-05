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
    category: 'Planning Tools',
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
    category: 'Loan Calculators',
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
    category: 'Investment Calculators',
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
  'mutual-fund-returns-calculator': {
    category: 'Investment Calculators',
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
  'gst-calculator': {
    category: 'Business Tools',
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
