export interface TrendingHashtag {
  id: string;
  tag: string;
  mentions: number;
  growth: number;
  category: string;
  platforms: string[];
  sentiment: "positive" | "negative" | "neutral";
}

export interface TrendingTopic {
  id: string;
  topic: string;
  mentions: number;
  sentiment: "positive" | "negative" | "neutral";
  growth: number;
  platforms: string[];
  description: string;
  keywords: string[];
  relatedHashtags: string[];
}

export interface ViralContent {
  id: string;
  platform: string;
  content: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  growth: number;
  date: string;
  contentType: "image" | "video" | "text";
  url?: string;
  thumbnailUrl?: string;
}

export interface TrendingPost {
  id: string;
  platform: string;
  content: string;
  imageUrl: string;
  videoUrl?: string;
  author: string;
  authorAvatar: string;
  authorFollowers: number;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagement: number;
  viralScore: number;
  postUrl: string;
  createdAt: string;
  location?: string;
  hashtags: string[];
  contentType: "organic" | "paid" | "partnership";
  category: string;
  businessInsights: {
    keyTakeaways: string[];
    applicableStrategies: string[];
    estimatedCost?: string;
    difficulty: "Easy" | "Medium" | "Hard";
    roi: "Low" | "Medium" | "High";
  };
}

export interface ContentStrategy {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  expectedRoi: "Low" | "Medium" | "High";
  platforms: string[];
  keyMetrics: string[];
  successExamples: {
    restaurant: string;
    result: string;
    metric: string;
  }[];
  actionSteps: string[];
  requiredResources: string[];
}

export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  impact: "Low" | "Medium" | "High";
  urgency: "Low" | "Medium" | "High";
  category: "Trend" | "Opportunity" | "Threat" | "Innovation";
  dataPoints: {
    metric: string;
    value: string;
    change: string;
  }[];
  recommendations: string[];
  relatedPosts: string[];
}

export interface TrendingAnalytics {
  hashtags: TrendingHashtag[];
  topics: TrendingTopic[];
  viralContent: ViralContent[];
  category: string;
  timeframe: string;
}

export interface TrendingFilters {
  category: string;
  timeframe: string;
  sentiment?: "positive" | "negative" | "neutral" | "all";
  platform?: string;
}
