export interface Notification {
  id: string;
  type: "positive" | "warning" | "info" | "error";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  priority: "low" | "medium" | "high";
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  reviewAlerts: boolean;
  socialMediaAlerts: boolean;
  trendingAlerts: boolean;
}
