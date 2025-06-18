// Financial Insights Service - Integration Layer for Prompt Engineering
// This service demonstrates how to use the new API methods with your prompt templates

import { apiService } from "./apiService";
import type { ProfitabilityInsightsResponse } from "../data/profitabilityInsightsPrompt";
import type { WorkingCapitalInsightsResponse } from "../data/workingCapitalInsightsPrompt";
import type { FundingInsightsResponse } from "../data/fundingInsightsPrompt";
import type { SensitivityAnalysisResponse } from "../data/sensitivityAnalysisPrompt";
import type { ValuationToolResponse } from "../data/valuationToolPrompt";

export class FinancialInsightsService {
  // Helper function to safely extract response data
  private extractResponseData(response: unknown): string | null {
    if (
      response &&
      typeof response === "object" &&
      response !== null &&
      "success" in response &&
      response.success &&
      "data" in response &&
      response.data &&
      typeof response.data === "object" &&
      response.data !== null &&
      "response" in response.data &&
      typeof response.data.response === "string"
    ) {
      return response.data.response;
    }
    return null;
  }
  /**
   * Get Profitability Insights for a specific branch
   * @param branchKey - The branch identifier (e.g., 'restaurant-a', 'restaurant-b')
   * @returns Parsed profitability insights data
   */
  async getProfitabilityInsights(branchKey: string): Promise<ProfitabilityInsightsResponse | null> {
    try {
      // Get document names for the branch
      const documentNames = await apiService.getDocumentNamesForBranch(branchKey);

      if (documentNames.length === 0) {
        console.warn(`No documents found for branch: ${branchKey}`);
        return null;
      }

      // Get branch tags for filtering
      const branchTags = apiService.getBranchTags(branchKey);

      // Call the API with prompt engineering
      const response = await apiService.getProfitabilityInsights(documentNames, branchTags);

      // Parse the JSON response
      const responseData = this.extractResponseData(response);
      if (responseData) {
        return JSON.parse(responseData) as ProfitabilityInsightsResponse;
      }

      return null;
    } catch (error) {
      console.error("Error getting profitability insights:", error);
      return null;
    }
  }

  /**
   * Get Working Capital Insights for a specific branch
   */
  async getWorkingCapitalInsights(branchKey: string): Promise<WorkingCapitalInsightsResponse | null> {
    try {
      const documentNames = await apiService.getDocumentNamesForBranch(branchKey);

      if (documentNames.length === 0) {
        console.warn(`No documents found for branch: ${branchKey}`);
        return null;
      }

      const branchTags = apiService.getBranchTags(branchKey);
      const response = await apiService.getWorkingCapitalInsights(documentNames, branchTags);

      const responseData = this.extractResponseData(response);
      if (responseData) {
        return JSON.parse(responseData) as WorkingCapitalInsightsResponse;
      }

      return null;
    } catch (error) {
      console.error("Error getting working capital insights:", error);
      return null;
    }
  }

  /**
   * Get Funding Insights for a specific branch
   */
  async getFundingInsights(branchKey: string): Promise<FundingInsightsResponse | null> {
    try {
      const documentNames = await apiService.getDocumentNamesForBranch(branchKey);

      if (documentNames.length === 0) {
        console.warn(`No documents found for branch: ${branchKey}`);
        return null;
      }

      const branchTags = apiService.getBranchTags(branchKey);
      const response = await apiService.getFundingInsights(documentNames, branchTags);

      const responseData = this.extractResponseData(response);
      if (responseData) {
        return JSON.parse(responseData) as FundingInsightsResponse;
      }

      return null;
    } catch (error) {
      console.error("Error getting funding insights:", error);
      return null;
    }
  }

  /**
   * Get Sensitivity Analysis for a specific branch
   */
  async getSensitivityAnalysis(branchKey: string): Promise<SensitivityAnalysisResponse | null> {
    try {
      const documentNames = await apiService.getDocumentNamesForBranch(branchKey);

      if (documentNames.length === 0) {
        console.warn(`No documents found for branch: ${branchKey}`);
        return null;
      }

      const branchTags = apiService.getBranchTags(branchKey);
      const response = await apiService.getSensitivityAnalysis(documentNames, branchTags);

      const responseData = this.extractResponseData(response);
      if (responseData) {
        return JSON.parse(responseData) as SensitivityAnalysisResponse;
      }

      return null;
    } catch (error) {
      console.error("Error getting sensitivity analysis:", error);
      return null;
    }
  }

  /**
   * Get Valuation Tool data for a specific branch
   */
  async getValuationTool(branchKey: string): Promise<ValuationToolResponse | null> {
    try {
      const documentNames = await apiService.getDocumentNamesForBranch(branchKey);

      if (documentNames.length === 0) {
        console.warn(`No documents found for branch: ${branchKey}`);
        return null;
      }

      const branchTags = apiService.getBranchTags(branchKey);
      const response = await apiService.getValuationTool(documentNames, branchTags);

      const responseData = this.extractResponseData(response);
      if (responseData) {
        return JSON.parse(responseData) as ValuationToolResponse;
      }

      return null;
    } catch (error) {
      console.error("Error getting valuation tool data:", error);
      return null;
    }
  }

  /**
   * Get all insights for a specific branch (useful for processing screen)
   */
  async getAllInsights(branchKey: string) {
    const [profitabilityInsights, workingCapitalInsights, fundingInsights, sensitivityAnalysis, valuationTool] = await Promise.allSettled([
      this.getProfitabilityInsights(branchKey),
      this.getWorkingCapitalInsights(branchKey),
      this.getFundingInsights(branchKey),
      this.getSensitivityAnalysis(branchKey),
      this.getValuationTool(branchKey),
    ]);

    return {
      profitabilityInsights: profitabilityInsights.status === "fulfilled" ? profitabilityInsights.value : null,
      workingCapitalInsights: workingCapitalInsights.status === "fulfilled" ? workingCapitalInsights.value : null,
      fundingInsights: fundingInsights.status === "fulfilled" ? fundingInsights.value : null,
      sensitivityAnalysis: sensitivityAnalysis.status === "fulfilled" ? sensitivityAnalysis.value : null,
      valuationTool: valuationTool.status === "fulfilled" ? valuationTool.value : null,
    };
  }
}

// Export a singleton instance
export const financialInsightsService = new FinancialInsightsService();

// Example usage in your components:
/*
import { financialInsightsService } from '@/services/financialInsightsService';

// In your component:
const handleBranchSelection = async (branchKey: string) => {
  setIsProcessing(true);
  
  try {
    // Get all insights for the selected branch
    const insights = await financialInsightsService.getAllInsights(branchKey);
    
    // Use the structured data in your components
    if (insights.profitabilityInsights) {
      console.log('Gross Margin:', insights.profitabilityInsights.gross_margin);
      console.log('Insights:', insights.profitabilityInsights.insights);
    }
    
    // Set the data to your component state
    setInsightsData(insights);
    
  } catch (error) {
    console.error('Error fetching insights:', error);
  } finally {
    setIsProcessing(false);
  }
};

// For individual tab data:
const getProfitabilityData = async (branchKey: string) => {
  const data = await financialInsightsService.getProfitabilityInsights(branchKey);
  if (data) {
    // Use the typed data
    console.log('Recommendations:', data.recommendations);
    data.insights.forEach(insight => {
      console.log(`${insight.type}: ${insight.message}`);
    });
  }
};
*/
