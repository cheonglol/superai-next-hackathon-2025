import React from "react";
import { Activity, BarChart3, TrendingUp } from "lucide-react";

interface WorkingCapitalInsightsData {
  working_capital?: number;
  current_ratio?: string;
  quick_ratio?: string;
  cash_conversion_cycle?: number;
  components?: {
    accounts_receivable_days: number;
    inventory_days: number;
    accounts_payable_days: number;
  };
  optimization_opportunities?: Array<{
    area: string;
    current_performance: string;
    target_improvement: string;
    potential_cash_impact: number;
    priority: string;
  }>;
}

interface WorkingCapitalInsightsProps {
  mockFinancialData?: {
    currentAssets: number;
    currentLiabilities: number;
    inventory: number;
    accountsReceivableDays: number;
    inventoryDays: number;
    accountsPayableDays: number;
  };
  apiData?: WorkingCapitalInsightsData;
  formatCurrency: (amount: number) => string;
}

const WorkingCapitalInsights: React.FC<WorkingCapitalInsightsProps> = ({ mockFinancialData, apiData, formatCurrency }) => {
  // Use API data if available, otherwise calculate from mock data, or use defaults
  const workingCapitalMetrics = apiData
    ? {
        workingCapital: apiData.working_capital || 0,
        currentRatio: parseFloat(apiData.current_ratio || "0"),
        quickRatio: parseFloat(apiData.quick_ratio || "0"),
        cashConversionCycle: apiData.cash_conversion_cycle || 0,
      }
    : mockFinancialData
      ? {
          workingCapital: mockFinancialData.currentAssets - mockFinancialData.currentLiabilities,
          currentRatio: mockFinancialData.currentAssets / mockFinancialData.currentLiabilities,
          quickRatio: (mockFinancialData.currentAssets - mockFinancialData.inventory) / mockFinancialData.currentLiabilities,
          cashConversionCycle: mockFinancialData.accountsReceivableDays + mockFinancialData.inventoryDays - mockFinancialData.accountsPayableDays,
        }
      : {
          workingCapital: 0,
          currentRatio: 0,
          quickRatio: 0,
          cashConversionCycle: 0,
        };

  // Get components from API data or use mock data or defaults
  const components =
    apiData?.components ||
    (mockFinancialData
      ? {
          accounts_receivable_days: mockFinancialData.accountsReceivableDays,
          inventory_days: mockFinancialData.inventoryDays,
          accounts_payable_days: mockFinancialData.accountsPayableDays,
        }
      : {
          accounts_receivable_days: 0,
          inventory_days: 0,
          accounts_payable_days: 0,
        });

  // Get optimization opportunities from API data or use defaults
  const optimizationOpportunities = apiData?.optimization_opportunities || [
    { area: "inventory", current_performance: "High inventory days", target_improvement: "Reduce by 20%", potential_cash_impact: 15000, priority: "high" },
    { area: "payables", current_performance: "Short payment terms", target_improvement: "Negotiate 60-day terms", potential_cash_impact: 8000, priority: "medium" },
    { area: "receivables", current_performance: "Long collection period", target_improvement: "Faster collection processes", potential_cash_impact: 12000, priority: "medium" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Working Capital</h3>
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(workingCapitalMetrics.workingCapital)}</div>
          <p className="text-sm text-gray-600">Current Assets - Current Liabilities</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Ratio</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{workingCapitalMetrics.currentRatio.toFixed(2)}</div>
          <p className="text-sm text-gray-600">Ideal range: 1.5 - 3.0</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cash Conversion Cycle</h3>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">{workingCapitalMetrics.cashConversionCycle} days</div>
          <p className="text-sm text-gray-600">Time to convert investments to cash</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Capital Components</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Accounts Receivable Days</span>
              <span className="font-semibold">{components.accounts_receivable_days} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Inventory Days</span>
              <span className="font-semibold">{components.inventory_days} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Accounts Payable Days</span>
              <span className="font-semibold">{components.accounts_payable_days} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quick Ratio</span>
              <span className="font-semibold">{workingCapitalMetrics.quickRatio.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Opportunities</h3>
          <div className="space-y-3">
            {optimizationOpportunities
              .slice(0, 3)
              .map((opportunity: { area: string; current_performance: string; target_improvement: string; potential_cash_impact: number; priority: string }, index: number) => {
                const colorClass = opportunity.priority === "high" ? "bg-red-500" : opportunity.priority === "medium" ? "bg-yellow-500" : "bg-green-500";
                return (
                  <div key={index} className="flex items-start">
                    <div className={`w-2 h-2 ${colorClass} rounded-full mt-2 mr-3`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{opportunity.target_improvement}</p>
                      {opportunity.potential_cash_impact && <p className="text-xs text-gray-500">Potential impact: {formatCurrency(opportunity.potential_cash_impact)}</p>}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingCapitalInsights;
