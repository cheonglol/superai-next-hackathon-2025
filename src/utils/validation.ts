import type { ReviewsFilters } from "@/types/reviews";
import { TIME_PERIODS, COMPARISON_PERIODS } from "@/config/constants";

export function validateFilters(filters: ReviewsFilters): boolean {
  const validPeriods = TIME_PERIODS.map((p) => p.value);
  const validComparisons = COMPARISON_PERIODS.map((p) => p.value);

  return (validPeriods as readonly string[]).includes(filters.selectedPeriod) && (validComparisons as readonly string[]).includes(filters.comparisonPeriod);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}
