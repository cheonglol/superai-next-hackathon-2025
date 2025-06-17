import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchReviewsAnalytics, setFilters } from "@/store/slices/reviewsSlice";
import type { ReviewsFilters } from "@/types/reviews";

export function useReviewsData() {
  const dispatch = useAppDispatch();
  const { data, loading, error, filters } = useAppSelector((state) => state.reviews);

  const updateFilters = (newFilters: Partial<ReviewsFilters>) => {
    dispatch(setFilters(newFilters));
  };

  const refetch = () => {
    dispatch(fetchReviewsAnalytics(filters));
  };
  useEffect(() => {
    dispatch(fetchReviewsAnalytics(filters));
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
