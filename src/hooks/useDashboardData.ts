import { useEffect, useState } from "react";
import { dashboardMockApi } from "@/services/mockApi/dashboardMockApi";
import type { DashboardData } from "@/types/dashboard";

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In production, this would call the real API
      if (import.meta.env.PROD) {
        // TODO: Replace with real API call
        // const dashboardData = await apiService.getDashboardData();
      }

      // Use mock data for development
      const dashboardData = await dashboardMockApi.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refetch = () => {
    loadData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}