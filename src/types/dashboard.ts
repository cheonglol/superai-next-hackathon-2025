export interface DashboardMetrics {
  overallRating: number;
  totalReviews: number;
  socialFollowers: number;
  monthlyReach: number;
}

export interface ActivityItem {
  id: string;
  type: "review" | "social" | "trending";
  platform: string;
  content: string;
  time: string;
  positive: boolean;
}

export interface QuickStat {
  title: string;
  value: string;
  description: string;
  linkTo: string;
  growth?: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentActivity: ActivityItem[];
  quickStats: QuickStat[];
}
