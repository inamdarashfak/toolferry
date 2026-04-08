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
  'swp-calculator': {
    category: 'Finance',
    intro:
      'Use the SWP Calculator to estimate how a fixed monthly withdrawal plan affects corpus life, ending balance, and total withdrawals.',
    audience:
      'This tool is useful for investors and retirees testing whether a portfolio can support a planned withdrawal amount over a chosen time period.',
    highlights: [
      'Estimate whether a withdrawal plan can sustain the selected duration.',
      'See total withdrawals alongside the remaining balance.',
      'Compare multiple SWP scenarios without leaving the page.',
    ],
    faqs: [
      {
        question: 'What does the SWP Calculator show?',
        answer:
          'It estimates the ending corpus balance, total withdrawals, growth earned, and how long the corpus may last under the selected withdrawal plan.',
      },
      {
        question: 'Does the tool assume the corpus keeps earning returns?',
        answer:
          'Yes. It applies the selected annual return assumption while monthly withdrawals are being made from the corpus.',
      },
      {
        question: 'Can I use it for retirement planning?',
        answer:
          'Yes. It is useful for retirement-style withdrawal planning, as long as you understand that the results are estimates based on the chosen return assumption.',
      },
    ],
  },
  'step-up-sip-calculator': {
    category: 'Finance',
    intro:
      'Use the Step-Up SIP Calculator to project how increasing your SIP every year can change total invested amount, estimated returns, and future corpus.',
    audience:
      'This tool is useful for long-term investors who expect their monthly investment capacity to rise with income over time.',
    highlights: [
      'Model a SIP that increases every year.',
      'Compare invested amount against projected corpus growth.',
      'See how a step-up assumption changes long-term outcomes.',
    ],
    faqs: [
      {
        question: 'What is a step-up SIP?',
        answer:
          'A step-up SIP is a systematic investment plan where the monthly contribution increases by a chosen percentage each year.',
      },
      {
        question: 'Why use a step-up SIP instead of a fixed SIP?',
        answer:
          'A step-up SIP can better match income growth and may build a larger corpus over time than a flat monthly contribution.',
      },
      {
        question: 'Does the tool show the final year SIP amount too?',
        answer:
          'Yes. It also shows the final year monthly SIP estimate based on the selected step-up rate and duration.',
      },
    ],
  },
  'xirr-calculator': {
    category: 'Finance',
    intro:
      'Use the XIRR Calculator to calculate annualized returns when investments and redemptions happen on irregular dates and in irregular amounts.',
    audience:
      'This tool is useful for investors who want a more realistic annualized return measure for SIPs, top-ups, withdrawals, and portfolio exits.',
    highlights: [
      'Handle irregular cash flows with dated entries.',
      'Calculate annualized return beyond simple CAGR assumptions.',
      'Review total invested, realized value, and net gain together.',
    ],
    faqs: [
      {
        question: 'What is XIRR?',
        answer:
          'XIRR is an annualized return measure for investments with irregular cash flows and dates, making it useful for real-world investing activity.',
      },
      {
        question: 'Do I need both investment and redemption entries?',
        answer:
          'Yes. The calculation needs money going in and money coming out, or a current portfolio value treated as a final positive cash flow.',
      },
      {
        question: 'How is XIRR different from CAGR?',
        answer:
          'CAGR assumes a single starting value and a single ending value, while XIRR works better when multiple cash flows happen on different dates.',
      },
    ],
  },
  'emergency-fund-runway-calculator': {
    category: 'Finance',
    intro:
      'Use the Emergency Fund Runway Calculator to measure how long your savings can cover essential spending and how far you are from a target emergency corpus.',
    audience:
      'This tool is useful for households, freelancers, and salaried users who want a quick view of emergency cash coverage and funding progress.',
    highlights: [
      'Measure current emergency runway in months.',
      'Set a target savings cushion based on essential expenses.',
      'Estimate the remaining gap and time needed to fund it.',
    ],
    faqs: [
      {
        question: 'What is emergency fund runway?',
        answer:
          'Emergency fund runway is the number of months your current savings can cover essential monthly expenses if income stops or drops unexpectedly.',
      },
      {
        question: 'How is the target fund calculated?',
        answer:
          'The target fund is calculated as monthly essential expenses multiplied by the number of months of coverage you choose.',
      },
      {
        question: 'Can I use a different target than six months?',
        answer:
          'Yes. The target coverage is fully editable, so you can test lower or higher emergency fund goals.',
      },
    ],
  },
  'debt-payoff-planner': {
    category: 'Finance',
    intro:
      'Use the Debt Payoff Planner to compare avalanche and snowball repayment strategies using balances, interest rates, minimum payments, and extra monthly payoff amount.',
    audience:
      'This tool is useful for borrowers managing multiple debts and wanting a clearer path to faster payoff with lower interest cost.',
    highlights: [
      'Compare avalanche and snowball repayment strategies.',
      'See payoff time and total interest for each method.',
      'Understand which debt gets priority under the selected plan.',
    ],
    faqs: [
      {
        question: 'What is the avalanche method?',
        answer:
          'The avalanche method focuses extra payments on the highest-interest debt first while continuing minimum payments on the others.',
      },
      {
        question: 'What is the snowball method?',
        answer:
          'The snowball method focuses extra payments on the smallest balance first so debts can be cleared earlier in the sequence.',
      },
      {
        question: 'Does the planner compare both methods automatically?',
        answer:
          'Yes. It shows payoff time and total interest for both methods, while also letting you focus on one active plan at a time.',
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
  'invoice-generator': {
    category: 'Finance',
    intro:
      'Use the Invoice Generator to create GST-friendly invoices with seller details, client details, itemized charges, tax totals, and a printable preview.',
    audience:
      'This tool is useful for freelancers, agencies, shop owners, consultants, and small businesses that need a clean invoice without using heavy accounting software.',
    highlights: [
      'Create itemized invoices with GST-friendly tax breakdowns.',
      'Preview seller details, client details, totals, and balance due live.',
      'Print or save the invoice as a PDF directly from the browser.',
    ],
    faqs: [
      {
        question: 'Can I create a GST-friendly invoice with this tool?',
        answer:
          'Yes. The invoice includes GST fields, place of supply, GSTIN inputs, and a tax summary that adapts to the entered details.',
      },
      {
        question: 'Can I save the invoice as a PDF?',
        answer:
          'Yes. Use the print action and choose Save as PDF in the browser print dialog.',
      },
      {
        question: 'Can I add more than one item to the invoice?',
        answer:
          'Yes. You can add multiple line items, each with its own quantity, unit price, and GST rate.',
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
  'subscription-cost-calculator': {
    category: 'Finance',
    intro:
      'Use the Subscription Cost Calculator to turn recurring plan prices into equivalent daily, monthly, yearly, and 5-year totals.',
    audience:
      'This tool is useful for anyone reviewing streaming services, software plans, memberships, or app subscriptions and wanting a clearer long-term cost view.',
    highlights: [
      'Convert recurring subscription prices into yearly totals.',
      'Compare daily, monthly, and 5-year cost impact quickly.',
      'Include more than one subscription in the same estimate.',
    ],
    faqs: [
      {
        question: 'What billing frequencies are supported?',
        answer:
          'The calculator supports weekly, monthly, quarterly, and yearly billing so you can compare common subscription plans in one place.',
      },
      {
        question: 'Can I include more than one subscription?',
        answer:
          'Yes. Increase the subscription count to estimate the combined cost of multiple similar plans or seats.',
      },
      {
        question: 'Does it show long-term cost too?',
        answer:
          'Yes. Along with the daily and yearly breakdown, it also shows a 5-year total so recurring costs are easier to judge.',
      },
    ],
  },
  'can-i-afford-this-calculator': {
    category: 'Finance',
    intro:
      'Use the Can I Afford This? Calculator to compare a planned purchase against your monthly income, essential expenses, and savings goal.',
    audience:
      'This tool is useful for shoppers, planners, and budget-conscious users who want a simple monthly affordability check before buying something non-essential.',
    highlights: [
      'See what remains after essentials and savings.',
      'Check whether a purchase fits your current month.',
      'Measure the remaining buffer or shortfall instantly.',
    ],
    faqs: [
      {
        question: 'What does this calculator use to judge affordability?',
        answer:
          'It compares your monthly income against essential monthly expenses, your chosen savings goal, and the item price to show whether the purchase fits inside the remaining budget.',
      },
      {
        question: 'Can I include a monthly savings target?',
        answer:
          'Yes. The savings goal is treated as money you want to preserve before deciding whether the item is affordable this month.',
      },
      {
        question: 'Does it tell me if I am short?',
        answer:
          'Yes. If the purchase does not fit, the tool shows the shortfall needed to cover the item after expenses and savings.',
      },
    ],
  },
  'addiction-price-calculator': {
    category: 'Finance',
    intro:
      'Use the Addiction Price Calculator to estimate how much a repeated habit costs per day, month, year, and over longer stretches of time.',
    audience:
      'This tool is useful for anyone who wants a spend-focused estimate of how repeated purchases add up over time, without medical or behavioral scoring.',
    highlights: [
      'Estimate repeated habit cost from price and usage frequency.',
      'See daily, monthly, yearly, and 5-year spend together.',
      'Preview potential savings if the habit stops for a selected period.',
    ],
    faqs: [
      {
        question: 'What inputs does the calculator need?',
        answer:
          'It uses the cost per unit, how many units are used, and whether that usage is measured per day or per week.',
      },
      {
        question: 'Can I use this for habits other than smoking?',
        answer:
          'Yes. The unit label is editable, so you can estimate repeated spending for any per-unit habit or purchase pattern.',
      },
      {
        question: 'Does the calculator give health advice?',
        answer:
          'No. It is strictly a cost-estimation tool that focuses on spending totals and possible savings over time.',
      },
    ],
  },
  'decision-maker-spin-the-wheel': {
    category: 'Utilities',
    intro:
      'Use the Decision Maker (Spin the Wheel) to enter your own choices, spin a colorful wheel, and get one random answer in a quick playful format.',
    audience:
      'This tool is useful for anyone trying to choose between food ideas, weekend plans, team picks, chores, yes-or-no questions, or any small everyday decision.',
    highlights: [
      'Add your own options and spin for one random result.',
      'Edit, delete, reset, or quickly load preset lists without leaving the page.',
      'Keep a few recent option lists saved locally for faster repeat use.',
    ],
    faqs: [
      {
        question: 'How many options can I add to the wheel?',
        answer:
          'You can add multiple custom options, and the wheel will still spin through them, although shorter lists are easier to read directly on the wheel.',
      },
      {
        question: 'Does the tool stop duplicate options?',
        answer:
          'Yes. Blank entries and duplicate options are blocked after trimming extra spaces and checking the text case-insensitively.',
      },
      {
        question: 'Can I reuse a list later?',
        answer:
          'Yes. Recent option lists are saved in local storage on your device so you can restore them later without re-entering every option.',
      },
    ],
  },
  'coin-toss-heads-or-tails': {
    category: 'Utilities',
    intro:
      'Use the Coin Toss tool to flip a virtual coin with a smooth animated toss and reveal either heads or tails only after the flip finishes.',
    audience:
      'This tool is useful for anyone making a quick everyday decision, settling a tie, choosing a starter, or adding a small playful randomizer to a conversation or activity.',
    highlights: [
      'Flip a coin with a responsive 3D-style animation.',
      'Reveal the result only after the toss completes.',
      'Track recent flips and short result streaks without extra setup.',
    ],
    faqs: [
      {
        question: 'Is the coin toss random?',
        answer: 'Yes. Each flip gives heads and tails an equal 50/50 chance.',
      },
      {
        question: 'Can I flip the coin more than once?',
        answer:
          'Yes. You can keep flipping as often as you want, and the button becomes available again as soon as the current animation finishes.',
      },
      {
        question: 'Does the tool show previous results?',
        answer:
          'Yes. It keeps a short history of the latest flips and shows whether you are currently on a heads or tails streak.',
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
        answer: 'The converter supports HEX, RGB, and HSL formats in one tool.',
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
        answer: 'No. This version focuses on English output only.',
      },
    ],
  },
  'qr-code-generator': {
    category: 'Utilities',
    intro:
      'Use the QR Code Generator to create QR codes for links, plain text, Wi-Fi access details, and contact cards from one simple page.',
    audience:
      'This tool is useful for businesses, event teams, freelancers, students, and anyone who needs a fast QR code for sharing links or contact details.',
    highlights: [
      'Generate QR codes for several common use cases.',
      'Preview the code before downloading it.',
      'Download the result as a ready-to-share image.',
    ],
    faqs: [
      {
        question: 'What types of QR codes can I create here?',
        answer:
          'You can create QR codes for website links, plain text, Wi-Fi access details, and contact cards.',
      },
      {
        question: 'Can I download the QR code as an image?',
        answer:
          'Yes. The generated QR code can be downloaded as a PNG image directly from the page.',
      },
      {
        question: 'Does it support Wi-Fi QR codes?',
        answer:
          'Yes. You can enter the network name, password, and security type to generate a Wi-Fi QR code.',
      },
    ],
  },
  'password-generator': {
    category: 'Utilities',
    intro:
      'Use the Password Generator to create strong passwords with custom length and character settings from one simple page.',
    audience:
      'This tool is useful for anyone creating account passwords, updating credentials, or needing a quick strong-password option without leaving the browser.',
    highlights: [
      'Generate passwords with adjustable length.',
      'Choose which character types to include.',
      'Copy the password instantly after generation.',
    ],
    faqs: [
      {
        question: 'Can I choose what kinds of characters are included?',
        answer:
          'Yes. You can turn lowercase letters, uppercase letters, numbers, and symbols on or off before generating the password.',
      },
      {
        question: 'Can I generate more than one password?',
        answer:
          'Yes. Use the regenerate button to create a fresh password with the same settings.',
      },
      {
        question: 'Does the tool show a strength hint?',
        answer:
          'Yes. It includes a simple strength label based on password length and character variety.',
      },
    ],
  },
  'image-resizer-compressor': {
    category: 'Utilities',
    intro:
      'Use the Image Resizer / Compressor to resize a single image, reduce file size, and download the processed result directly in your browser.',
    audience:
      'This tool is useful for marketers, designers, sellers, students, and anyone preparing images for websites, forms, uploads, or email.',
    highlights: [
      'Resize one image directly in the browser.',
      'Compare original and processed image size quickly.',
      'Download the updated image without leaving the page.',
    ],
    faqs: [
      {
        question: 'What image formats does this tool support?',
        answer:
          'This version supports common single-image uploads such as PNG, JPEG, and WEBP.',
      },
      {
        question: 'Can I keep the image proportions the same?',
        answer:
          'Yes. The keep aspect ratio option helps resize the image without stretching it.',
      },
      {
        question: 'Can I download the processed image?',
        answer:
          'Yes. After applying the changes, the processed image can be downloaded directly from the page.',
      },
    ],
  },
  'text-formatter': {
    category: 'Utilities',
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
      'Use the CSV to JSON Converter to paste or import CSV data and turn it into formatted JSON output for inspection, reuse, and nested data mapping.',
    audience:
      'This tool is useful for developers, analysts, QA teams, and operations users moving data between spreadsheets and applications.',
    highlights: [
      'Import local CSV files or paste CSV text directly.',
      'Convert CSV into structured JSON with nested path support.',
      'Formats the output for easier reading and inspection.',
    ],
    faqs: [
      {
        question: 'What CSV format does this version expect?',
        answer:
          'This version expects a header row followed by one or more data rows, and it handles common CSV exports with quoted values, embedded newlines, and common delimiters.',
      },
      {
        question: 'Can I import a CSV file instead of pasting text?',
        answer:
          'Yes. You can import a local CSV file into the input panel and the tool converts it with the same parser used for pasted CSV text.',
      },
      {
        question: 'How do I create nested JSON from CSV headers?',
        answer:
          'Use path-style headers such as user.name or items[0].sku to map a row into nested objects or arrays, and valid JSON object or array cells are also preserved as nested values.',
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
        answer: 'No. This version focuses on whole-number conversion only.',
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
  'base64-encode-decode': {
    category: 'Developer Tools',
    intro:
      'Use the Base64 Encode / Decode tool to convert text into Base64 or decode Base64 back into readable text.',
    audience:
      'This tool is useful for developers, QA teams, support teams, and anyone working with encoded strings in APIs, configs, or debugging tasks.',
    highlights: [
      'Encode plain text into Base64 quickly.',
      'Decode Base64 back into readable text.',
      'Handle both directions from one small workspace.',
    ],
    faqs: [
      {
        question: 'Can I both encode and decode in the same tool?',
        answer:
          'Yes. The mode switch lets you move between Base64 encoding and decoding from the same page.',
      },
      {
        question: 'What happens if the Base64 input is invalid?',
        answer:
          'The tool shows a clear validation message instead of returning broken output.',
      },
      {
        question: 'Does it work with regular text input?',
        answer:
          'Yes. In encode mode you can paste or type normal text and convert it into Base64 output.',
      },
    ],
  },
  'url-encoder-decoder': {
    category: 'Developer Tools',
    intro:
      'Use the URL Encoder / Decoder to turn plain URL text into encoded output or decode encoded URL strings back into readable values.',
    audience:
      'This tool is useful for developers, QA teams, support teams, and anyone working with links, query strings, redirects, or encoded text.',
    highlights: [
      'Encode full URL text quickly.',
      'Decode encoded URL strings from one page.',
      'Useful for links, query params, and debugging tasks.',
    ],
    faqs: [
      {
        question: 'Can I both encode and decode in the same tool?',
        answer:
          'Yes. You can switch between encoding and decoding modes from the same workspace.',
      },
      {
        question: 'What happens if the encoded value is invalid?',
        answer:
          'The tool shows a clear validation message instead of returning broken output.',
      },
      {
        question: 'Can I use this for full links with query parameters?',
        answer:
          'Yes. You can paste full links, plain text, or encoded query-string values depending on what you need to convert.',
      },
    ],
  },
  'uuid-generator-validator': {
    category: 'Developer Tools',
    intro:
      'Use the UUID Generator / Validator to create UUID v1, v4, and v7 values or validate existing UUID strings line by line.',
    audience:
      'This tool is useful for developers, QA teams, testers, and support users who need fresh UUIDs or want to check whether an ID string is valid.',
    highlights: [
      'Generate UUIDs in common versions.',
      'Validate one or many UUID strings at once.',
      'See the detected version for valid values.',
    ],
    faqs: [
      {
        question: 'Which UUID versions does this tool support?',
        answer:
          'This version supports UUID v1, UUID v4, and UUID v7 generation, along with validation for pasted UUID strings.',
      },
      {
        question: 'Can I validate more than one UUID at a time?',
        answer:
          'Yes. Paste one UUID per line and the tool checks each one separately.',
      },
      {
        question: 'Does it show the version of a valid UUID?',
        answer:
          'Yes. Valid UUID values are labeled with the detected version so you can confirm the format more easily.',
      },
    ],
  },
  'jwt-decoder': {
    category: 'Developer Tools',
    intro:
      'Use the JWT Decoder to inspect token header and payload data, review common claims, and check readable time fields directly in your browser.',
    audience:
      'This tool is useful for developers, support teams, QA testers, and API users who need to inspect JWT content without sending the token anywhere.',
    highlights: [
      'Decode JWT header and payload sections instantly.',
      'Review issuer, subject, audience, and time claims.',
      'See clear status hints without claiming signature verification.',
    ],
    faqs: [
      {
        question: 'Does this tool verify the JWT signature?',
        answer:
          'No. It decodes the token and shows useful hints, but it does not perform cryptographic signature verification.',
      },
      {
        question: 'What token details can I inspect here?',
        answer:
          'You can inspect the decoded header, payload, signature text, and common claims such as issuer, subject, audience, issued-at time, and expiry time.',
      },
      {
        question: 'What happens if the token format is invalid?',
        answer:
          'The tool shows a clear error message when the token does not have the expected sections or when the header or payload cannot be decoded properly.',
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
  'business-days-calculator': {
    category: 'Date Tools',
    intro:
      'Use the Business Days Calculator to count workdays, weekend days, and total days between two selected dates.',
    audience:
      'This tool is useful for office planning, deadline estimates, leave planning, operations work, and any task that depends on Monday-to-Friday date counting.',
    highlights: [
      'Count business days between two dates quickly.',
      'See weekend days and total days in the same result.',
      'Choose whether the start date should be included.',
    ],
    faqs: [
      {
        question: 'What does this calculator treat as a business day?',
        answer:
          'This version treats Monday through Friday as business days and Saturday and Sunday as weekend days.',
      },
      {
        question: 'Can I include the start date in the count?',
        answer:
          'Yes. There is a toggle that lets you include or exclude the start date from the result.',
      },
      {
        question: 'Does this version include public holidays?',
        answer:
          'No. This version focuses only on weekday and weekend counting and does not include holiday calendars.',
      },
    ],
  },
  'weekend-left-calculator': {
    category: 'Date Tools',
    intro:
      'Use the Weekend Left Calculator to check how many Saturdays, Sundays, and full weekends are still left in the current year from a selected date.',
    audience:
      'This tool is useful for personal planning, time-off planning, travel planning, and anyone who wants a quick year-end weekend count without manually checking a calendar.',
    highlights: [
      'Count remaining weekends from any chosen date.',
      'See Saturday and Sunday counts separately.',
      'Check the next weekend day and the days left in the year.',
    ],
    faqs: [
      {
        question: 'What does the Weekend Left Calculator show?',
        answer:
          'It shows the number of Saturdays, Sundays, full weekends, and remaining days left in the current year from the selected reference date.',
      },
      {
        question: 'Can I use a date other than today?',
        answer:
          'Yes. You can change the reference date to any valid date and the result updates for that point in the same year.',
      },
      {
        question: 'Does it count only future weekends?',
        answer:
          'Yes. It counts from the selected date forward through December 31 of that year, including the selected day if it falls on a weekend.',
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
  'screen-time-impact-calculator': {
    category: 'Health Tools',
    intro:
      'Use the Screen Time Impact Calculator to convert average daily screen exposure into yearly hours, equivalent days, and a simple potential productivity-loss estimate.',
    audience:
      'This tool is useful for students, office workers, creators, and anyone who wants a clearer yearly picture of how daily screen habits add up.',
    highlights: [
      'Turn daily screen time into yearly hours instantly.',
      'See the equivalent number of full days spent on screens.',
      'Use a simple impact estimate as a behavior prompt.',
    ],
    faqs: [
      {
        question: 'What does the Screen Time Impact Calculator show?',
        answer:
          'It converts average daily screen time into yearly hours, equivalent full days, and a simple potential productivity-loss estimate.',
      },
      {
        question: 'Is the productivity-loss output exact?',
        answer:
          'No. It is a simplified estimate designed to make the time impact easier to visualize, not a precise performance measurement.',
      },
      {
        question: 'Can I use decimal hours?',
        answer:
          'Yes. You can enter values such as 5.5 hours per day to get a more precise estimate.',
      },
    ],
  },
  'sitting-time-risk-calculator': {
    category: 'Health Tools',
    intro:
      'Use the Sitting Time Risk Calculator to estimate a simple sedentary risk band from daily sitting time and get a suggested stand-up interval.',
    audience:
      'This tool is useful for desk workers, students, gamers, drivers, and anyone who spends long periods seated during the day.',
    highlights: [
      'Classify daily sitting time into a simple risk band.',
      'Get a stand-up reminder interval in minutes.',
      'Use it as a quick sedentary-habit awareness check.',
    ],
    faqs: [
      {
        question: 'What does the Sitting Time Risk Calculator show?',
        answer:
          'It shows a simple sedentary risk level and a suggested stand-up interval based on the number of hours you sit each day.',
      },
      {
        question: 'Is this a medical diagnosis tool?',
        answer:
          'No. It is a simplified wellness estimate meant for habit awareness, not a clinical health assessment.',
      },
      {
        question: 'Why does it suggest standing every few minutes?',
        answer:
          'The reminder interval is intended to break up long sedentary stretches and make regular movement easier to remember.',
      },
    ],
  },
  'heart-rate-zone-calculator': {
    category: 'Health Tools',
    intro:
      'Use the Heart Rate Zone Calculator to estimate max heart rate and common training zones such as fat-burn, cardio, and peak ranges from age.',
    audience:
      'This tool is useful for gym users, runners, cyclists, and anyone who wants a quick age-based training-zone estimate before a workout.',
    highlights: [
      'Estimate max heart rate with a simple age-based formula.',
      'See fat-burn, cardio, and peak training zones together.',
      'Get quick bpm ranges without using a separate fitness app.',
    ],
    faqs: [
      {
        question: 'How is max heart rate estimated?',
        answer:
          'This version uses the standard 220 minus age formula to estimate max heart rate and then applies percentage ranges for common training zones.',
      },
      {
        question: 'Which zones does the calculator show?',
        answer:
          'It shows fat-burn, cardio, and peak heart-rate ranges in beats per minute.',
      },
      {
        question: 'Are these values exact for every person?',
        answer:
          'No. They are simplified training estimates and may differ from lab-tested or device-specific results.',
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
