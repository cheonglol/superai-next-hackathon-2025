import React from "react";
import { TrendingUp, BarChart3, PieChart } from "lucide-react";

interface FundingInsightsData {
  debt_to_equity_ratio?: string;
  debt_to_assets_ratio?: string;
  interest_coverage_ratio?: string;
  debt_service_coverage_ratio?: string;
  equity_ratio?: string;
  funding_recommendations?: Array<{
    strategy: string;
    description: string;
    priority: string;
  }>;
}

interface FundingInsightsProps {
  mockFinancialData?: {
    totalLiabilities: number;
    equity: number;
    totalAssets: number;
    longTermDebt: number;
    ebitda: number;
    interestExpense: number;
  };
  apiData?: FundingInsightsData;
  formatCurrency: (amount: number) => string;
  formatPercentage: (value: number) => string;
}

const FundingInsights: React.FC<FundingInsightsProps> = ({ mockFinancialData, apiData, formatCurrency, formatPercentage }) => {
  // Use API data if available, otherwise calculate from mock data, or use defaults
  const fundingMetrics = apiData
    ? {
        debtToEquity: parseFloat(apiData.debt_to_equity_ratio || "0"),
        debtToAssets: parseFloat(apiData.debt_to_assets_ratio?.replace("%", "") || "0"),
        interestCoverage: parseFloat(apiData.interest_coverage_ratio?.replace("x", "") || "0"),
        debtServiceCoverage: parseFloat(apiData.debt_service_coverage_ratio?.replace("x", "") || "0"),
        equityRatio: parseFloat(apiData.equity_ratio?.replace("%", "") || "0"),
      }
    : mockFinancialData
      ? {
          debtToEquity: mockFinancialData.totalLiabilities / mockFinancialData.equity,
          debtToAssets: (mockFinancialData.totalLiabilities / mockFinancialData.totalAssets) * 100,
          interestCoverage: mockFinancialData.ebitda / mockFinancialData.interestExpense,
          debtServiceCoverage: mockFinancialData.ebitda / (mockFinancialData.interestExpense + 20000), // Assuming principal payments
          equityRatio: (mockFinancialData.equity / mockFinancialData.totalAssets) * 100,
        }
      : {
          debtToEquity: 0,
          debtToAssets: 0,
          interestCoverage: 0,
          debtServiceCoverage: 0,
          equityRatio: 0,
        };

  // Get funding recommendations from API data or use defaults
  const fundingRecommendations = apiData?.funding_recommendations || [
    { strategy: "maintain_current", description: "Strong interest coverage indicates low financial risk", priority: "high" },
    { strategy: "refinance", description: "Consider refinancing at lower rates if available", priority: "medium" },
    { strategy: "maintain_current", description: "Maintain current debt levels for optimal leverage", priority: "medium" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Debt-to-Equity</h3>
            <TrendingUp className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">{fundingMetrics.debtToEquity.toFixed(2)}</div>
          <p className="text-sm text-gray-600">Ideal range: 0.3 - 0.6</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Interest Coverage</h3>
            <BarChart3 className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">{fundingMetrics.interestCoverage.toFixed(1)}x</div>
          <p className="text-sm text-gray-600">Minimum recommended: 2.5x</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Equity Ratio</h3>
            <PieChart className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{formatPercentage(fundingMetrics.equityRatio)}</div>
          <p className="text-sm text-gray-600">Higher is generally better</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Debt Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Debt-to-Assets</span>
              <span className="font-semibold">{formatPercentage(fundingMetrics.debtToAssets)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Debt Service Coverage</span>
              <span className="font-semibold">{fundingMetrics.debtServiceCoverage.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Debt</span>
              <span className="font-semibold">{formatCurrency(mockFinancialData?.longTermDebt || 0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding Recommendations</h3>
          <div className="space-y-3">
            {fundingRecommendations.slice(0, 3).map((recommendation: { strategy: string; description: string; priority: string }, index: number) => {
              const colorClass = recommendation.priority === "high" ? "bg-green-500" : recommendation.priority === "medium" ? "bg-yellow-500" : "bg-blue-500";
              return (
                <div key={index} className="flex items-start">
                  <div className={`w-2 h-2 ${colorClass} rounded-full mt-2 mr-3`}></div>
                  <p className="text-sm text-gray-700">{recommendation.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingInsights;
