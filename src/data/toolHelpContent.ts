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
