export type ToolHelpContent = {
  description: string;
  steps: string[];
  fieldGroups: Array<{
    title?: string;
    fields: Array<{
      label: string;
      description: string;
    }>;
  }>;
};

export const toolHelpContent: Record<string, ToolHelpContent> = {
  "goal-calculator": {
    description:
      "Plan a future purchase or milestone by comparing your current savings strategy against the goal cost and the timeline you have in mind.",
    steps: [
      "Choose a goal type, give the goal a clear name, and enter what it costs today.",
      "Set the time available, your current savings, and the amount you can invest every month.",
      "Adjust return and yearly step-up if you expect your monthly contribution to grow over time.",
      "Use the right-side summary and action cards to see whether you are on track and what to change if you are short.",
    ],
    fieldGroups: [
      {
        title: "Inputs",
        fields: [
          {
            label: "Goal type buttons",
            description:
              "Quickly switch between common goal categories like home, travel, education, or a custom goal.",
          },
          {
            label: "Goal name",
            description:
              "Adds a real label to the plan so the output feels tied to a specific purchase or milestone.",
          },
          {
            label: "Current cost of goal",
            description:
              "Enter what the goal would cost based on today’s estimate or current market price.",
          },
          {
            label: "Years to goal",
            description:
              "Set how long you have before you want to achieve the goal.",
          },
          {
            label: "Current savings",
            description:
              "Money you already have set aside for this goal today.",
          },
          {
            label: "Monthly contribution",
            description:
              "The amount you plan to add every month toward the goal.",
          },
          {
            label: "Expected return",
            description:
              "The yearly return assumption used to project how your savings may grow.",
          },
          {
            label: "Yearly step-up",
            description:
              "Increases the monthly contribution every year if you expect your savings ability to improve.",
          },
          {
            label: "Currency",
            description:
              "Changes the currency symbol and number formatting used throughout the tool.",
          },
        ],
      },
      {
        title: "Actions and results",
        fields: [
          {
            label: "Reset",
            description: "Restores the tool to its default example values.",
          },
          {
            label: "On track summary",
            description:
              "Shows whether your current plan is enough, close, or behind based on the projected value.",
          },
          {
            label: "Recommendation cards",
            description:
              "Suggest three catch-up paths: increase monthly savings, add a one-time amount, or accept a delay.",
          },
          {
            label: "Journey view chart",
            description:
              "Compares the projected portfolio value against the goal cost over time.",
          },
        ],
      },
    ],
  },
  "emi-calculator": {
    description:
      "Estimate your monthly EMI, total interest, and total payment for a loan using the amount, rate, and tenure.",
    steps: [
      "Enter the total loan amount you plan to borrow.",
      "Set the annual interest rate and choose the repayment tenure in years.",
      "Review the EMI summary, payment breakup, and balance chart to understand the loan cost.",
      "Reset if you want to compare a different borrowing scenario.",
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: "Loan amount",
            description: "The principal amount you want to borrow.",
          },
          {
            label: "Interest rate",
            description: "The annual loan interest rate used to calculate the EMI.",
          },
          {
            label: "Tenure",
            description: "How long you will take to repay the loan.",
          },
          {
            label: "Currency",
            description: "Changes the currency display for all loan results.",
          },
          {
            label: "Reset",
            description: "Restores the default EMI example values.",
          },
          {
            label: "Summary cards",
            description:
              "Show monthly EMI, total interest, total payment, and the borrowed amount.",
          },
          {
            label: "Charts",
            description:
              "Visualize how much goes toward principal, interest, and remaining balance over time.",
          },
        ],
      },
    ],
  },
  "fd-interest-calculator": {
    description:
      "Estimate fixed deposit maturity value, total interest earned, and yearly growth using your deposit amount, rate, tenure, and compounding frequency.",
    steps: [
      "Enter the deposit amount, annual interest rate, and tenure.",
      "Choose the compounding frequency and currency.",
      "Review the maturity value, returns, and inflation-adjusted view if needed.",
      "Use the growth chart to see how the FD builds year by year.",
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: "Deposit amount",
            description: "The lump sum amount placed into the fixed deposit.",
          },
          {
            label: "Interest rate",
            description: "The annual FD rate used for growth calculations.",
          },
          {
            label: "Tenure",
            description: "How long the fixed deposit stays invested.",
          },
          {
            label: "Inflation rate",
            description:
              "Used to show an inflation-adjusted value alongside the nominal FD maturity.",
          },
          {
            label: "Currency",
            description: "Changes the currency symbol and number format.",
          },
          {
            label: "Compounding",
            description:
              "Controls how often interest is added back into the deposit.",
          },
          {
            label: "Reset",
            description: "Restores the default FD example.",
          },
          {
            label: "Growth chart",
            description:
              "Shows invested amount, interest earned, nominal maturity value, and inflation-adjusted value over time.",
          },
        ],
      },
    ],
  },
  "mutual-fund-returns-calculator": {
    description:
      "Estimate mutual fund growth for one-time investing or SIP-based investing, with returns, total value, and inflation-adjusted output.",
    steps: [
      "Choose one-time or monthly SIP mode depending on how you plan to invest.",
      "Enter the investment amount, expected return, and time period.",
      "If you use SIP, optionally set a yearly step-up and inflation assumption.",
      "Review the total value, estimated returns, and the portfolio growth chart.",
    ],
    fieldGroups: [
      {
        title: "Modes and inputs",
        fields: [
          {
            label: "One-time / Monthly SIP",
            description:
              "Switch between a single lump-sum investment and recurring monthly investing.",
          },
          {
            label: "Total investment / Monthly investment",
            description:
              "Enter either the lump-sum amount or the monthly SIP amount, depending on the mode.",
          },
          {
            label: "Step-up each year",
            description:
              "Increase the SIP amount annually to reflect future income growth.",
          },
          {
            label: "Expected return rate",
            description:
              "Annual growth assumption used to estimate mutual fund returns.",
          },
          {
            label: "Time period",
            description: "How long the money stays invested.",
          },
          {
            label: "Inflation rate",
            description:
              "Used to show an inflation-adjusted version of the projected value.",
          },
          {
            label: "Currency",
            description: "Changes the currency display for the results.",
          },
          {
            label: "Reset",
            description: "Restores the default mutual fund example.",
          },
        ],
      },
      {
        title: "Results",
        fields: [
          {
            label: "Summary block",
            description:
              "Shows invested amount, estimated returns, total portfolio value, and inflation-adjusted value.",
          },
          {
            label: "Portfolio growth chart",
            description:
              "Compares invested amount, estimated returns, projected portfolio value, and inflation-adjusted value over time.",
          },
        ],
      },
    ],
  },
  "gst-calculator": {
    description:
      "Calculate GST for inclusive or exclusive pricing and instantly see the tax amount, base amount, and total payable.",
    steps: [
      "Enter the amount and choose the GST rate.",
      "Select whether the amount is tax-exclusive or tax-inclusive.",
      "Review the GST amount, final total, and CGST/SGST split.",
      "Change currency or reset to compare another tax scenario.",
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: "Amount",
            description:
              "The entered amount before or after GST, depending on the tax mode selected.",
          },
          {
            label: "GST rate",
            description: "The GST percentage used in the calculation.",
          },
          {
            label: "Tax mode",
            description:
              "Choose exclusive if GST should be added on top, or inclusive if GST is already inside the amount.",
          },
          {
            label: "Currency",
            description: "Changes how values are displayed across the tool.",
          },
          {
            label: "Reset",
            description: "Restores the default GST example.",
          },
          {
            label: "Result cards",
            description:
              "Show base amount, GST amount, total amount, and the CGST/SGST split.",
          },
        ],
      },
    ],
  },
  "unit-converter": {
    description:
      "Convert values between different units by selecting a category, source unit, destination unit, and amount.",
    steps: [
      "Choose the conversion category such as length, speed, temperature, or area.",
      "Enter the value you want to convert.",
      "Select the from-unit and to-unit, or use swap to reverse them quickly.",
      "Read the converted value and compare the unit symbols shown in the result area.",
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: "Category",
            description: "Selects the type of conversion you want to perform.",
          },
          {
            label: "Input value",
            description: "The number to convert from one unit to another.",
          },
          {
            label: "From unit",
            description: "The current unit of the value you entered.",
          },
          {
            label: "To unit",
            description: "The unit you want the value converted into.",
          },
          {
            label: "Swap",
            description: "Quickly flips the from-unit and to-unit.",
          },
          {
            label: "Reset",
            description: "Returns the converter to its default state.",
          },
        ],
      },
    ],
  },
  "text-formatter": {
    description:
      "Clean, transform, and reshape text using grouped actions such as case changes, cleanup, sorting, replacing, and format conversion.",
    steps: [
      "Paste or type your source text into the original text box.",
      "Choose a tool group and then select the action you want to apply.",
      "Fill in any helper fields such as find, replace, prefix, or suffix if the action needs them.",
      "Review the output, compare stats, and copy the transformed text when ready.",
    ],
    fieldGroups: [
      {
        title: "Controls",
        fields: [
          {
            label: "Tool group",
            description:
              "Filters actions into categories like case changes, cleanup, lines, convert, and replace.",
          },
          {
            label: "Action",
            description: "The exact transform applied to the source text.",
          },
          {
            label: "Find / Replace",
            description:
              "Used only for the find-and-replace action to search for one value and replace it with another.",
          },
          {
            label: "Case sensitive",
            description:
              "Controls whether find-and-replace should match exact letter casing.",
          },
          {
            label: "Prefix / Suffix",
            description:
              "Add a value before or after every line when those actions are selected.",
          },
          {
            label: "Reset",
            description: "Clears the current setup and restores default content.",
          },
          {
            label: "Copy",
            description: "Copies the transformed output to the clipboard.",
          },
        ],
      },
      {
        title: "Panels",
        fields: [
          {
            label: "Original text",
            description: "The input text that the tool transforms.",
          },
          {
            label: "Output",
            description:
              "Shows the transformed result after the selected action is applied.",
          },
          {
            label: "Stats summary",
            description:
              "Displays useful counts like characters, words, lines, and reading time.",
          },
        ],
      },
    ],
  },
  "json-viewer": {
    description:
      "Inspect raw JSON in a collapsible tree view, search through keys and values, and copy key/value data more easily.",
    steps: [
      "Paste valid JSON into the raw JSON input area.",
      "Use search to highlight matching keys or values and jump through the results.",
      "Expand or collapse the tree manually, or use the global expand and collapse buttons.",
      "Right-click a node if you want to copy a key, value, or key-value pair.",
    ],
    fieldGroups: [
      {
        title: "Top controls",
        fields: [
          {
            label: "Search JSON",
            description:
              "Searches both keys and values inside the parsed JSON tree.",
          },
          {
            label: "Previous / Next",
            description:
              "Move between matches found by the search input.",
          },
          {
            label: "Expand all / Collapse all",
            description:
              "Open or close all expandable JSON nodes at once.",
          },
          {
            label: "Format JSON",
            description:
              "Reformats valid JSON with clean indentation for easier reading.",
          },
          {
            label: "Reset",
            description: "Restores the sample JSON and clears search state.",
          },
        ],
      },
      {
        title: "Panels and tree",
        fields: [
          {
            label: "Raw JSON",
            description:
              "The editable JSON source used to generate the parsed tree view.",
          },
          {
            label: "Parsed tree",
            description:
              "The visual tree representation of the JSON structure.",
          },
          {
            label: "Plus / minus toggles",
            description:
              "Expand or collapse objects and arrays node by node.",
          },
          {
            label: "Context menu",
            description:
              "Lets you copy the selected key, value, or full key-value pair.",
          },
        ],
      },
    ],
  },
  "age-calculator": {
    description:
      "Calculate exact age between two dates and view the result in years, months, days, and total duration.",
    steps: [
      "Choose the date of birth.",
      "Set the date you want the age calculated against.",
      "Review the age summary and total duration breakdown.",
      "Use reset to return to the default example dates.",
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: "Date of birth",
            description: "The starting date used for the age calculation.",
          },
          {
            label: "Age as on",
            description:
              "The reference date used to measure the age or duration.",
          },
          {
            label: "Reset",
            description: "Restores the default example dates.",
          },
          {
            label: "Result cards",
            description:
              "Show exact age in years, months, days, total months, and total days.",
          },
        ],
      },
    ],
  },
  "pregnancy-due-date-calculator": {
    description:
      "Estimate due date, conception date, pregnancy progress, and time remaining based on the first day of the last period.",
    steps: [
      "Enter the first day of the last menstrual period.",
      "Review the estimated due date and conception date.",
      "Check the pregnancy progress, current stage, and days remaining.",
      "Use reset to return to the default example date.",
    ],
    fieldGroups: [
      {
        fields: [
          {
            label: "First day of last period",
            description:
              "The starting date used to estimate the pregnancy timeline.",
          },
          {
            label: "Reset",
            description: "Restores the example date and clears the current scenario.",
          },
          {
            label: "Estimated due date",
            description: "The projected delivery date based on the entered date.",
          },
          {
            label: "Estimated conception date",
            description:
              "A rough estimate of when conception likely occurred.",
          },
          {
            label: "Pregnancy progress",
            description:
              "Shows how far along the pregnancy is as a progress value.",
          },
          {
            label: "Current stage",
            description:
              "Summarizes the trimester or phase based on the current pregnancy length.",
          },
          {
            label: "Days remaining",
            description:
              "An estimate of how many days remain until the due date.",
          },
        ],
      },
    ],
  },
};
