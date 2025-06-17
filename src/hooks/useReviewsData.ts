import { useState, useEffect } from 'react';
import type { ReviewsAnalytics, ReviewsFilters } from '@/types/reviews';
import { reviewsService } from '@/services/reviewsService';
import { mockDataService } from '@/services/mockDataService';

interface UseReviewsDataReturn {
  data: ReviewsAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useReviewsData(filters: ReviewsFilters): UseReviewsDataReturn {
  const [data, setData] = useState<ReviewsAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Use mock data for development, switch to real service for production
      const analytics = import.meta.env.DEV 
        ? await mockDataService.getAnalytics()
        : await reviewsService.getAnalytics(filters);
      
      setData(analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.selectedPeriod, filters.comparisonPeriod]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}