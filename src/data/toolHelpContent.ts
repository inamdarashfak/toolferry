export type ToolHelpContent = {
  description: string
  steps: string[]
  fieldGroups: Array<{
    title?: string
    fields: Array<{
      label: string
      description: string
    }>
  }>
}

export const toolHelpContent: Record<string, ToolHelpContent> = {
  'goal-calculator': {
    description:
      'Plan a future purchase or milestone by comparing your current savings strategy against the goal cost and the timeline you have in mind.',
    steps: [
      'Choose a goal type, give the goal a clear name, and enter what it costs today.',
      'Set the time available, your current savings, and the amount you can invest every month.',
      'Adjust return and yearly step-up if you expect your monthly contribution to grow over time.',
      'Use the right-side summary and action cards to see whether you are on track and what to change if you are short.',
    ],
    fieldGroups: [
      {
        title: 'Inputs',
        fields: [
          {
            label: 'Goal type buttons',
            description:
              'Quickly switch between common goal categories like home, travel, education, or a custom goal.',
          },
          {
            label: 'Goal name',
            description:
              'Adds a real label to the plan so the output feels tied to a specific purchase or milestone.',
          },
          {
            label: 'Current cost of goal',
            description:
              'Enter what the goal would cost based on today’s estimate or current market price.',
          },
          {
            label: 'Years to goal',
            description:
              'Set how long you have before you want to achieve the goal.',
          },
          {
            label: 'Current savings',
            description:
              'Money you already have set aside for this goal today.',
          },
          {
            label: 'Monthly contribution',
            description:
              'The amount you plan to add every month toward the goal.',
          },
          {
            label: 'Expected return',
            description:
              'The yearly return assumption used to project how your savings may grow.',
          },
          {
            label: 'Yearly step-up',
            description:
              'Increases the monthly contribution every year if you expect your savings ability to improve.',
          },
          {
            label: 'Currency',
            description:
              'Changes the currency symbol and number formatting used throughout the tool.',
          },
        ],
      },
      {
        title: 'Actions and results',
        fields: [
          {
            label: 'Reset',
            description: 'Restores the tool to its default example values.',
          },
          {
            label: 'On track summary',
            description:
              'Shows whether your current plan is enough, close, or behind based on the projected value.',
          },
          {
            label: 'Recommendation cards',
            description:
              'Suggest three catch-up paths: increase monthly savings, add a one-time amount, or accept a delay.',
          },
          {
            label: 'Journey view chart',
            description:
              'Compares the projected portfolio value against the goal cost over time.',
          },
        ],
      },
    ],
  },
  'emi-calculator': {
    description:
      'Estimate your monthly EMI, total interest, and total payment for a loan using the amount, rate, and tenure.',
    steps: [
      'Enter the total loan amount you plan to borrow.',
      'Set the annual interest rate and choose the repayment tenure in years.',
      'Review the EMI summary, payment breakup, and balance chart to understand the loan cost.',
      'Reset if you want to compare a different borrowing scenario.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Loan amount',
            description: 'The principal amount you want to borrow.',
          },
          {
            label: 'Interest rate',
            description:
              'The annual loan interest rate used to calculate the EMI.',
          },
          {
            label: 'Tenure',
            description: 'How long you will take to repay the loan.',
          },
          {
            label: 'Currency',
            description: 'Changes the currency display for all loan results.',
          },
          {
            label: 'Reset',
            description: 'Restores the default EMI example values.',
          },
          {
            label: 'Summary cards',
            description:
              'Show monthly EMI, total interest, total payment, and the borrowed amount.',
          },
          {
            label: 'Charts',
            description:
              'Visualize how much goes toward principal, interest, and remaining balance over time.',
          },
        ],
      },
    ],
  },
  'fd-interest-calculator': {
    description:
      'Estimate fixed deposit maturity value, total interest earned, and yearly growth using your deposit amount, rate, tenure, and compounding frequency.',
    steps: [
      'Enter the deposit amount, annual interest rate, and tenure.',
      'Choose the compounding frequency and currency.',
      'Review the maturity value, returns, and inflation-adjusted view if needed.',
      'Use the growth chart to see how the FD builds year by year.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Deposit amount',
            description: 'The lump sum amount placed into the fixed deposit.',
          },
          {
            label: 'Interest rate',
            description: 'The annual FD rate used for growth calculations.',
          },
          {
            label: 'Tenure',
            description: 'How long the fixed deposit stays invested.',
          },
          {
            label: 'Inflation rate',
            description:
              'Used to show an inflation-adjusted value alongside the nominal FD maturity.',
          },
          {
            label: 'Currency',
            description: 'Changes the currency symbol and number format.',
          },
          {
            label: 'Compounding',
            description:
              'Controls how often interest is added back into the deposit.',
          },
          {
            label: 'Reset',
            description: 'Restores the default FD example.',
          },
          {
            label: 'Growth chart',
            description:
              'Shows invested amount, interest earned, nominal maturity value, and inflation-adjusted value over time.',
          },
        ],
      },
    ],
  },
  'ppf-calculator': {
    description:
      'Estimate Public Provident Fund maturity using a simplified annual contribution model, interest rate, and total duration.',
    steps: [
      'Enter the amount you plan to contribute each year.',
      'Adjust the annual interest rate and the investment duration.',
      'Review the maturity value, total invested amount, and interest earned.',
      'Use the yearly growth chart to compare invested amount with projected value over time.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Yearly contribution',
            description:
              'The amount added to the PPF account once per year in this simplified model.',
          },
          {
            label: 'Interest rate',
            description:
              'The annual growth rate used to project the PPF balance.',
          },
          {
            label: 'Duration',
            description:
              'How many years the contributions remain invested, up to the supported range in the tool.',
          },
          {
            label: 'Currency',
            description:
              'Changes the number formatting used in the result summary.',
          },
          {
            label: 'Reset',
            description: 'Restores the default PPF example values.',
          },
          {
            label: 'Yearly growth chart',
            description:
              'Compares cumulative invested amount against projected maturity value each year.',
          },
        ],
      },
    ],
  },
  'mutual-fund-returns-calculator': {
    description:
      'Estimate mutual fund growth for one-time investing or SIP-based investing, with returns, total value, and inflation-adjusted output.',
    steps: [
      'Choose one-time or monthly SIP mode depending on how you plan to invest.',
      'Enter the investment amount, expected return, and time period.',
      'If you use SIP, optionally set a yearly step-up and inflation assumption.',
      'Review the total value, estimated returns, and the portfolio growth chart.',
    ],
    fieldGroups: [
      {
        title: 'Modes and inputs',
        fields: [
          {
            label: 'One-time / Monthly SIP',
            description:
              'Switch between a single lump-sum investment and recurring monthly investing.',
          },
          {
            label: 'Total investment / Monthly investment',
            description:
              'Enter either the lump-sum amount or the monthly SIP amount, depending on the mode.',
          },
          {
            label: 'Step-up each year',
            description:
              'Increase the SIP amount annually to reflect future income growth.',
          },
          {
            label: 'Expected return rate',
            description:
              'Annual growth assumption used to estimate mutual fund returns.',
          },
          {
            label: 'Time period',
            description: 'How long the money stays invested.',
          },
          {
            label: 'Inflation rate',
            description:
              'Used to show an inflation-adjusted version of the projected value.',
          },
          {
            label: 'Currency',
            description: 'Changes the currency display for the results.',
          },
          {
            label: 'Reset',
            description: 'Restores the default mutual fund example.',
          },
        ],
      },
      {
        title: 'Results',
        fields: [
          {
            label: 'Summary block',
            description:
              'Shows invested amount, estimated returns, total portfolio value, and inflation-adjusted value.',
          },
          {
            label: 'Portfolio growth chart',
            description:
              'Compares invested amount, estimated returns, projected portfolio value, and inflation-adjusted value over time.',
          },
        ],
      },
    ],
  },
  'cagr-calculator': {
    description:
      'Calculate compounded annual growth rate using a starting value, ending value, and time period in years.',
    steps: [
      'Enter the initial value and the final value you want to compare.',
      'Set the time period in years.',
      'Review the CAGR output along with the total gain and growth multiple.',
      'Use reset if you want to test another scenario quickly.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Initial value',
            description: 'The starting amount or baseline value.',
          },
          {
            label: 'Final value',
            description: 'The ending amount reached after the selected period.',
          },
          {
            label: 'Time period',
            description: 'How many years separate the initial and final value.',
          },
          {
            label: 'Reset',
            description: 'Restores the default CAGR example.',
          },
          {
            label: 'Annualized growth summary',
            description:
              'Shows CAGR, absolute gain, growth multiple, and ending value.',
          },
        ],
      },
    ],
  },
  'swp-calculator': {
    description:
      'Project systematic withdrawals from an investment corpus using your corpus size, expected return, and withdrawal amount.',
    steps: [
      'Enter the starting corpus you plan to draw from.',
      'Set the monthly withdrawal amount, expected annual return, and withdrawal duration.',
      'Review the ending balance, total withdrawals, and estimated corpus life.',
      'Use the chart to see how the balance and withdrawals progress over time.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Starting corpus',
            description:
              'The opening investment amount available for the withdrawal plan.',
          },
          {
            label: 'Monthly withdrawal',
            description:
              'The fixed amount taken out from the corpus every month.',
          },
          {
            label: 'Expected return',
            description:
              'The annual growth assumption used to estimate how the corpus may keep compounding while withdrawals continue.',
          },
          {
            label: 'Withdrawal period',
            description:
              'How long you want to continue the withdrawal plan in this scenario.',
          },
          {
            label: 'Currency',
            description:
              'Changes the symbol and number formatting used in the result view.',
          },
          {
            label: 'Reset',
            description:
              'Restores the example SWP scenario and clears any edited values.',
          },
          {
            label: 'Corpus path chart',
            description:
              'Shows yearly balance and cumulative withdrawals so you can see whether the corpus sustains the plan.',
          },
        ],
      },
    ],
  },
  'step-up-sip-calculator': {
    description:
      'Estimate a SIP plan that increases every year so you can compare total invested amount against projected portfolio value.',
    steps: [
      'Enter the starting monthly SIP amount.',
      'Choose the yearly step-up percentage, expected annual return, and duration.',
      'Review invested amount, estimated returns, and the final projected corpus.',
      'Use the growth chart to compare how invested capital and portfolio value change each year.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Starting monthly SIP',
            description:
              'The SIP amount used in the first year before any step-up is applied.',
          },
          {
            label: 'Yearly step-up',
            description:
              'The percentage increase applied to the monthly SIP once every year.',
          },
          {
            label: 'Expected return',
            description:
              'The annual growth assumption used for compounding the SIP investments.',
          },
          {
            label: 'Investment duration',
            description: 'How many years the stepped-up SIP plan continues.',
          },
          {
            label: 'Currency',
            description:
              'Changes the currency formatting used for projected values.',
          },
          {
            label: 'Growth comparison chart',
            description:
              'Compares the cumulative invested amount with the estimated portfolio value over time.',
          },
        ],
      },
    ],
  },
  'xirr-calculator': {
    description:
      'Calculate annualized return from dated cash flows such as SIPs, top-ups, withdrawals, and final redemption value.',
    steps: [
      'Add each investment or redemption as a separate cash-flow row.',
      'Choose the correct date and value for every row.',
      'Make sure the list includes at least one investment and one redemption.',
      'Review the XIRR result, total invested amount, and net gain summary.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Cash flow type',
            description:
              'Marks a row as either money invested into the portfolio or money received back from it.',
          },
          {
            label: 'Date',
            description:
              'The exact date used for the irregular cash-flow calculation.',
          },
          {
            label: 'Amount',
            description:
              'The size of the investment or redemption on that date.',
          },
          {
            label: 'Add row',
            description:
              'Adds another cash flow so you can include top-ups, withdrawals, or final value.',
          },
          {
            label: 'Remove row',
            description:
              'Deletes a cash-flow row you no longer want in the XIRR calculation.',
          },
          {
            label: 'Return summary',
            description:
              'Shows XIRR, total invested, total realized, net gain, and the full cash-flow span.',
          },
        ],
      },
    ],
  },
  'emergency-fund-runway-calculator': {
    description:
      'Measure current savings runway against monthly essential expenses and estimate the gap to your target emergency fund.',
    steps: [
      'Enter your current emergency savings balance.',
      'Set your monthly essential expenses and the amount you can add each month.',
      'Choose the number of months of expenses you want to keep as a target buffer.',
      'Review current runway, funding gap, and time-to-target.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Current savings',
            description:
              'The money already set aside specifically for emergency use.',
          },
          {
            label: 'Monthly essential expenses',
            description:
              'The monthly baseline spending your emergency fund would need to cover.',
          },
          {
            label: 'Monthly contribution',
            description:
              'The amount you expect to keep adding to the emergency fund every month.',
          },
          {
            label: 'Target coverage',
            description:
              'The number of months of essential expenses you want available in your emergency fund.',
          },
          {
            label: 'Emergency fund snapshot chart',
            description:
              'Compares current savings, target corpus, and the remaining funding gap.',
          },
          {
            label: 'Months to target',
            description:
              'Shows how long it may take to fully fund the target corpus at the current contribution pace.',
          },
        ],
      },
    ],
  },
  'debt-payoff-planner': {
    description:
      'Compare debt payoff strategies across multiple balances using interest rates, minimum payments, and an optional extra payment.',
    steps: [
      'Add each debt with a name, balance, interest rate, and minimum monthly payment.',
      'Enter any extra monthly amount you can put toward debt repayment.',
      'Switch between avalanche and snowball to focus the active plan.',
      'Review payoff time, total interest, and the payoff order for the selected strategy.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Debt rows',
            description:
              'Each row captures one loan or credit balance included in the plan.',
          },
          {
            label: 'Extra monthly payment',
            description:
              'Money above the minimums that can accelerate the payoff plan.',
          },
          {
            label: 'Focus strategy',
            description:
              'Choose avalanche to prioritize highest rates first or snowball to prioritize the smallest balances first.',
          },
          {
            label: 'Strategy comparison',
            description:
              'Shows payoff months and total interest for both payoff methods side by side.',
          },
          {
            label: 'Selected plan',
            description:
              'Shows the chosen payoff order and the total time required based on your current debt inputs.',
          },
        ],
      },
    ],
  },
  'gst-calculator': {
    description:
      'Calculate GST for inclusive or exclusive pricing and instantly see the tax amount, base amount, and total payable.',
    steps: [
      'Enter the amount and choose the GST rate.',
      'Select whether the amount is tax-exclusive or tax-inclusive.',
      'Review the GST amount, final total, and CGST/SGST split.',
      'Change currency or reset to compare another tax scenario.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Amount',
            description:
              'The entered amount before or after GST, depending on the tax mode selected.',
          },
          {
            label: 'GST rate',
            description: 'The GST percentage used in the calculation.',
          },
          {
            label: 'Tax mode',
            description:
              'Choose exclusive if GST should be added on top, or inclusive if GST is already inside the amount.',
          },
          {
            label: 'Currency',
            description: 'Changes how values are displayed across the tool.',
          },
          {
            label: 'Reset',
            description: 'Restores the default GST example.',
          },
          {
            label: 'Result cards',
            description:
              'Show base amount, GST amount, total amount, and the CGST/SGST split.',
          },
        ],
      },
    ],
  },
  'invoice-generator': {
    description:
      'Build a GST-friendly invoice with seller and client details, itemized billing, tax totals, and a printable invoice preview.',
    steps: [
      'Enter your seller details, GST information, client details, and invoice dates.',
      'Add one or more line items with quantity, unit price, and GST rate.',
      'Review the live preview on the right to confirm totals, tax split, and payment status.',
      'Use Print / Save as PDF when the invoice is ready to export.',
    ],
    fieldGroups: [
      {
        title: 'Business and invoice details',
        fields: [
          {
            label: 'Seller details',
            description:
              'Adds your business name, contact details, address, GSTIN, and seller state to the invoice.',
          },
          {
            label: 'Client details',
            description:
              'Adds the client name, business details, address, GSTIN, and place of supply used in the invoice preview.',
          },
          {
            label: 'Invoice details',
            description:
              'Includes invoice number, invoice date, due date, currency, payment terms, and notes.',
          },
        ],
      },
      {
        title: 'Charges and export',
        fields: [
          {
            label: 'Line items',
            description:
              'Lets you add, edit, or remove item rows with quantity, unit price, GST rate, and live line totals.',
          },
          {
            label: 'Adjustments',
            description:
              'Supports invoice-level discount, shipping or extra charges, and amount paid to calculate balance due.',
          },
          {
            label: 'Live invoice preview',
            description:
              'Shows the formatted invoice with GST split, totals, payment status, and all entered business details.',
          },
          {
            label: 'Print / Save as PDF',
            description:
              'Opens a printer-friendly invoice document so you can print it or save it as a PDF from the browser.',
          },
        ],
      },
    ],
  },
  'percentage-calculator': {
    description:
      'Solve common percentage problems from one tool, including percentage-of calculations, reverse percentages, and percentage change.',
    steps: [
      'Choose the percentage calculation mode you want to use.',
      'Enter the two values required for that mode.',
      'Review the result and the short explanation shown in the summary panel.',
      'Reset the form if you want to switch back to the default example.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Calculation mode',
            description:
              'Switches between percentage-of, reverse percentage, and percentage change workflows.',
          },
          {
            label: 'Value inputs',
            description:
              'The two numbers used by the selected percentage formula.',
          },
          {
            label: 'Reset',
            description: 'Restores the default percentage example.',
          },
          {
            label: 'Result summary',
            description:
              'Shows the main output and a short description of the calculation performed.',
          },
        ],
      },
    ],
  },
  'discount-calculator': {
    description:
      'Calculate how much a discount saves, what the reduced subtotal becomes, and the final amount after optional tax.',
    steps: [
      'Enter the original price of the item or service.',
      'Set the discount percentage and optional tax percentage.',
      'Choose the display currency if needed.',
      'Review the savings, discounted subtotal, tax amount, and final payable total.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Original price',
            description: 'The full price before any discount is applied.',
          },
          {
            label: 'Discount',
            description:
              'The percentage reduction applied to the original price.',
          },
          {
            label: 'Tax after discount',
            description:
              'Optional tax percentage added after the discount is applied.',
          },
          {
            label: 'Currency',
            description: 'Changes the display formatting for money values.',
          },
          {
            label: 'Reset',
            description: 'Restores the default discount example.',
          },
          {
            label: 'Discount summary',
            description:
              'Shows savings, discounted subtotal, tax amount, and final price.',
          },
        ],
      },
    ],
  },
  'subscription-cost-calculator': {
    description:
      'Estimate how much a recurring subscription costs over time by converting the plan price into daily, monthly, yearly, and 5-year totals.',
    steps: [
      'Enter the subscription price and choose how often it is billed.',
      'Set how many subscriptions or seats you want included in the estimate.',
      'Choose the display currency if needed.',
      'Review the equivalent daily, monthly, yearly, and 5-year cost summary.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Subscription price',
            description: 'The amount charged for one billing cycle.',
          },
          {
            label: 'Billing frequency',
            description:
              'Defines whether the price repeats weekly, monthly, quarterly, or yearly.',
          },
          {
            label: 'Number of subscriptions',
            description:
              'Lets you estimate multiple similar plans or paid seats together.',
          },
          {
            label: 'Currency',
            description:
              'Changes how money values are formatted in the summary.',
          },
          {
            label: 'Reset',
            description: 'Restores the default subscription example.',
          },
          {
            label: 'Cost snapshot',
            description:
              'Shows equivalent daily, monthly, yearly, and 5-year subscription cost totals.',
          },
        ],
      },
    ],
  },
  'can-i-afford-this-calculator': {
    description:
      'Check whether a planned purchase fits this month after essential expenses and a chosen savings goal are accounted for.',
    steps: [
      'Enter your monthly income and the essential expenses you need to cover first.',
      'Add a monthly savings goal if you want to reserve money before buying the item.',
      'Enter the price of the purchase you are considering.',
      'Review the remaining budget, affordability status, and any buffer or shortfall.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Monthly income',
            description: 'Your total take-home or usable monthly income.',
          },
          {
            label: 'Essential monthly expenses',
            description:
              'The fixed or necessary spending that should be covered before the purchase.',
          },
          {
            label: 'Monthly savings goal',
            description:
              'Optional money you want to preserve for saving before buying the item.',
          },
          {
            label: 'Item price',
            description:
              'The cost of the item or purchase you are considering.',
          },
          {
            label: 'Currency',
            description: 'Changes money formatting throughout the calculator.',
          },
          {
            label: 'Affordability snapshot',
            description:
              'Shows what remains after expenses, after savings, and whether the purchase still fits this month.',
          },
        ],
      },
    ],
  },
  'addiction-price-calculator': {
    description:
      'Estimate repeated habit spend by combining cost per unit with daily or weekly usage frequency.',
    steps: [
      'Enter how much one unit costs and how many units are used.',
      'Choose whether the usage amount is per day or per week.',
      'Edit the unit label if you want the summary text to match the habit.',
      'Review the daily, monthly, yearly, 5-year, and quit-horizon savings estimates.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Cost per unit',
            description:
              'The price paid for one unit of the repeated purchase.',
          },
          {
            label: 'Units used',
            description:
              'How many units are used in the selected daily or weekly period.',
          },
          {
            label: 'Unit label',
            description:
              'Custom text used to describe the habit in the summary sentence.',
          },
          {
            label: 'Usage frequency',
            description:
              'Defines whether the usage amount is measured per day or per week.',
          },
          {
            label: 'Quit savings horizon',
            description:
              'Shows how much money could be saved over the selected stop-spending period.',
          },
          {
            label: 'Spend snapshot',
            description:
              'Summarizes daily, monthly, yearly, and 5-year spending plus the selected savings horizon.',
          },
        ],
      },
    ],
  },
  'decision-maker-spin-the-wheel': {
    description:
      'Create a custom decision wheel by adding options, editing the list, and spinning for one random result.',
    steps: [
      'Enter one option at a time and add as many choices as you want.',
      'Edit or delete any option in the current list before spinning.',
      'Use a preset list or the Yes / No quick mode if you want to start faster.',
      'Spin the wheel and review the selected result shown in the result panel.',
    ],
    fieldGroups: [
      {
        title: 'Option setup',
        fields: [
          {
            label: 'New option',
            description:
              'Adds one trimmed option at a time to the wheel while blocking blank or duplicate entries.',
          },
          {
            label: 'Preset buttons',
            description:
              'Load starter option sets such as lunch or movie ideas without typing everything manually.',
          },
          {
            label: 'Yes / No quick mode',
            description:
              'Instantly replaces the current list with a simple two-option yes or no decision.',
          },
          {
            label: 'Current options list',
            description:
              'Shows every active wheel option with edit and delete controls.',
          },
        ],
      },
      {
        title: 'Spin behavior and results',
        fields: [
          {
            label: 'Remove selected after spin',
            description:
              'Automatically removes the winning option after a completed spin if you want to narrow the list further.',
          },
          {
            label: 'Spin the wheel',
            description:
              'Animates the wheel and lands on one random option when at least two valid entries exist.',
          },
          {
            label: 'Result panel',
            description:
              'Clearly displays the winning option in text so the answer is readable even without relying on the wheel graphic.',
          },
          {
            label: 'Recent lists',
            description:
              'Stores a few recently used option sets in local storage so they can be restored quickly later.',
          },
          {
            label: 'Reset examples / Clear all',
            description:
              'Reset restores the default starter list, while clear all empties the current wheel completely.',
          },
        ],
      },
    ],
  },
  'coin-toss-heads-or-tails': {
    description:
      'Flip a virtual coin and reveal either heads or tails after a short animated toss completes.',
    steps: [
      'Tap the Flip Coin button to start the toss animation.',
      'Wait for the coin to finish spinning before the result is revealed.',
      'Review the latest result, current streak, and recent flip history.',
      'Flip again anytime after the button becomes active.',
    ],
    fieldGroups: [
      {
        title: 'Main interaction',
        fields: [
          {
            label: 'Flip Coin button',
            description:
              'Starts a new toss, disables itself during the animation, and becomes available again after the result is revealed.',
          },
          {
            label: 'Animated coin',
            description:
              'Shows a smooth heads-or-tails flip animation with the final coin face matching the revealed result.',
          },
          {
            label: 'Result message',
            description:
              'Displays the toss status during the flip and the final heads or tails result once the animation completes.',
          },
        ],
      },
      {
        title: 'Supporting feedback',
        fields: [
          {
            label: 'Latest result',
            description: 'Shows the most recent completed flip at a glance.',
          },
          {
            label: 'Current streak',
            description:
              'Highlights when the same result appears on consecutive flips.',
          },
          {
            label: 'Last 5 flips',
            description:
              'Keeps a short history of the five most recent toss results for quick reference.',
          },
        ],
      },
    ],
  },
  'unit-converter': {
    description:
      'Convert values between different units by selecting a category, source unit, destination unit, and amount.',
    steps: [
      'Choose the conversion category such as length, speed, temperature, or area.',
      'Enter the value you want to convert.',
      'Select the from-unit and to-unit, or use swap to reverse them quickly.',
      'Read the converted value and compare the unit symbols shown in the result area.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Category',
            description: 'Selects the type of conversion you want to perform.',
          },
          {
            label: 'Input value',
            description: 'The number to convert from one unit to another.',
          },
          {
            label: 'From unit',
            description: 'The current unit of the value you entered.',
          },
          {
            label: 'To unit',
            description: 'The unit you want the value converted into.',
          },
          {
            label: 'Swap',
            description: 'Quickly flips the from-unit and to-unit.',
          },
          {
            label: 'Reset',
            description: 'Returns the converter to its default state.',
          },
        ],
      },
    ],
  },
  'currency-converter': {
    description:
      'Convert an amount between major currencies and review the latest available Frankfurter reference exchange rate used for the calculation.',
    steps: [
      'Enter the amount you want to convert.',
      'Choose the source and target currencies.',
      'Use swap if you want to reverse the conversion direction quickly.',
      'Review the converted amount and the latest available reference rate summary.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Amount',
            description: 'The money value you want to convert.',
          },
          {
            label: 'From / To currency',
            description:
              'Choose the source currency and the destination currency for conversion.',
          },
          {
            label: 'Swap',
            description:
              'Reverses the selected currency direction in one click.',
          },
          {
            label: 'Reset',
            description: 'Restores the default currency conversion example.',
          },
          {
            label: 'Reference rate',
            description:
              'Shows the latest available Frankfurter reference rate used to calculate the converted amount.',
          },
        ],
      },
    ],
  },
  'time-zone-converter': {
    description:
      'Convert a selected date and time between two time zones and compare the source and destination offsets.',
    steps: [
      'Choose the date and time you want to convert.',
      'Search and select the source time zone and the target time zone.',
      'Use swap if you want to reverse the direction.',
      'Review the source time, converted time, and UTC offset summary.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Date and time',
            description:
              'The local date-time value to convert from the selected source zone.',
          },
          {
            label: 'From / To time zone',
            description:
              'Search for the source time zone first and the destination time zone second.',
          },
          {
            label: 'Swap',
            description: 'Reverses the source and target time zones quickly.',
          },
          {
            label: 'Reset',
            description: 'Restores the default time zone conversion example.',
          },
          {
            label: 'Converted time summary',
            description:
              'Shows the source time, converted target time, and both UTC offsets.',
          },
        ],
      },
    ],
  },
  'color-converter': {
    description:
      'Convert color values between HEX, RGB, and HSL while viewing the resulting color preview instantly.',
    steps: [
      'Enter the color value in HEX, RGB, or HSL format.',
      'Use the format you already have; the converter updates the other formats when valid.',
      'Review the synchronized HEX, RGB, and HSL output.',
      'Use reset to return to the default example color.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'HEX / RGB / HSL',
            description:
              'You can edit any of the supported formats to drive the conversion.',
          },
          {
            label: 'Reset',
            description: 'Restores the default example color values.',
          },
          {
            label: 'Color preview',
            description:
              'Shows the converted color visually so you can verify the output more easily.',
          },
        ],
      },
    ],
  },
  'number-to-words-converter': {
    description:
      'Convert a numeric value into English words for forms, documents, and written references.',
    steps: [
      'Enter the number you want to convert into words.',
      'Review the English words output generated from the value.',
      'Use reset if you want to return to the default example number.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Number',
            description: 'The numeric value to convert into English words.',
          },
          {
            label: 'Reset',
            description: 'Restores the default number example.',
          },
          {
            label: 'Words output',
            description:
              'Shows the entered number written out in English words.',
          },
        ],
      },
    ],
  },
  'qr-code-generator': {
    description:
      'Create QR codes for website links, plain text, Wi-Fi access details, or contact information and download the result as an image.',
    steps: [
      'Choose the kind of QR code you want to make, such as a URL, text, Wi-Fi access, or contact card.',
      'Fill in the matching fields for that QR type.',
      'Review the QR preview on the right and confirm the encoded content below it.',
      'Download the QR code image or copy the encoded content when needed.',
    ],
    fieldGroups: [
      {
        title: 'Inputs',
        fields: [
          {
            label: 'QR type',
            description:
              'Switches between website URL, plain text, Wi-Fi access, and contact card formats.',
          },
          {
            label: 'Type-specific fields',
            description:
              'Shows only the fields needed for the selected QR type, such as URL, network name, or contact details.',
          },
          {
            label: 'Reset',
            description:
              'Restores the default QR example values for a quick restart.',
          },
          {
            label: 'Copy content',
            description:
              'Copies the encoded text value used to generate the current QR code.',
          },
        ],
      },
      {
        title: 'Output',
        fields: [
          {
            label: 'QR preview',
            description:
              'Shows the generated QR code image based on the current input values.',
          },
          {
            label: 'Encoded content',
            description:
              'Displays the final text payload being used in the QR code.',
          },
          {
            label: 'Download QR code',
            description: 'Downloads the generated QR code as a PNG image.',
          },
        ],
      },
    ],
  },
  'password-generator': {
    description:
      'Create strong passwords with custom length and character options, then copy the result instantly.',
    steps: [
      'Choose the password length you want.',
      'Turn character sets on or off for lowercase letters, uppercase letters, numbers, and symbols.',
      'Review the generated password and its simple strength label.',
      'Copy the password or regenerate a new one if you want another variation.',
    ],
    fieldGroups: [
      {
        title: 'Controls',
        fields: [
          {
            label: 'Password length',
            description:
              'Adjusts how many characters the generated password should contain.',
          },
          {
            label: 'Character set toggles',
            description:
              'Control whether lowercase letters, uppercase letters, numbers, and symbols are included.',
          },
          {
            label: 'Reset',
            description: 'Restores the default password settings.',
          },
          {
            label: 'Regenerate',
            description: 'Creates a new password using the current settings.',
          },
        ],
      },
      {
        title: 'Output',
        fields: [
          {
            label: 'Generated password',
            description:
              'Shows the password created from the selected settings.',
          },
          {
            label: 'Strength label',
            description:
              'Provides a simple quality signal based on password length and character variety.',
          },
          {
            label: 'Copy password',
            description: 'Copies the generated password to the clipboard.',
          },
        ],
      },
    ],
  },
  'image-resizer-compressor': {
    description:
      'Resize and compress a single image in your browser, compare the original and processed result, and download the updated file.',
    steps: [
      'Upload a PNG, JPG, or WEBP image from your device.',
      'Set the output width, height, format, and quality level you want.',
      'Keep aspect ratio on if you want proportional resizing.',
      'Apply the changes, compare the preview and size difference, and download the result.',
    ],
    fieldGroups: [
      {
        title: 'Inputs',
        fields: [
          {
            label: 'Choose image',
            description:
              'Uploads a single image into the tool for browser-side processing.',
          },
          {
            label: 'Width / Height',
            description: 'Sets the target dimensions for the processed image.',
          },
          {
            label: 'Keep aspect ratio',
            description: 'Keeps the image proportions linked while resizing.',
          },
          {
            label: 'Output format',
            description:
              'Changes whether the result is exported as JPEG, PNG, or WEBP.',
          },
          {
            label: 'Quality',
            description:
              'Controls compression strength for formats that support adjustable quality.',
          },
        ],
      },
      {
        title: 'Output',
        fields: [
          {
            label: 'Original preview',
            description:
              'Shows the uploaded source image before resizing or compression.',
          },
          {
            label: 'Processed preview',
            description:
              'Shows the updated image using the current output settings.',
          },
          {
            label: 'Download image',
            description: 'Downloads the processed file to your device.',
          },
        ],
      },
    ],
  },
  'text-formatter': {
    description:
      'Clean, transform, and reshape text using grouped actions such as case changes, cleanup, sorting, replacing, and format conversion.',
    steps: [
      'Paste or type your source text into the original text box.',
      'Choose a tool group and then select the action you want to apply.',
      'Fill in any helper fields such as find, replace, prefix, or suffix if the action needs them.',
      'Review the output, compare stats, and copy the transformed text when ready.',
    ],
    fieldGroups: [
      {
        title: 'Controls',
        fields: [
          {
            label: 'Tool group',
            description:
              'Filters actions into categories like case changes, cleanup, lines, convert, and replace.',
          },
          {
            label: 'Action',
            description: 'The exact transform applied to the source text.',
          },
          {
            label: 'Find / Replace',
            description:
              'Used only for the find-and-replace action to search for one value and replace it with another.',
          },
          {
            label: 'Case sensitive',
            description:
              'Controls whether find-and-replace should match exact letter casing.',
          },
          {
            label: 'Prefix / Suffix',
            description:
              'Add a value before or after every line when those actions are selected.',
          },
          {
            label: 'Reset',
            description:
              'Clears the current setup and restores default content.',
          },
          {
            label: 'Copy',
            description: 'Copies the transformed output to the clipboard.',
          },
        ],
      },
      {
        title: 'Panels',
        fields: [
          {
            label: 'Original text',
            description: 'The input text that the tool transforms.',
          },
          {
            label: 'Output',
            description:
              'Shows the transformed result after the selected action is applied.',
          },
          {
            label: 'Stats summary',
            description:
              'Displays useful counts like characters, words, lines, and reading time.',
          },
        ],
      },
    ],
  },
  'json-viewer': {
    description:
      'Inspect raw JSON in a collapsible tree view, search through keys and values, and copy key/value data more easily.',
    steps: [
      'Paste valid JSON into the raw JSON input area.',
      'Use search to highlight matching keys or values and jump through the results.',
      'Expand or collapse the tree manually, or use the global expand and collapse buttons.',
      'Right-click a node if you want to copy a key, value, or key-value pair.',
    ],
    fieldGroups: [
      {
        title: 'Top controls',
        fields: [
          {
            label: 'Search JSON',
            description:
              'Searches both keys and values inside the parsed JSON tree.',
          },
          {
            label: 'Previous / Next',
            description: 'Move between matches found by the search input.',
          },
          {
            label: 'Expand all / Collapse all',
            description: 'Open or close all expandable JSON nodes at once.',
          },
          {
            label: 'Format JSON',
            description:
              'Reformats valid JSON with clean indentation for easier reading.',
          },
          {
            label: 'Reset',
            description: 'Restores the sample JSON and clears search state.',
          },
        ],
      },
      {
        title: 'Panels and tree',
        fields: [
          {
            label: 'Raw JSON',
            description:
              'The editable JSON source used to generate the parsed tree view.',
          },
          {
            label: 'Parsed tree',
            description:
              'The visual tree representation of the JSON structure.',
          },
          {
            label: 'Plus / minus toggles',
            description: 'Expand or collapse objects and arrays node by node.',
          },
          {
            label: 'Context menu',
            description:
              'Lets you copy the selected key, value, or full key-value pair.',
          },
        ],
      },
    ],
  },
  'csv-to-json-converter': {
    description:
      'Convert pasted CSV or imported CSV files with a header row into formatted JSON output, including nested objects or arrays from path-style headers.',
    steps: [
      'Paste CSV content or import a local CSV file into the input area.',
      'Make sure the first row contains the headers for each field or nested path.',
      'Use headers like user.name or items[0].sku when you want nested JSON output.',
      'Review the formatted JSON output generated from the rows.',
      'Use reset to restore the sample CSV.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'CSV input',
            description:
              'The source CSV data, including the header row and any nested path-style columns.',
          },
          {
            label: 'Import CSV',
            description:
              'Loads a local CSV or text file into the input area for conversion.',
          },
          {
            label: 'Reset',
            description:
              'Restores the sample CSV example and clears imported file state.',
          },
          {
            label: 'JSON output',
            description:
              'Shows the converted JSON array generated from the CSV rows, including nested objects or arrays when the headers define them.',
          },
        ],
      },
    ],
  },
  'json-to-csv-converter': {
    description:
      'Convert a JSON array of flat objects into CSV output with header columns.',
    steps: [
      'Paste a JSON array of flat objects into the input area.',
      'Review the generated CSV output.',
      'If nested JSON is present, use the validation message to simplify the shape first.',
      'Use reset to restore the sample JSON.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'JSON input',
            description: 'The source JSON array used for the CSV conversion.',
          },
          {
            label: 'Reset',
            description: 'Restores the sample JSON example.',
          },
          {
            label: 'CSV output',
            description:
              'Shows the generated CSV with automatically created headers.',
          },
        ],
      },
    ],
  },
  'base-number-converter': {
    description:
      'Convert whole numbers between binary, decimal, and hexadecimal representations from one selected input base.',
    steps: [
      'Choose the input base you want to type in.',
      'Enter the whole number value.',
      'Review the converted output in the other supported bases.',
      'Use reset to return to the default example value.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Input base',
            description:
              'Select whether the entered value should be treated as binary, decimal, or hexadecimal.',
          },
          {
            label: 'Value',
            description: 'The whole number to convert between number systems.',
          },
          {
            label: 'Reset',
            description: 'Restores the default conversion example.',
          },
          {
            label: 'Converted values',
            description:
              'Shows the matching binary, decimal, and hexadecimal output.',
          },
        ],
      },
    ],
  },
  'timestamp-converter': {
    description:
      'Convert Unix timestamps into readable dates or convert selected dates back into seconds and milliseconds.',
    steps: [
      'Choose whether you want to convert a timestamp to a date or a date to a timestamp.',
      'Enter the timestamp or select the date and time.',
      'Choose seconds or milliseconds when timestamp input is used.',
      'Review the UTC value, local value, and timestamp output summary.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Mode',
            description:
              'Switch between timestamp-to-date conversion and date-to-timestamp conversion.',
          },
          {
            label: 'Timestamp unit',
            description:
              'Controls whether timestamp input should be interpreted as seconds or milliseconds.',
          },
          {
            label: 'Timestamp / Date input',
            description:
              'Provide either a Unix timestamp or a date-time value depending on the selected mode.',
          },
          {
            label: 'Reset',
            description: 'Restores the default timestamp example.',
          },
          {
            label: 'Converted values',
            description:
              'Shows UTC, local time, seconds, and milliseconds output.',
          },
        ],
      },
    ],
  },
  'base64-encode-decode': {
    description:
      'Encode plain text into Base64 or decode Base64 text back into readable output.',
    steps: [
      'Choose whether you want to encode text or decode Base64.',
      'Paste or type the source content into the input box.',
      'Review the converted output on the right.',
      'Copy the output or reset the tool to start over.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Mode',
            description:
              'Switches between text-to-Base64 encoding and Base64-to-text decoding.',
          },
          {
            label: 'Input',
            description:
              'The source text or Base64 value that you want to convert.',
          },
          {
            label: 'Reset',
            description:
              'Restores the default example and switches back to encode mode.',
          },
          {
            label: 'Output',
            description:
              'Shows the converted value or a validation message if the input is not valid.',
          },
        ],
      },
    ],
  },
  'url-encoder-decoder': {
    description:
      'Encode full URL strings for safer sharing or decode encoded URL text back into a readable value.',
    steps: [
      'Choose whether you want to encode or decode the text.',
      'Paste the URL text or encoded value into the input area.',
      'Review the converted result in the output panel.',
      'Copy the output or reset the tool to start over.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Mode',
            description:
              'Switches between URL encoding and URL decoding in the same workspace.',
          },
          {
            label: 'Input',
            description:
              'The source URL text or encoded value that you want to convert.',
          },
          {
            label: 'Reset',
            description:
              'Restores the default example and switches back to encode mode.',
          },
          {
            label: 'Output',
            description:
              'Shows the converted value or a validation message if the encoded text is malformed.',
          },
        ],
      },
    ],
  },
  'uuid-generator-validator': {
    description:
      'Generate UUID values in common versions or validate one or more pasted UUID strings line by line.',
    steps: [
      'Use the Generate tab to choose a UUID version and the number of values to create.',
      'Create one UUID or a small batch, then copy individual values or the full list.',
      'Use the Validate tab to paste one or more UUIDs, one per line.',
      'Review the valid or invalid result and detected version for each pasted UUID.',
    ],
    fieldGroups: [
      {
        title: 'Generate',
        fields: [
          {
            label: 'UUID version',
            description:
              'Choose whether the generated values should use UUID v1, v4, or v7 format.',
          },
          {
            label: 'Quantity',
            description:
              'Controls how many UUIDs the tool generates in one batch.',
          },
          {
            label: 'Generate UUIDs',
            description:
              'Creates a fresh list of UUID values based on the selected version and quantity.',
          },
          {
            label: 'Copy / Copy All',
            description:
              'Lets you copy one UUID at a time or copy the full generated list together.',
          },
        ],
      },
      {
        title: 'Validate',
        fields: [
          {
            label: 'Paste one UUID per line',
            description:
              'Enter one or more UUID strings to check whether they are valid.',
          },
          {
            label: 'Validation results',
            description:
              'Shows whether each value is valid and, when valid, which UUID version it matches.',
          },
        ],
      },
    ],
  },
  'jwt-decoder': {
    description:
      'Decode JWT header and payload values, inspect common claims, and review timing fields without sending the token anywhere.',
    steps: [
      'Paste the full token into the JWT input area.',
      'Review the decoded header and payload sections on the right.',
      'Use the summary cards to inspect algorithm, issuer, subject, audience, and timing fields.',
      'Copy the decoded header or payload if you need to reuse it elsewhere.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'JWT token',
            description:
              'Accepts a full token with header, payload, and signature sections separated by dots.',
          },
          {
            label: 'Decoded token',
            description:
              'Shows the parsed header and payload data when the token format is valid.',
          },
          {
            label: 'Summary cards',
            description:
              'Highlight common token details such as algorithm, issuer, subject, audience, and time-based status.',
          },
          {
            label: 'Signature not verified',
            description:
              'Reminds you that this tool only decodes the token and does not perform cryptographic verification.',
          },
        ],
      },
    ],
  },
  'age-calculator': {
    description:
      'Calculate exact age between two dates and view the result in years, months, days, and total duration.',
    steps: [
      'Choose the date of birth.',
      'Set the date you want the age calculated against.',
      'Review the age summary and total duration breakdown.',
      'Use reset to return to the default example dates.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Date of birth',
            description: 'The starting date used for the age calculation.',
          },
          {
            label: 'Age as on',
            description:
              'The reference date used to measure the age or duration.',
          },
          {
            label: 'Reset',
            description: 'Restores the default example dates.',
          },
          {
            label: 'Result cards',
            description:
              'Show exact age in years, months, days, total months, and total days.',
          },
        ],
      },
    ],
  },
  'date-difference-calculator': {
    description:
      'Measure the exact difference between two dates and view the result in years, months, days, total days, and approximate weeks.',
    steps: [
      'Choose the start date and end date you want to compare.',
      'Review the exact calendar difference shown in years, months, and days.',
      'Check the total day count and approximate week count for a simpler duration summary.',
      'Use reset to return to the default example dates.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Start date',
            description: 'The beginning of the date range being measured.',
          },
          {
            label: 'End date',
            description: 'The final date used to complete the comparison.',
          },
          {
            label: 'Reset',
            description: 'Restores the default example dates.',
          },
          {
            label: 'Difference summary',
            description:
              'Shows the exact date difference plus the total days and approximate weeks.',
          },
        ],
      },
    ],
  },
  'business-days-calculator': {
    description:
      'Count business days, weekend days, and total days between two dates using a Monday-to-Friday workweek.',
    steps: [
      'Choose the start date and end date.',
      'Turn the include-start-date option on or off depending on how you want the count to begin.',
      'Review the business day, weekend day, and total day summary.',
      'Reset the tool if you want to start a new date range.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Start date',
            description:
              'The beginning of the date range used for the calculation.',
          },
          {
            label: 'End date',
            description: 'The last date included in the date range.',
          },
          {
            label: 'Include start date',
            description:
              'Controls whether the start date itself should be counted in the result.',
          },
          {
            label: 'Business day summary',
            description:
              'Shows business days, weekend days, total days, and an approximate week count.',
          },
        ],
      },
    ],
  },
  'weekend-left-calculator': {
    description:
      'Count how many Saturdays, Sundays, and full weekends remain in the current year from a selected date.',
    steps: [
      'Choose the reference date you want to start counting from.',
      'Review the number of Saturdays and Sundays left in that year.',
      'Check the full weekends total and the days left in the year.',
      'Use reset to return the tool to today’s date.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Reference date',
            description:
              'The date from which the remaining weekends in that calendar year are counted.',
          },
          {
            label: 'Reset',
            description: 'Restores the reference date to today.',
          },
          {
            label: 'Year-end snapshot',
            description:
              'Shows full weekends left, Saturday count, Sunday count, days left in the year, and the next weekend day.',
          },
        ],
      },
    ],
  },
  'bmi-calculator': {
    description:
      'Calculate body mass index using your height and weight and view the standard BMI category immediately.',
    steps: [
      'Choose whether you want to use metric or imperial units.',
      'Enter your height and weight in the selected unit system.',
      'Review the BMI value and the matching standard category.',
      'Use reset to return to the default BMI example.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Unit system',
            description:
              'Switches the calculator between metric and imperial height and weight inputs.',
          },
          {
            label: 'Height',
            description:
              'Enter height in centimeters for metric mode or feet and inches for imperial mode.',
          },
          {
            label: 'Weight',
            description:
              'Enter weight in kilograms for metric mode or pounds for imperial mode.',
          },
          {
            label: 'Reset',
            description: 'Restores the default BMI example values.',
          },
          {
            label: 'BMI result',
            description:
              'Shows the calculated BMI score and the corresponding standard category.',
          },
        ],
      },
    ],
  },
  'screen-time-impact-calculator': {
    description:
      'Convert average daily screen time into yearly hours, equivalent days, and a simple potential productivity-loss estimate.',
    steps: [
      'Enter the average number of screen hours per day.',
      'Review how that daily habit scales into yearly hours and full days.',
      'Use the potential productivity-loss estimate as a general behavior prompt.',
      'Reset the tool if you want to compare another daily screen-time level.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Daily screen time',
            description: 'The average number of screen hours used each day.',
          },
          {
            label: 'Reset',
            description: 'Restores the default screen-time example.',
          },
          {
            label: 'Impact snapshot',
            description:
              'Shows yearly hours, equivalent full days, and a simple potential productivity-loss estimate.',
          },
        ],
      },
    ],
  },
  'sitting-time-risk-calculator': {
    description:
      'Estimate a simple sedentary risk level from daily sitting time and get a suggested interval for standing up.',
    steps: [
      'Enter how many hours you usually spend sitting in a typical day.',
      'Review the simple sedentary risk level assigned to that range.',
      'Check the suggested stand-up interval in minutes.',
      'Use reset to return to the default sitting-time example.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Sitting time per day',
            description:
              'The number of hours spent seated during a typical day.',
          },
          {
            label: 'Reset',
            description: 'Restores the default sitting-time example.',
          },
          {
            label: 'Sedentary snapshot',
            description:
              'Shows the simple risk band, suggested stand-up frequency, and a short explanatory note.',
          },
        ],
      },
    ],
  },
  'heart-rate-zone-calculator': {
    description:
      'Estimate max heart rate and common training zones from age using a simple age-based formula.',
    steps: [
      'Enter your age.',
      'Review the estimated max heart rate value.',
      'Check the fat-burn, cardio, and peak zone ranges in beats per minute.',
      'Use reset to return to the default age example.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Age',
            description:
              'The age used to estimate max heart rate with the standard 220 minus age formula.',
          },
          {
            label: 'Reset',
            description: 'Restores the default age example.',
          },
          {
            label: 'Training zones',
            description:
              'Shows the estimated max heart rate and the fat-burn, cardio, and peak zone bpm ranges.',
          },
        ],
      },
    ],
  },
  'biological-age-calculator': {
    description:
      'Estimate a wellness-based biological age using your actual age, height, weight, and a few everyday habit inputs.',
    steps: [
      'Enter your chronological age and choose sex and unit system.',
      'Add height and weight so the tool can calculate BMI automatically.',
      'Choose smoking status, exercise level, sleep duration, alcohol intake, and stress level.',
      'Review the estimated biological age, age gap, BMI, and the habit factors that are helping or pushing the estimate older.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'Chronological age',
            description:
              'Your actual age today, used as the starting point for the estimate.',
          },
          {
            label: 'Sex',
            description:
              'Applies a small baseline adjustment in the simplified wellness model.',
          },
          {
            label: 'Unit system',
            description:
              'Switches body measurement inputs between metric and imperial modes.',
          },
          {
            label: 'Height and weight',
            description: 'Used to calculate BMI automatically inside the tool.',
          },
          {
            label: 'Smoking, exercise, sleep, alcohol, and stress',
            description:
              'These lifestyle inputs drive the simplified age adjustments in the estimate.',
          },
          {
            label: 'Reset',
            description:
              'Restores the calculator to its default example values.',
          },
          {
            label: 'Biological age estimate',
            description:
              'Shows the estimated wellness-based age, BMI, age gap, and the factors affecting the result.',
          },
        ],
      },
    ],
  },
  'pregnancy-due-date-calculator': {
    description:
      'Estimate due date, conception date, pregnancy progress, and time remaining based on the first day of the last period.',
    steps: [
      'Enter the first day of the last menstrual period.',
      'Review the estimated due date and conception date.',
      'Check the pregnancy progress, current stage, and days remaining.',
      'Use reset to return to the default example date.',
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: 'First day of last period',
            description:
              'The starting date used to estimate the pregnancy timeline.',
          },
          {
            label: 'Reset',
            description:
              'Restores the example date and clears the current scenario.',
          },
          {
            label: 'Estimated due date',
            description:
              'The projected delivery date based on the entered date.',
          },
          {
            label: 'Estimated conception date',
            description: 'A rough estimate of when conception likely occurred.',
          },
          {
            label: 'Pregnancy progress',
            description:
              'Shows how far along the pregnancy is as a progress value.',
          },
          {
            label: 'Current stage',
            description:
              'Summarizes the trimester or phase based on the current pregnancy length.',
          },
          {
            label: 'Days remaining',
            description:
              'An estimate of how many days remain until the due date.',
          },
        ],
      },
    ],
  },
}
