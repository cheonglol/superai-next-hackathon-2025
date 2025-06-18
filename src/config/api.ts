export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://hf3ifrfjgk.us-west-2.awsapprunner.com",
  TIMEOUT: 10000,
  FINANCIAL_INSIGHTS_TIMEOUT: 60000, // 60 seconds for complex AI analysis
  RETRIES: 3,
  ENDPOINTS: {
    REVIEWS: {
      ANALYTICS: "/reviews/analytics",
      EXPORT: "/reviews/export",
      KEYWORDS: "/reviews/keywords",
      PLATFORMS: "/reviews/platforms",
    },
    FINANCIALS: {
      UPLOAD: "/upload",
      QUERY: "/query",
      DOCUMENTS: "/documents",
      HEALTH: "/health",
      STATS: "/stats",
    },
  },
} as const;

export const REQUEST_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;
