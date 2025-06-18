import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchDashboardData } from "@/store/slices/dashboardSlice";

export function useDashboardData() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.dashboard);

  const refetch = () => {
    dispatch(fetchDashboardData());
  };

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}