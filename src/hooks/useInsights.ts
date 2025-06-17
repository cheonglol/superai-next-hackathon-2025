import { useEffect, useState } from "react";
import { insightsMockApi } from "@/services/mockApi/insightsMockApi";
import type { InsightsData } from "@/types/insights";

export function useInsights() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const insightsData = await insightsMockApi.getInsights();
      setData(insightsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load insights");
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
