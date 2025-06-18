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

  // Financial Documents API methods
  async uploadFinancialDocument(file: File, documentType: string, branchId?: string): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    // Map document types to API format
    const apiDocumentType = documentType === "profitLoss" ? "income-statement" : documentType === "balanceSheet" ? "balance-sheet" : documentType;

    // Map branch IDs to API format
    const apiBranchId = branchId === "1" ? "restaurant-a" : branchId === "2" ? "restaurant-b" : branchId;

    // Add tags based on document type and branch
    const tags = ["financial", apiDocumentType];
    if (apiBranchId && apiBranchId !== "consolidated") {
      tags.push(apiBranchId);
    }
    tags.push(new Date().getFullYear().toString());

    formData.append("tags", JSON.stringify(tags));

    const response = await this.client.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async queryFinancialData(prompt: string, documentIds?: string[], tags?: string[]): Promise<any> {
    const payload: any = { prompt };

    if (documentIds && documentIds.length > 0) {
      payload.documentIds = documentIds;
    }

    if (tags && tags.length > 0) {
      payload.tags = tags;
    }

    const response = await this.client.post("/query", payload);
    return response.data;
  }

  async getFinancialDocuments(): Promise<any> {
    const response = await this.client.get("/documents");
    return response.data;
  }

  // New methods for Financial Insights with Prompt Engineering
  async getProfitabilityInsights(documentNames: string[], branchTags?: string[]): Promise<Record<string, unknown>> {
    const { profitabilityInsightsPrompt } = await import("../data/profitabilityInsightsPrompt");

    const payload: Record<string, unknown> = {
      prompt: profitabilityInsightsPrompt,
      userResponse: JSON.stringify({
        gross_margin: "string", // e.g., "65.0%"
        operating_margin: "string", // e.g., "25.0%"
        net_margin: "string", // e.g., "14.4%"
        ebitda_margin: "string", // e.g., "25.0%"
        return_on_assets: "string", // e.g., "18.7%"
        return_on_equity: "string", // e.g., "37.9%"
        industry_benchmarks: {
          gross_margin_benchmark: "string", // e.g., "60-70%"
          operating_margin_benchmark: "string", // e.g., "15-25%"
          net_margin_benchmark: "string", // e.g., "10-15%"
        },
        insights: "Array<{type: 'positive'|'warning'|'neutral', message: string, priority: 'high'|'medium'|'low'}>",
        recommendations:
          "Array<{category: 'pricing'|'cost_control'|'efficiency'|'growth', action: string, impact: 'high'|'medium'|'low', timeframe: string, difficulty: 'easy'|'medium'|'hard'}>",
      }),
    };

    // Use tags for document filtering (preferred method per backend API)
    if (branchTags && branchTags.length > 0) {
      payload.tags = branchTags;
    } else if (documentNames && documentNames.length > 0) {
      // Fallback to documentNames if no tags provided
      payload.documentNames = documentNames;
    }

    console.log("🚀 [Profitability] Sending API request with payload:", payload);

    const response = await this.client.post("/query", payload, {
      timeout: API_CONFIG.FINANCIAL_INSIGHTS_TIMEOUT,
    });

    console.log("📥 [Profitability] Raw API response:", response);
    console.log("📦 [Profitability] Response data:", response.data);

    return response.data;
  }

  async getWorkingCapitalInsights(documentNames: string[], branchTags?: string[]): Promise<any> {
    const { workingCapitalInsightsPrompt } = await import("../data/workingCapitalInsightsPrompt");

    const payload: any = {
      prompt: workingCapitalInsightsPrompt,
      userResponse: JSON.stringify({
        working_capital: "number", // e.g., 60000
        current_ratio: "string", // e.g., "2.33"
        quick_ratio: "string", // e.g., "1.56"
        cash_conversion_cycle: "number", // e.g., 54
        components: {
          accounts_receivable_days: "number", // e.g., 18
          inventory_days: "number", // e.g., 73
          accounts_payable_days: "number", // e.g., 37
        },
        ideal_ranges: {
          current_ratio_range: "string", // e.g., "1.5 - 3.0"
          quick_ratio_range: "string", // e.g., "1.0 - 1.5"
          cash_conversion_range: "string", // e.g., "30 - 60 days"
        },
        efficiency: {
          working_capital_ratio: "string", // e.g., "12.0%"
          cash_flow_efficiency: "'excellent'|'good'|'average'|'poor'",
          liquidity_status: "'strong'|'adequate'|'weak'|'critical'",
        },
        optimization_opportunities:
          "Array<{area: 'inventory'|'receivables'|'payables'|'cash_management', current_performance: string, target_improvement: string, potential_cash_impact: number, priority: 'high'|'medium'|'low', implementation_difficulty: 'easy'|'medium'|'hard', timeframe: string}>",
        insights: "Array<{type: 'positive'|'warning'|'critical'|'neutral', message: string, metric_affected: string, impact_level: 'high'|'medium'|'low'}>",
      }),
    };

    // Use tags for document filtering (preferred method per backend API)
    if (branchTags && branchTags.length > 0) {
      payload.tags = branchTags;
    } else if (documentNames && documentNames.length > 0) {
      // Fallback to documentNames if no tags provided
      payload.documentNames = documentNames;
    }

    const response = await this.client.post("/query", payload, {
      timeout: API_CONFIG.FINANCIAL_INSIGHTS_TIMEOUT,
    });
    return response.data;
  }

  async getFundingInsights(documentNames: string[], branchTags?: string[]): Promise<any> {
    const { fundingInsightsPrompt } = await import("../data/fundingInsightsPrompt");

    const payload: any = {
      prompt: fundingInsightsPrompt,
      userResponse: JSON.stringify({
        debt_to_equity_ratio: "string", // e.g., "1.03"
        debt_to_assets_ratio: "string", // e.g., "50.6%"
        equity_ratio: "string", // e.g., "49.4%"
        interest_coverage_ratio: "string", // e.g., "15.6x"
        debt_service_coverage_ratio: "string", // e.g., "4.5x"
        debt_profile: {
          total_debt: "number", // e.g., 150000
          long_term_debt: "number", // e.g., 150000
          short_term_debt: "number", // e.g., 0
          average_interest_rate: "string", // e.g., "5.3%"
          weighted_avg_maturity: "string", // e.g., "3.2 years"
        },
        benchmark_ranges: {
          debt_to_equity_ideal: "string", // e.g., "0.3 - 0.6"
          interest_coverage_minimum: "string", // e.g., "2.5x"
          debt_service_coverage_minimum: "string", // e.g., "1.25x"
        },
        risk_assessment: {
          overall_risk_level: "'low'|'moderate'|'high'|'critical'",
          liquidity_risk: "'low'|'moderate'|'high'|'critical'",
          leverage_risk: "'low'|'moderate'|'high'|'critical'",
          interest_rate_risk: "'low'|'moderate'|'high'|'critical'",
        },
        funding_capacity: {
          additional_debt_capacity: "number", // e.g., 75000
          debt_capacity_utilization: "string", // e.g., "66.7%"
          recommended_debt_ceiling: "number", // e.g., 225000
          equity_funding_need: "number", // e.g., 0
        },
        funding_recommendations:
          "Array<{strategy: 'refinance'|'debt_reduction'|'equity_injection'|'debt_restructure'|'maintain_current', description: string, priority: 'high'|'medium'|'low', estimated_savings: number, implementation_timeframe: string, risk_impact: 'reduces'|'maintains'|'increases'}>",
        insights:
          "Array<{type: 'positive'|'warning'|'critical'|'neutral', category: 'leverage'|'liquidity'|'cost_of_capital'|'risk_management', message: string, impact_level: 'high'|'medium'|'low', action_required: boolean}>",
      }),
    };

    // Use tags for document filtering (preferred method per backend API)
    if (branchTags && branchTags.length > 0) {
      payload.tags = branchTags;
    } else if (documentNames && documentNames.length > 0) {
      // Fallback to documentNames if no tags provided
      payload.documentNames = documentNames;
    }

    const response = await this.client.post("/query", payload, {
      timeout: API_CONFIG.FINANCIAL_INSIGHTS_TIMEOUT,
    });
    return response.data;
  }

  async getSensitivityAnalysis(documentNames: string[], branchTags?: string[]): Promise<any> {
    const { sensitivityAnalysisPrompt } = await import("../data/sensitivityAnalysisPrompt");

    const payload: any = {
      prompt: sensitivityAnalysisPrompt,
      userResponse: JSON.stringify({
        scenarios:
          "Array<{scenario_name: string, profit_impact: string, cash_flow_impact: string, probability: 'high'|'medium'|'low', timeframe: string, implementation_difficulty: 'easy'|'medium'|'hard', risk_level: 'low'|'medium'|'high'}>",
        top_opportunities: {
          profit_impact: "Array<{opportunity: string, estimated_impact: number, timeframe: string, confidence_level: 'high'|'medium'|'low', required_investment: number}>",
          cash_flow_impact: "Array<{opportunity: string, estimated_impact: number, timeframe: string, confidence_level: 'high'|'medium'|'low', required_investment: number}>",
        },
        implementation_matrix: {
          immediate_actions:
            "Array<{action: string, expected_outcome: string, success_probability: string, resource_requirement: 'low'|'medium'|'high', estimated_timeline: string}>",
          short_term_initiatives:
            "Array<{initiative: string, expected_outcome: string, success_probability: string, resource_requirement: 'low'|'medium'|'high', estimated_timeline: string}>",
          long_term_strategies:
            "Array<{strategy: string, expected_outcome: string, success_probability: string, resource_requirement: 'low'|'medium'|'high', estimated_timeline: string}>",
        },
        risk_factors: "Array<{risk_description: string, potential_impact: number, probability: 'high'|'medium'|'low', mitigation_strategy: string, monitoring_metric: string}>",
        insights:
          "Array<{type: 'opportunity'|'risk'|'optimization'|'strategic', priority: 'high'|'medium'|'low', insight: string, action_required: boolean, impact_potential: 'high'|'medium'|'low'}>",
        summary: {
          most_impactful_lever: "string",
          quickest_win: "string",
          highest_risk: "string",
          recommended_focus: "Array<string>",
        },
      }),
    };

    // Use tags for document filtering (preferred method per backend API)
    if (branchTags && branchTags.length > 0) {
      payload.tags = branchTags;
    } else if (documentNames && documentNames.length > 0) {
      // Fallback to documentNames if no tags provided
      payload.documentNames = documentNames;
    }

    const response = await this.client.post("/query", payload, {
      timeout: API_CONFIG.FINANCIAL_INSIGHTS_TIMEOUT,
    });
    return response.data;
  }

  async getValuationTool(documentNames: string[], branchTags?: string[]): Promise<any> {
    const { valuationToolPrompt } = await import("../data/valuationToolPrompt");

    const payload: any = {
      prompt: valuationToolPrompt,
      userResponse: JSON.stringify({
        current_metrics: {
          ebitda: "number", // e.g., 60000
          revenue: "number", // e.g., 500000
          net_income: "number", // e.g., 72000
          total_assets: "number", // e.g., 296000
          book_value: "number", // e.g., 146000
        },
        valuation_multiples: {
          ebitda_multiple_range: {
            low: "number", // e.g., 4.0
            high: "number", // e.g., 15.0
            current: "number", // e.g., 8.0
            industry_average: "number", // e.g., 7.5
          },
          revenue_multiple_range: {
            low: "number", // e.g., 0.8
            high: "number", // e.g., 3.2
            industry_average: "number", // e.g., 1.6
          },
          book_value_multiple_range: {
            low: "number", // e.g., 1.2
            high: "number", // e.g., 2.8
            industry_average: "number", // e.g., 2.0
          },
        },
        valuation_estimates: {
          ebitda_valuation: "number", // e.g., 480000
          revenue_valuation: "number", // e.g., 800000
          asset_valuation: "number", // e.g., 592000
          book_value_valuation: "number", // e.g., 292000
          weighted_average_valuation: "number", // e.g., 541000
        },
        industry_context: {
          industry_name: "string", // e.g., "Restaurant & Food Service"
          market_conditions: "'favorable'|'neutral'|'challenging'",
          growth_stage: "'startup'|'growth'|'mature'|'declining'",
          competitive_position: "'leader'|'strong'|'average'|'weak'",
          market_size: "'large'|'medium'|'small'|'niche'",
        },
        valuation_factors: {
          positive_factors: "Array<{factor: string, impact_level: 'high'|'medium'|'low', multiple_adjustment: string}>",
          negative_factors: "Array<{factor: string, impact_level: 'high'|'medium'|'low', multiple_adjustment: string}>",
        },
        value_enhancement_opportunities:
          "Array<{opportunity: string, impact_on_valuation: number, timeframe: string, difficulty: 'easy'|'medium'|'hard', priority: 'high'|'medium'|'low', required_investment: number, roi_estimate: string}>",
        market_comparables:
          "Array<{transaction_type: 'acquisition'|'ipo'|'private_sale'|'merger', company_description: string, ebitda_multiple: number, revenue_multiple: number, transaction_date: string, relevance_score: 'high'|'medium'|'low'}>",
        insights:
          "Array<{type: 'valuation_driver'|'market_factor'|'risk_factor'|'opportunity', priority: 'high'|'medium'|'low', insight: string, action_recommended: boolean, impact_on_value: 'positive'|'negative'|'neutral'}>",
        summary: {
          recommended_valuation_range: {
            low: "number", // e.g., 450000
            high: "number", // e.g., 650000
            most_likely: "number", // e.g., 541000
          },
          key_value_drivers: "Array<string>",
          immediate_actions: "Array<string>",
          valuation_methodology_notes: "string",
        },
      }),
    };

    // Use tags for document filtering (preferred method per backend API)
    if (branchTags && branchTags.length > 0) {
      payload.tags = branchTags;
    } else if (documentNames && documentNames.length > 0) {
      // Fallback to documentNames if no tags provided
      payload.documentNames = documentNames;
    }

    const response = await this.client.post("/query", payload, {
      timeout: API_CONFIG.FINANCIAL_INSIGHTS_TIMEOUT,
    });
    return response.data;
  }

  // Helper method to get document names for a specific branch
  async getDocumentNamesForBranch(branchKey: string): Promise<string[]> {
    console.log("🔍 [Documents] Getting documents for branch:", branchKey);

    const response = await this.getFinancialDocuments();
    console.log("📄 [Documents] Raw documents response:", response);

    if (response && response.success && response.data && response.data.documents) {
      const documents = response.data.documents;
      console.log("📋 [Documents] All available documents:", documents);

      // Filter documents for the specific branch
      const branchDocuments = documents.filter(
        (doc: any) =>
          doc.tags?.includes(branchKey) ||
          doc.tags?.includes(`${branchKey}`) ||
          (branchKey === "unknown" && !doc.tags?.some((tag: string) => ["restaurant-a", "restaurant-b", "1", "2"].includes(tag)))
      );

      console.log(`🎯 [Documents] Filtered documents for branch '${branchKey}':`, branchDocuments);

      // Extract document names/IDs
      const documentNames = branchDocuments.map((doc: any) => doc.name || doc.id || doc.filename).filter(Boolean);
      console.log("📝 [Documents] Final document names:", documentNames);

      return documentNames;
    }

    console.log("❌ [Documents] No documents found or invalid response structure");
    return [];
  }

  // Helper method to get branch tags for API calls
  getBranchTags(branchKey: string): string[] {
    const tags = ["financial"];

    if (branchKey && branchKey !== "unknown") {
      tags.push(branchKey);
    }

    // Add current year
    tags.push(new Date().getFullYear().toString());

    return tags;
  }
}

export const apiService = new ApiService();
