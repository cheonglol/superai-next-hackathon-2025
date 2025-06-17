export interface ReviewMetric {
  value: number;
  change: number;
  isPositive: boolean;
}

export interface CategoryRating {
  name: string;
  rating: number;
  trend: number;
  icon: string;
  color: string;
}

export interface KeywordData {
  word: string;
  sentiment: "positive" | "negative";
  count: number;
}

export interface PlatformData {
  name: string;
  reviews: number;
  rating: number;
  color: string;
}

export interface ReviewsAnalytics {
  overallMetrics: ReviewMetric;
  totalReviews: ReviewMetric;
  positiveMenuMentions: ReviewMetric;
  negativeMenuMentions: ReviewMetric;
  categoryRatings: CategoryRating[];
  platforms: PlatformData[];
  keywords: {
    food: KeywordData[];
    service: KeywordData[];
    ambience: KeywordData[];
    value: KeywordData[];
  };
}

export interface TimePeriod {
  value: string;
  label: string;
}

export interface ComparisonPeriod {
  value: string;
  label: string;
}

export interface ReviewsFilters {
  selectedPeriod: string;
  comparisonPeriod: string;
}
