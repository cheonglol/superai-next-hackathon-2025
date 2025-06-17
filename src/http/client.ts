import type { ApiResponse, ApiError, RequestConfig } from "@/types/api";
import { API_CONFIG, REQUEST_HEADERS } from "@/config/api";

class HttpClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultTimeout = API_CONFIG.TIMEOUT;
    this.defaultRetries = API_CONFIG.RETRIES;
  }

  private async makeRequest<T>(url: string, options: RequestInit & RequestConfig = {}): Promise<ApiResponse<T>> {
    const { timeout = this.defaultTimeout, retries = this.defaultRetries, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers: {
        ...REQUEST_HEADERS,
        ...fetchOptions.headers,
      },
      signal: controller.signal,
    };

    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseURL}${url}`, requestOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData: ApiError = await response.json().catch(() => ({
            message: "Network error occurred",
            code: "NETWORK_ERROR",
          }));
          throw new Error(errorData.message);
        }

        const data: ApiResponse<T> = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;
        if (attempt === retries) break;

        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    clearTimeout(timeoutId);
    throw lastError!;
  }

  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: "GET", ...config });
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: "DELETE", ...config });
  }
}

export const httpClient = new HttpClient();
