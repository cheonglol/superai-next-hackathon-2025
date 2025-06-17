import { trendingMockApi } from "@/services/mockApi/trendingMockApi";
import type { TrendingAnalytics, TrendingFilters } from "@/types/trending";

export async function trendingContentLoader(filters?: TrendingFilters): Promise<TrendingAnalytics> {
  try {
    const defaultFilters: TrendingFilters = {
      category: "all",
      timeframe: "24hours",
      ...filters,
    };

    // In production, this would call the real API
    if (import.meta.env.PROD) {
      // TODO: Replace with real API call
      // return await apiService.getTrendingAnalytics(defaultFilters);
    }

    // Use mock data for development
    return await trendingMockApi.getTrendingAnalytics(defaultFilters);
  } catch (error) {
    console.error("Failed to load trending content:", error);
    throw new Error("Failed to load trending content");
  }
}
