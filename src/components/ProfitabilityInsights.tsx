import React from "react";
import { DollarSign, BarChart3, TrendingUp } from "lucide-react";

interface ProfitabilityInsightsData {
  gross_margin?: string;
  operating_margin?: string;
  net_margin?: string;
  ebitda_margin?: string;
  return_on_assets?: string;
  return_on_equity?: string;
  industry_benchmarks?: {
    gross_margin_benchmark: string;
    operating_margin_benchmark: string;
    net_margin_benchmark: string;
  };
  insights?: Array<{
    type: string;
    message: string;
    priority: string;
  }>;
}

interface ProfitabilityInsightsProps {
  mockFinancialData?: {
    revenue: number;
    grossProfit: number;
    operatingExpenses: number;
    netIncome: number;
    ebitda: number;
    totalAssets: number;
    equity: number;
  };
  apiData?: ProfitabilityInsightsData;

  formatPercentage: (value: number) => string;
}

const ProfitabilityInsights: React.FC<ProfitabilityInsightsProps> = ({ mockFinancialData, apiData, formatPercentage }) => {
  console.log("🔍 ProfitabilityInsights received apiData:", apiData);
  console.log("🔍 ProfitabilityInsights received mockFinancialData:", mockFinancialData);

  // Use API data if available, otherwise calculate from mock data, or use defaults
  const profitabilityMetrics = apiData
    ? {
        grossMargin: parseFloat(apiData.gross_margin?.replace("%", "") || "0"),
        operatingMargin: parseFloat(apiData.operating_margin?.replace("%", "") || "0"),
        netMargin: parseFloat(apiData.net_margin?.replace("%", "") || "0"),
        ebitdaMargin: parseFloat(apiData.ebitda_margin?.replace("%", "") || "0"),
        roa: parseFloat(apiData.return_on_assets?.replace("%", "") || "0"),
        roe: parseFloat(apiData.return_on_equity?.replace("%", "") || "0"),
      }
    : mockFinancialData
      ? {
          grossMargin: (mockFinancialData.grossProfit / mockFinancialData.revenue) * 100,
          operatingMargin: ((mockFinancialData.grossProfit - mockFinancialData.operatingExpenses) / mockFinancialData.revenue) * 100,
          netMargin: (mockFinancialData.netIncome / mockFinancialData.revenue) * 100,
          ebitdaMargin: (mockFinancialData.ebitda / mockFinancialData.revenue) * 100,
          roa: (mockFinancialData.netIncome / mockFinancialData.totalAssets) * 100,
          roe: (mockFinancialData.netIncome / mockFinancialData.equity) * 100,
        }
      : {
          grossMargin: 0,
          operatingMargin: 0,
          netMargin: 0,
          ebitdaMargin: 0,
          roa: 0,
          roe: 0,
        };

  console.log("🔢 Final calculated profitability metrics:", profitabilityMetrics);

  // Get benchmarks from API data or use defaults
  const benchmarks = apiData?.industry_benchmarks || {
    gross_margin_benchmark: "60-70%",
    operating_margin_benchmark: "15-25%",
    net_margin_benchmark: "10-15%",
  };

  // Get insights from API data or use defaults
  const insights = apiData?.insights || [
    { type: "positive", message: "Strong gross margin indicates good pricing power and cost control", priority: "high" },
    { type: "warning", message: "Operating margin could be improved through operational efficiency", priority: "medium" },
    { type: "positive", message: "ROE indicates efficient use of shareholder equity", priority: "medium" },
  ];

  console.log("📊 ProfitabilityInsights computed metrics:", profitabilityMetrics);
  console.log("📈 ProfitabilityInsights benchmarks:", benchmarks);
  console.log("💡 ProfitabilityInsights insights:", insights);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Gross Margin</h3>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">{formatPercentage(profitabilityMetrics.grossMargin)}</div>
          <p className="text-sm text-gray-600">Industry benchmark: {benchmarks.gross_margin_benchmark}</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Operating Margin</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{formatPercentage(profitabilityMetrics.operatingMargin)}</div>
          <p className="text-sm text-gray-600">Industry benchmark: {benchmarks.operating_margin_benchmark}</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Net Margin</h3>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">{formatPercentage(profitabilityMetrics.netMargin)}</div>
          <p className="text-sm text-gray-600">Industry benchmark: {benchmarks.net_margin_benchmark}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Return on Assets (ROA)</span>
              <span className="font-semibold">{formatPercentage(profitabilityMetrics.roa)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Return on Equity (ROE)</span>
              <span className="font-semibold">{formatPercentage(profitabilityMetrics.roe)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">EBITDA Margin</span>
              <span className="font-semibold">{formatPercentage(profitabilityMetrics.ebitdaMargin)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profitability Analysis</h3>
          <div className="space-y-3">
            {insights.map((insight: { type: string; message: string; priority: string }, index: number) => {
              const colorClass = insight.type === "positive" ? "bg-green-500" : insight.type === "warning" ? "bg-yellow-500" : "bg-blue-500";
              return (
                <div key={index} className="flex items-start">
                  <div className={`w-2 h-2 ${colorClass} rounded-full mt-2 mr-3`}></div>
                  <p className="text-sm text-gray-700">{insight.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityInsights;
