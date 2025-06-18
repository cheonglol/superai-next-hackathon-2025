export interface SocialMediaPlatform {
  id: string;
  name: string;
  followers: number;
  engagement: number;
  posts: number;
  reach: number;
  color: string;
  growth: number;
  icon?: string;
}

export interface SocialMediaPost {
  id: string;
  platform: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  date: string;
  imageUrl?: string;
  videoUrl?: string;
  hashtags?: string[];
}

export interface SocialMediaMetrics {
  totalFollowers: number;
  totalReach: number;
  avgEngagement: number;
  totalPosts: number;
  growthRate: number;
  topHashtag: string;
}

export interface SocialMediaAnalytics {
  platforms: SocialMediaPlatform[];
  topPosts: SocialMediaPost[];
  metrics: SocialMediaMetrics;
  timeframe: string;
}

export interface SocialMediaFilters {
  timeframe: string;
  platforms?: string[];
  contentType?: "all" | "image" | "video" | "text";
}
