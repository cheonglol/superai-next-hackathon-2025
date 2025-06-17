import { httpClient } from '@/http/client';
import { API_CONFIG } from '@/config/api';
import type { ReviewsAnalytics, ReviewsFilters } from '@/types/reviews';
import type { ApiResponse } from '@/types/api';

export class ReviewsService {
  async getAnalytics(filters: ReviewsFilters): Promise<ReviewsAnalytics> {
    const params = new URLSearchParams({
      period: filters.selectedPeriod,
      comparison: filters.comparisonPeriod,
    });

    const response = await httpClient.get<ReviewsAnalytics>(
      `${API_CONFIG.ENDPOINTS.REVIEWS.ANALYTICS}?${params}`
    );

    return response.data;
  }

  async exportReport(filters: ReviewsFilters): Promise<Blob> {
    const params = new URLSearchParams({
      period: filters.selectedPeriod,
      comparison: filters.comparisonPeriod,
      format: 'pdf',
    });

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REVIEWS.EXPORT}?${params}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to export report');
    }

    return response.blob();
  }

  private getAuthToken(): string {
    // In a real application, this would retrieve the token from secure storage
    return localStorage.getItem('authToken') || '';
  }
}

export const reviewsService = new ReviewsService();