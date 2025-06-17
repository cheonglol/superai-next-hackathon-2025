export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://api.example.com",
  TIMEOUT: 10000,
  RETRIES: 3,
  ENDPOINTS: {
    REVIEWS: {
      ANALYTICS: "/reviews/analytics",
      EXPORT: "/reviews/export",
      KEYWORDS: "/reviews/keywords",
      PLATFORMS: "/reviews/platforms",
    },
  },
} as const;

export const REQUEST_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;
