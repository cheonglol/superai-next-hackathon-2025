import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchInsights } from "@/store/slices/insightsSlice";

export function useInsights() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.insights);

  const refetch = () => {
    dispatch(fetchInsights());
  };

  useEffect(() => {
    dispatch(fetchInsights());
  }, [dispatch]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}