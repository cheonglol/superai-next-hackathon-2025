import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchFinancialData, setFilters } from "@/store/slices/financialsSlice";
import type { FinancialsFilters } from "@/types/financials";

export function useFinancialsData() {
  const dispatch = useAppDispatch();
  const { data, loading, error, filters } = useAppSelector((state) => state.financials);

  const updateFilters = (newFilters: Partial<FinancialsFilters>) => {
    dispatch(setFilters(newFilters));
  };

  const refetch = () => {
    dispatch(fetchFinancialData(filters));
  };

  useEffect(() => {
    dispatch(fetchFinancialData(filters));
  }, [dispatch, filters]);

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refetch,
  };
}