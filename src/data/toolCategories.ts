export type ToolCategory = {
  slug: string
  name: string
  description: string
  metaDescription: string
  intro: string
  homeSummary?: string
}

export const toolCategories: ToolCategory[] = [
  {
    slug: 'finance',
    name: 'Finance',
    description:
      'Money tools for planning goals, comparing loans, tracking returns, handling GST, and solving everyday financial calculations.',
    metaDescription:
      'Browse ToolFerry finance tools for goals, loans, investments, GST, and practical money calculations from one place.',
    intro:
      'Finance tools bring money planning, borrowing, investing, tax calculation, and pricing math into one easier-to-browse destination.',
    homeSummary:
      'Loans, investing, tax, pricing, and money-planning tools in one category.',
  },
  {
    slug: 'health-tools',
    name: 'Health',
    description:
      'Simple health-related planning calculators for due date and timeline estimation.',
    metaDescription:
      'Browse ToolFerry health tools for practical pregnancy date estimation and related planning support.',
    intro:
      'Health tools provide lightweight estimate-based planning aids that are helpful for day-to-day reference.',
    homeSummary:
      'Macro, meal, body, and everyday health calculators in one category.',
  },
  {
    slug: 'conversion-tools',
    name: 'Conversion',
    description:
      'Everyday conversion utilities for measurements, temperature, speed, storage, and more.',
    metaDescription:
      'Browse ToolFerry conversion tools for quick unit changes across common measurement categories.',
    intro:
      'Conversion tools reduce lookup friction by keeping common measurement changes available in one place.',
    homeSummary:
      'Fast unit conversions across measurement, storage, speed, and temperature.',
  },
  {
    slug: 'developer-tools',
    name: 'Developer',
    description:
      'Utilities for inspecting and handling structured technical content such as JSON.',
    metaDescription:
      'Browse ToolFerry developer tools for JSON inspection and other technical utility workflows.',
    intro:
      'Developer tools focus on readability and manipulation of technical data so debugging and inspection are faster.',
    homeSummary:
      'Technical utilities for inspecting and working with structured data.',
  },
  {
    slug: 'date-tools',
    name: 'Date',
    description:
      'Date-based calculators for age, duration, and timeline estimation.',
    metaDescription:
      'Browse ToolFerry date tools to calculate age, date difference, and other time-based answers.',
    intro:
      'Date tools simplify exact date difference calculations for personal, administrative, and planning use cases.',
    homeSummary:
      'Age, duration, and date-gap tools for everyday date calculations.',
  },
  {
    slug: 'utilities',
    name: 'Utilities',
    description:
      'General-purpose utility tools for common everyday tasks and quick workflow support.',
    metaDescription:
      'Browse ToolFerry utilities for practical tools that help with common tasks and lightweight workflow needs.',
    intro:
      'Utilities bring together lightweight tools that do not fit neatly into a single specialist category but are still useful in day-to-day workflows.',
    homeSummary: 'Practical general-purpose tools for quick everyday tasks.',
  },
]

export const toolCategoryMap = Object.fromEntries(
  toolCategories.map((category) => [category.slug, category])
) as Record<string, ToolCategory>
