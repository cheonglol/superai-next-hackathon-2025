export interface QuickInsight {
  id: string;
  icon: string;
  title: string;
  value: string;
  description: string;
  positive: boolean;
  trend: number;
  category: "reviews" | "social" | "trending";
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: "improvement" | "opportunity" | "warning";
  estimatedImpact: string;
  timeToComplete: string;
}

export interface InsightsData {
  quickInsights: QuickInsight[];
  actionItems: ActionItem[];
  lastUpdated: string;
}
