import type { InsightsData } from "@/types/insights";

export class InsightsMockApi {
  async getInsights(): Promise<InsightsData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      quickInsights: [
        {
          id: "1",
          icon: "TrendingUp",
          title: "Rating Trend",
          value: "+0.3",
          description: "This month vs last",
          positive: true,
          trend: 0.3,
          category: "reviews",
        },
        {
          id: "2",
          icon: "MessageCircle",
          title: "Review Volume",
          value: "+12%",
          description: "New reviews",
          positive: true,
          trend: 12,
          category: "reviews",
        },
        {
          id: "3",
          icon: "Zap",
          title: "Viral Content",
          value: "125K",
          description: "Views on TikTok",
          positive: true,
          trend: 234.5,
          category: "social",
        },
        {
          id: "4",
          icon: "Users",
          title: "Follower Growth",
          value: "+8.7%",
          description: "Across all platforms",
          positive: true,
          trend: 8.7,
          category: "social",
        },
        {
          id: "5",
          icon: "Hash",
          title: "Trending Hashtags",
          value: "6",
          description: "Currently trending",
          positive: true,
          trend: 45.2,
          category: "trending",
        },
      ],
      actionItems: [
        {
          id: "1",
          title: "Address Service Speed",
          description: "Peak hour complaints up 15%",
          priority: "high",
          category: "improvement",
          estimatedImpact: "High",
          timeToComplete: "2-3 weeks",
        },
        {
          id: "2",
          title: "Leverage Viral Content",
          description: "Pasta recipe trending on TikTok",
          priority: "medium",
          category: "opportunity",
          estimatedImpact: "Medium",
          timeToComplete: "1 week",
        },
        {
          id: "3",
          title: "Optimize Posting Schedule",
          description: "Engagement peaks at 7-9 PM",
          priority: "low",
          category: "opportunity",
          estimatedImpact: "Low",
          timeToComplete: "Immediate",
        },
        {
          id: "4",
          title: "Monitor Negative Sentiment",
          description: "Price complaints increasing",
          priority: "medium",
          category: "warning",
          estimatedImpact: "Medium",
          timeToComplete: "1-2 weeks",
        },
      ],
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const insightsMockApi = new InsightsMockApi();
