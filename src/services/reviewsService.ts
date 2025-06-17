import { apiService } from "./apiService";
import type { ReviewsAnalytics, ReviewsFilters } from "@/types/reviews";

export class ReviewsService {
  async getAnalytics(filters: ReviewsFilters): Promise<ReviewsAnalytics> {
    return apiService.getReviewsAnalytics(filters);
  }

  async exportReport(filters: ReviewsFilters): Promise<Blob> {
    return apiService.exportReviewsReport(filters);
  }
}

export const reviewsService = new ReviewsService();
