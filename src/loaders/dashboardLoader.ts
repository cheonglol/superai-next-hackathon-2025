import { dashboardMockApi } from "@/services/mockApi/dashboardMockApi";
import type { DashboardData } from "@/types/dashboard";

export async function dashboardLoader(): Promise<DashboardData> {
  try {
    // In production, this would call the real API
    if (import.meta.env.PROD) {
      // TODO: Replace with real API call
      // return await apiService.getDashboardData();
    }

    // Use mock data for development
    return await dashboardMockApi.getDashboardData();
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
    throw new Error("Failed to load dashboard data");
  }
}
