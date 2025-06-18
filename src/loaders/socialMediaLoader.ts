import { socialMediaMockApi } from "@/services/mockApi/socialMediaMockApi";
import type { SocialMediaAnalytics, SocialMediaFilters } from "@/types/socialMedia";

export async function socialMediaLoader(filters?: SocialMediaFilters): Promise<SocialMediaAnalytics> {
  try {
    const defaultFilters: SocialMediaFilters = {
      timeframe: "30days",
      ...filters,
    };

    // In production, this would call the real API
    if (import.meta.env.PROD) {
      // TODO: Replace with real API call
      // return await apiService.getSocialMediaAnalytics(defaultFilters);
    }

    // Use mock data for development
    return await socialMediaMockApi.getSocialMediaAnalytics(defaultFilters);
  } catch (error) {
    console.error("Failed to load social media data:", error);
    throw new Error("Failed to load social media data");
  }
}
