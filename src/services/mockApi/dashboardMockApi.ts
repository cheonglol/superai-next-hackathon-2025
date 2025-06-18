import type { DashboardData } from "@/types/dashboard";

export class DashboardMockApi {
  async getDashboardData(): Promise<DashboardData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      metrics: {
        overallRating: 4.2,
        totalReviews: 1247,
        socialFollowers: 42400,
        monthlyReach: 315000,
      },
      recentActivity: [
        {
          id: "1",
          type: "review",
          platform: "Google",
          content: 'New 5-star review: "Amazing food and excellent service!"',
          time: "2 hours ago",
          positive: true,
        },
        {
          id: "2",
          type: "social",
          platform: "Instagram",
          content: "Your pasta recipe post gained 1.2K likes",
          time: "4 hours ago",
          positive: true,
        },
        {
          id: "3",
          type: "trending",
          platform: "TikTok",
          content: "#foodie hashtag trending with your content",
          time: "6 hours ago",
          positive: true,
        },
        {
          id: "4",
          type: "review",
          platform: "TripAdvisor",
          content: "Review mentions slow service during peak hours",
          time: "8 hours ago",
          positive: false,
        },
      ],
      quickStats: [
        {
          title: "Overall Rating",
          value: "4.2/5",
          description: "Latest Rating",
          linkTo: "/review",
          growth: "+0.3",
        },
        {
          title: "Total Reviews",
          value: "1,247",
          description: "This Month: +89 reviews",
          linkTo: "/review",
          growth: "+12%",
        },
        {
          title: "Social Followers",
          value: "42.4K",
          description: "Engagement: +12.5%",
          linkTo: "/social-media-footprint",
          growth: "+8.5%",
        },
        {
          title: "Monthly Reach",
          value: "315K",
          description: "Top Hashtag: #foodie",
          linkTo: "/trending-content",
          growth: "+45.2%",
        },
      ],
    };
  }
}

export const dashboardMockApi = new DashboardMockApi();
