import { mockDataService } from "@/services/mockDataService";
import type { ReviewsAnalytics, ReviewsFilters } from "@/types/reviews";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function reviewAnalyticsLoader(_filters?: ReviewsFilters): Promise<ReviewsAnalytics> {
  try {
    // In production, this would call the real API
    if (import.meta.env.PROD) {
      // TODO: Replace with real API call
      // const defaultFilters: ReviewsFilters = {
      //   selectedPeriod: '12months',
      //   comparisonPeriod: 'previous12months',
      //   ...filters,
      // };
      // return await apiService.getReviewsAnalytics(defaultFilters);
    }

    // Use mock data for development
    return await mockDataService.getAnalytics();
  } catch (error) {
    console.error("Failed to load review analytics:", error);
    throw new Error("Failed to load review analytics");
  }
}
