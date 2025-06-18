import type { Notification, NotificationSettings } from "@/types/notifications";

export class NotificationsMockApi {
  async getNotifications(): Promise<Notification[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [
      {
        id: "1",
        type: "positive",
        title: "New 5-star review",
        message: "Amazing pasta dish!",
        time: "2 min ago",
        read: false,
        priority: "medium",
        actionUrl: "/review",
      },
      {
        id: "2",
        type: "warning",
        title: "Service feedback",
        message: "Slow service mentioned",
        time: "15 min ago",
        read: false,
        priority: "high",
        actionUrl: "/review",
      },
      {
        id: "3",
        type: "info",
        title: "Trending hashtag",
        message: "#foodie gaining traction",
        time: "1 hour ago",
        read: true,
        priority: "low",
        actionUrl: "/trending-content",
      },
      {
        id: "4",
        type: "positive",
        title: "Viral content alert",
        message: "Your TikTok video reached 100K views",
        time: "2 hours ago",
        read: true,
        priority: "medium",
        actionUrl: "/social-media-footprint",
      },
      {
        id: "5",
        type: "error",
        title: "API connection issue",
        message: "Unable to sync Instagram data",
        time: "3 hours ago",
        read: false,
        priority: "high",
      },
    ];
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      emailNotifications: true,
      pushNotifications: true,
      reviewAlerts: true,
      socialMediaAlerts: true,
      trendingAlerts: false,
    };
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return settings;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async markAsRead(_notificationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  async markAllAsRead(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}

export const notificationsMockApi = new NotificationsMockApi();
