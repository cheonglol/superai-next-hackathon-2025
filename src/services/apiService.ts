import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import type { ReviewsAnalytics, ReviewsFilters } from "@/types/reviews";
import { API_CONFIG } from "@/config/api";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Handle unauthorized
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string {
    // In a real application, this would retrieve the token from secure storage
    return localStorage.getItem("authToken") || "";
  }

  private handleUnauthorized(): void {
    // Handle unauthorized access (redirect to login, clear tokens, etc.)
    localStorage.removeItem("authToken");
    // You could dispatch a logout action here
  }

  // Reviews API methods
  async getReviewsAnalytics(filters: ReviewsFilters): Promise<ReviewsAnalytics> {
    const params = {
      period: filters.selectedPeriod,
      comparison: filters.comparisonPeriod,
    };

    const response = await this.client.get<ReviewsAnalytics>(API_CONFIG.ENDPOINTS.REVIEWS.ANALYTICS, { params });

    return response.data;
  }

  async exportReviewsReport(filters: ReviewsFilters): Promise<Blob> {
    const params = {
      period: filters.selectedPeriod,
      comparison: filters.comparisonPeriod,
      format: "pdf",
    };

    const response = await this.client.get(API_CONFIG.ENDPOINTS.REVIEWS.EXPORT, {
      params,
      responseType: "blob",
    });

    return response.data;
  }

  // Social Media API methods
  async getSocialMediaData(timeframe: string) {
    const response = await this.client.get("/social-media/analytics", {
      params: { timeframe },
    });
    return response.data;
  }

  // Trending Content API methods
  async getTrendingData(category: string, timeframe: string) {
    const response = await this.client.get("/trending/analytics", {
      params: { category, timeframe },
    });
    return response.data;
  }
  // Generic HTTP methods
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

export const apiService = new ApiService();
