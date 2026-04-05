export type ToolCategory = {
  slug: string
  name: string
  description: string
  metaDescription: string
  intro: string
}

export const toolCategories: ToolCategory[] = [
  {
    slug: 'planning-tools',
    name: 'Planning Tools',
    description: 'Goal-based planning tools that help turn milestones into actionable savings plans.',
    metaDescription:
      'Browse ToolFerry planning tools to map future purchases and milestones into practical savings and investment plans.',
    intro:
      'Planning tools help users work backwards from a milestone or purchase and build a realistic route to achieve it.',
  },
  {
    slug: 'loan-calculators',
    name: 'Loan Calculators',
    description: 'Borrowing tools for understanding EMI, repayment cost, and affordability.',
    metaDescription:
      'Browse ToolFerry loan calculators to estimate EMI, repayment cost, and borrowing affordability before taking a loan.',
    intro:
      'Loan calculators help borrowers compare financing scenarios and understand how rates and tenure affect monthly payments.',
  },
  {
    slug: 'investment-calculators',
    name: 'Investment Calculators',
    description: 'Return calculators for fixed deposits, mutual funds, and other growth planning scenarios.',
    metaDescription:
      'Browse ToolFerry investment calculators to estimate FD maturity, mutual fund growth, SIP returns, and long-term savings outcomes.',
    intro:
      'Investment calculators help users test return assumptions, compare products, and plan longer-term wealth-building scenarios.',
  },
  {
    slug: 'business-tools',
    name: 'Business Tools',
    description: 'Tax and business utility tools for faster everyday calculations.',
    metaDescription:
      'Browse ToolFerry business tools for practical calculations such as GST breakdowns and other day-to-day work utilities.',
    intro:
      'Business tools simplify tax and money calculations that otherwise slow down quoting, billing, and pricing workflows.',
  },
  {
    slug: 'conversion-tools',
    name: 'Conversion Tools',
    description: 'Everyday conversion utilities for measurements, temperature, speed, storage, and more.',
    metaDescription:
      'Browse ToolFerry conversion tools for quick unit changes across common measurement categories.',
    intro:
      'Conversion tools reduce lookup friction by keeping common measurement changes available in one place.',
  },
  {
    slug: 'text-tools',
    name: 'Text Tools',
    description: 'Formatting and cleanup tools for transforming raw text quickly.',
    metaDescription:
      'Browse ToolFerry text tools to clean, format, transform, and restructure copied text more efficiently.',
    intro:
      'Text tools are useful when copied content needs cleanup, structure, or repeated formatting before being reused elsewhere.',
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    description: 'Utilities for inspecting and handling structured technical content such as JSON.',
    metaDescription:
      'Browse ToolFerry developer tools for JSON inspection and other technical utility workflows.',
    intro:
      'Developer tools focus on readability and manipulation of technical data so debugging and inspection are faster.',
  },
  {
    slug: 'date-tools',
    name: 'Date Tools',
    description: 'Date-based calculators for age, duration, and timeline estimation.',
    metaDescription:
      'Browse ToolFerry date tools to calculate age, date difference, and other time-based answers.',
    intro:
      'Date tools simplify exact date difference calculations for personal, administrative, and planning use cases.',
  },
  {
    slug: 'health-tools',
    name: 'Health Tools',
    description: 'Simple health-related planning calculators for due date and timeline estimation.',
    metaDescription:
      'Browse ToolFerry health tools for practical pregnancy date estimation and related planning support.',
    intro:
      'Health tools provide lightweight estimate-based planning aids that are helpful for day-to-day reference.',
  },
]

export const toolCategoryMap = Object.fromEntries(
  toolCategories.map((category) => [category.slug, category]),
) as Record<string, ToolCategory>
