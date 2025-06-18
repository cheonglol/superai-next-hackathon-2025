import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchSocialMediaData, setTimeframe } from "@/store/slices/socialMediaSlice";

export function useSocialMediaData() {
  const dispatch = useAppDispatch();
  const { platforms, topPosts, metrics, selectedTimeframe, loading, error } = useAppSelector((state) => state.socialMedia);

  const updateTimeframe = (timeframe: string) => {
    dispatch(setTimeframe(timeframe));
  };

  const refetch = () => {
    dispatch(fetchSocialMediaData(selectedTimeframe));
  };

  useEffect(() => {
    dispatch(fetchSocialMediaData(selectedTimeframe));
  }, [dispatch, selectedTimeframe]);

  return {
    platforms,
    topPosts,
    metrics,
    selectedTimeframe,
    loading,
    error,
    updateTimeframe,
    refetch,
  };
}
