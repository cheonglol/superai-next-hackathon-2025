import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchTrendingData, setCategory, setTimeframe } from "@/store/slices/trendingSlice";

export function useTrendingData() {
  const dispatch = useAppDispatch();
  const { hashtags, topics, viralContent, selectedCategory, selectedTimeframe, loading, error } = useAppSelector((state) => state.trending);

  const updateCategory = (category: string) => {
    dispatch(setCategory(category));
  };

  const updateTimeframe = (timeframe: string) => {
    dispatch(setTimeframe(timeframe));
  };

  const refetch = () => {
    dispatch(fetchTrendingData({ category: selectedCategory, timeframe: selectedTimeframe }));
  };

  useEffect(() => {
    dispatch(fetchTrendingData({ category: selectedCategory, timeframe: selectedTimeframe }));
  }, [dispatch, selectedCategory, selectedTimeframe]);

  return {
    hashtags,
    topics,
    viralContent,
    selectedCategory,
    selectedTimeframe,
    loading,
    error,
    updateCategory,
    updateTimeframe,
    refetch,
  };
}
