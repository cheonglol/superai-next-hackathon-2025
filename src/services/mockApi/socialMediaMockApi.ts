import type { SocialMediaAnalytics, SocialMediaFilters } from "@/types/socialMedia";

export class SocialMediaMockApi {
  async getSocialMediaAnalytics(filters: SocialMediaFilters): Promise<SocialMediaAnalytics> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      platforms: [
        {
          id: "1",
          name: "Instagram",
          followers: 12500,
          engagement: 4.2,
          posts: 45,
          reach: 89000,
          color: "bg-pink-500",
          growth: 8.5,
          icon: "Instagram",
        },
        {
          id: "2",
          name: "Facebook",
          followers: 8900,
          engagement: 3.1,
          posts: 32,
          reach: 67000,
          color: "bg-blue-600",
          growth: 5.2,
          icon: "Facebook",
        },
        {
          id: "3",
          name: "TikTok",
          followers: 15600,
          engagement: 6.8,
          posts: 28,
          reach: 125000,
          color: "bg-black",
          growth: 15.3,
          icon: "Music",
        },
        {
          id: "4",
          name: "Twitter",
          followers: 5400,
          engagement: 2.9,
          posts: 67,
          reach: 34000,
          color: "bg-blue-400",
          growth: 3.1,
          icon: "Twitter",
        },
      ],
      topPosts: [
        {
          id: "1",
          platform: "Instagram",
          content: "Behind the scenes: Our chef preparing the signature pasta dish",
          likes: 1250,
          comments: 89,
          shares: 45,
          reach: 15600,
          date: "2025-01-14",
          hashtags: ["#pasta", "#chef", "#behindthescenes"],
        },
        {
          id: "2",
          platform: "TikTok",
          content: "Quick recipe: 30-second pasta hack that will blow your mind!",
          likes: 3400,
          comments: 234,
          shares: 567,
          reach: 45000,
          date: "2025-01-13",
          hashtags: ["#recipe", "#pasta", "#foodhack"],
        },
        {
          id: "3",
          platform: "Facebook",
          content: "Customer spotlight: Amazing review from Sarah about her dining experience",
          likes: 890,
          comments: 67,
          shares: 123,
          reach: 12000,
          date: "2025-01-12",
          hashtags: ["#customer", "#review", "#dining"],
        },
      ],
      metrics: {
        totalFollowers: 42400,
        totalReach: 315000,
        avgEngagement: 4.25,
        totalPosts: 172,
        growthRate: 8.7,
        topHashtag: "#foodie",
      },
      timeframe: filters.timeframe,
    };
  }
}

export const socialMediaMockApi = new SocialMediaMockApi();
