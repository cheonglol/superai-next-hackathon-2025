import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { API_CONFIG } from "@/config/api";

/**
 * Brightdata API client for Instagram and Facebook data scraping
 */
class BrightdataApi {
  private client: AxiosInstance;

  /**
   * Initialize the Brightdata API client
   * @param baseURL Base URL of the Brightdata service
   */
  constructor(baseURL: string = "/api/brightdata") {
    this.client = axios.create({
      baseURL,
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
    return localStorage.getItem("authToken") || "";
  }

  private handleUnauthorized(): void {
    localStorage.removeItem("authToken");
    // You could dispatch a logout action here
  }

  // Generic HTTP methods
  async get<T>(url: string, params?: Record<string, unknown>): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, { params });
  }

  async post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data);
  }

  // Queue endpoints
  queueInstagramProfiles(urls: string[]): Promise<AxiosResponse<{ message: string; taskId: string }>> {
    return this.client.post("/queue/instagram/profiles", { urls });
  }

  getTaskStatus(taskId: string): Promise<AxiosResponse> {
    return this.client.get(`/queue/status/${taskId}`);
  }

  getTaskResult(taskId: string): Promise<AxiosResponse> {
    return this.client.get(`/queue/result/${taskId}`);
  }

  // Monitoring endpoints
  fetchMonitoringProgress(): Promise<AxiosResponse> {
    return this.client.get("/monitor/progress");
  }

  fetchMonitoringSnapshot(): Promise<AxiosResponse> {
    return this.client.get("/monitor/snapshot");
  }

  fetchMonitoringSnapshots(): Promise<AxiosResponse> {
    return this.client.get("/monitor/snapshots");
  }

  // Facebook reviews endpoint example
  fetchFacebookReviews(params: { url: string; num_of_reviews: number }): Promise<AxiosResponse> {
    return this.client.post("/facebook/reviews", params);
  }
}

// Create and export a singleton instance with default configuration
export const brightdataApi = new BrightdataApi();

// Also export the class for custom instantiation
export default BrightdataApi;
