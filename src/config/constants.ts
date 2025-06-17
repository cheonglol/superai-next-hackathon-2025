export const TIME_PERIODS = [
  { value: "12months", label: "Last 12 Months" },
  { value: "6months", label: "Last 6 Months" },
  { value: "3months", label: "Last 3 Months" },
  { value: "1month", label: "Last Month" },
] as const;

export const COMPARISON_PERIODS = [
  { value: "previous12months", label: "vs Previous 12 Months" },
  { value: "previous6months", label: "vs Previous 6 Months" },
  { value: "samePeriodLastYear", label: "vs Same Period Last Year" },
] as const;

export const SENTIMENT_COLORS = {
  positive: {
    bg: "bg-green-100",
    text: "text-green-800",
    bar: "bg-green-500",
  },
  negative: {
    bg: "bg-red-100",
    text: "text-red-800",
    bar: "bg-red-500",
  },
} as const;

export const CATEGORY_COLORS = {
  food: "bg-orange-500",
  service: "bg-blue-500",
  ambience: "bg-purple-500",
  value: "bg-green-500",
} as const;
