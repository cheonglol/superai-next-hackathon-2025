import type { ReviewsAnalytics } from "@/types/reviews";

export class MockDataService {
  async getAnalytics(): Promise<ReviewsAnalytics> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      overallMetrics: {
        value: 4.2,
        change: 0.3,
        isPositive: true,
      },
      totalReviews: {
        value: 1247,
        change: 12,
        isPositive: true,
      },
      positiveMenuMentions: {
        value: 623,
        change: 8,
        isPositive: true,
      },
      negativeMenuMentions: {
        value: 89,
        change: -15,
        isPositive: true,
      },
      categoryRatings: [
        {
          name: "Food Quality",
          rating: 4.3,
          trend: 0.2,
          icon: "ChefHat",
          color: "bg-orange-500",
        },
        {
          name: "Service",
          rating: 4.1,
          trend: -0.1,
          icon: "Users",
          color: "bg-blue-500",
        },
        {
          name: "Ambience",
          rating: 4.5,
          trend: 0.3,
          icon: "Heart",
          color: "bg-purple-500",
        },
        {
          name: "Value for Money",
          rating: 3.8,
          trend: -0.2,
          icon: "DollarSign",
          color: "bg-green-500",
        },
      ],
      platforms: [
        { name: "Google Reviews", reviews: 487, rating: 4.2, color: "bg-blue-600" },
        { name: "Facebook", reviews: 312, rating: 4.3, color: "bg-blue-800" },
        { name: "TripAdvisor", reviews: 248, rating: 4.1, color: "bg-green-600" },
        { name: "Chope", reviews: 200, rating: 4.4, color: "bg-red-500" },
      ],
      keywords: {
        food: [
          { word: "Delicious", sentiment: "positive", count: 234 },
          { word: "Fresh", sentiment: "positive", count: 189 },
          { word: "Cold", sentiment: "negative", count: 45 },
          { word: "Bland", sentiment: "negative", count: 23 },
        ],
        service: [
          { word: "Friendly", sentiment: "positive", count: 198 },
          { word: "Attentive", sentiment: "positive", count: 156 },
          { word: "Slow", sentiment: "negative", count: 67 },
          { word: "Rude", sentiment: "negative", count: 12 },
        ],
        ambience: [
          { word: "Cozy", sentiment: "positive", count: 145 },
          { word: "Romantic", sentiment: "positive", count: 89 },
          { word: "Noisy", sentiment: "negative", count: 78 },
          { word: "Dark", sentiment: "negative", count: 34 },
        ],
        value: [
          { word: "Affordable", sentiment: "positive", count: 167 },
          { word: "Worth it", sentiment: "positive", count: 123 },
          { word: "Overpriced", sentiment: "negative", count: 89 },
          { word: "Expensive", sentiment: "negative", count: 56 },
        ],
      },
    };
  }
}

export const mockDataService = new MockDataService();
