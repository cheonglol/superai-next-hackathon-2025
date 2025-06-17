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
