import React, { useState } from "react";
import { PieChart, TrendingUp, BarChart3, DollarSign, Calculator, Target, Zap, Activity, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { useFinancialsData } from "@/hooks/useFinancialsData";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

const PerformanceInsightsPage: React.FC = () => {
  const { data, loading, error, refetch } = useFinancialsData();
  const [activeSegment, setActiveSegment] = useState("profitability");
  const [ebitdaMultiplier, setEbitdaMultiplier] = useState(8);
  const [showDataWarning, setShowDataWarning] = useState(true);

  const segments = [
    { id: "profitability", label: "Profitability Insights", icon: DollarSign },
    { id: "workingCapital", label: "Working Capital Insights", icon: Activity },
    { id: "funding", label: "Funding Insights", icon: TrendingUp },
    { id: "sensitivity", label: "Sensitivity Analysis", icon: Calculator },
    { id: "valuation", label: "Valuation Tool", icon: Target },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Mock financial data for calculations (in a real app, this would come from the actual financial data)
  const mockFinancialData = {
    revenue: 500000,
    cogs: 175000, // 35% of revenue
    grossProfit: 325000,
    operatingExpenses: 200000,
    ebitda: 125000,
    depreciation: 15000,
    interestExpense: 8000,
    netIncome: 72000,

    // Balance Sheet
    cash: 45000,
    accountsReceivable: 25000,
    inventory: 35000,
    currentAssets: 105000,
    fixedAssets: 280000,
    totalAssets: 385000,

    accountsPayable: 18000,
    currentLiabilities: 45000,
    longTermDebt: 150000,
    totalLiabilities: 195000,
    equity: 190000,

    // Working Capital Metrics
    accountsReceivableDays: 18,
    inventoryDays: 73,
    accountsPayableDays: 37,
  };

  // Profitability Calculations
  const profitabilityMetrics = {
    grossMargin: (mockFinancialData.grossProfit / mockFinancialData.revenue) * 100,
    operatingMargin: ((mockFinancialData.grossProfit - mockFinancialData.operatingExpenses) / mockFinancialData.revenue) * 100,
    netMargin: (mockFinancialData.netIncome / mockFinancialData.revenue) * 100,
    ebitdaMargin: (mockFinancialData.ebitda / mockFinancialData.revenue) * 100,
    roa: (mockFinancialData.netIncome / mockFinancialData.totalAssets) * 100,
    roe: (mockFinancialData.netIncome / mockFinancialData.equity) * 100,
  };

  // Working Capital Calculations
  const workingCapitalMetrics = {
    workingCapital: mockFinancialData.currentAssets - mockFinancialData.currentLiabilities,
    currentRatio: mockFinancialData.currentAssets / mockFinancialData.currentLiabilities,
    quickRatio: (mockFinancialData.currentAssets - mockFinancialData.inventory) / mockFinancialData.currentLiabilities,
    cashConversionCycle: mockFinancialData.accountsReceivableDays + mockFinancialData.inventoryDays - mockFinancialData.accountsPayableDays,
    workingCapitalRatio: ((mockFinancialData.currentAssets - mockFinancialData.currentLiabilities) / mockFinancialData.revenue) * 100,
  };

  // Funding Insights
  const fundingMetrics = {
    debtToEquity: mockFinancialData.totalLiabilities / mockFinancialData.equity,
    debtToAssets: (mockFinancialData.totalLiabilities / mockFinancialData.totalAssets) * 100,
    interestCoverage: mockFinancialData.ebitda / mockFinancialData.interestExpense,
    debtServiceCoverage: mockFinancialData.ebitda / (mockFinancialData.interestExpense + 20000), // Assuming principal payments
    equityRatio: (mockFinancialData.equity / mockFinancialData.totalAssets) * 100,
  };

  // Enhanced Sensitivity Analysis with different impacts
  const sensitivityAnalysis = {
    priceIncrease1Percent: {
      revenueImpact: mockFinancialData.revenue * 0.01,
      profitImpact: mockFinancialData.revenue * 0.01, // 100% flows to profit (highest impact)
      cashFlowImpact: mockFinancialData.revenue * 0.01 * 0.85, // 85% after taxes
      priority: 1,
      difficulty: "Medium",
      timeframe: "1-3 months",
    },
    volumeIncrease1Percent: {
      revenueImpact: mockFinancialData.revenue * 0.01,
      profitImpact: mockFinancialData.revenue * 0.01 - mockFinancialData.cogs * 0.01, // Revenue minus variable costs
      cashFlowImpact: (mockFinancialData.revenue * 0.01 - mockFinancialData.cogs * 0.01) * 0.85,
      priority: 4,
      difficulty: "Hard",
      timeframe: "3-6 months",
    },
    cogsDecrease1Percent: {
      revenueImpact: 0,
      profitImpact: mockFinancialData.cogs * 0.01, // Direct cost savings
      cashFlowImpact: mockFinancialData.cogs * 0.01 * 0.85,
      priority: 2,
      difficulty: "Medium",
      timeframe: "1-2 months",
    },
    opexDecrease1Percent: {
      revenueImpact: 0,
      profitImpact: mockFinancialData.operatingExpenses * 0.01, // Direct expense reduction
      cashFlowImpact: mockFinancialData.operatingExpenses * 0.01 * 0.85,
      priority: 3,
      difficulty: "Easy",
      timeframe: "Immediate",
    },
    arDecrease1Day: {
      revenueImpact: 0,
      profitImpact: 0, // No profit impact, only cash flow
      cashFlowImpact: mockFinancialData.accountsReceivable / mockFinancialData.accountsReceivableDays,
      priority: 6,
      difficulty: "Medium",
      timeframe: "1-2 months",
    },
    inventoryDecrease1Day: {
      revenueImpact: 0,
      profitImpact: 0, // No profit impact, only cash flow
      cashFlowImpact: mockFinancialData.inventory / mockFinancialData.inventoryDays,
      priority: 5,
      difficulty: "Medium",
      timeframe: "2-4 months",
    },
    apIncrease1Day: {
      revenueImpact: 0,
      profitImpact: 0, // No profit impact, only cash flow
      cashFlowImpact: mockFinancialData.accountsPayable / mockFinancialData.accountsPayableDays,
      priority: 7,
      difficulty: "Easy",
      timeframe: "Immediate",
    },
  };

  // Get top 3 opportunities by profit impact
  const topProfitOpportunities = [
    { name: "1% Price Increase", ...sensitivityAnalysis.priceIncrease1Percent },
    { name: "1% COGS Decrease", ...sensitivityAnalysis.cogsDecrease1Percent },
    { name: "1% Operating Expenses Decrease", ...sensitivityAnalysis.opexDecrease1Percent },
  ].sort((a, b) => b.profitImpact - a.profitImpact);

  // Get top 3 opportunities by cash flow impact
  const topCashFlowOpportunities = [
    { name: "1% Price Increase", ...sensitivityAnalysis.priceIncrease1Percent },
    { name: "1% COGS Decrease", ...sensitivityAnalysis.cogsDecrease1Percent },
    { name: "1% Operating Expenses Decrease", ...sensitivityAnalysis.opexDecrease1Percent },
  ].sort((a, b) => b.cashFlowImpact - a.cashFlowImpact);

  // Valuation Calculation
  const valuation = mockFinancialData.ebitda * ebitdaMultiplier;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading performance insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  const renderProfitabilityInsights = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Gross Margin</h3>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">{formatPercentage(profitabilityMetrics.grossMargin)}</div>
          <p className="text-sm text-gray-600">Industry benchmark: 60-70%</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Operating Margin</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">{formatPercentage(profitabilityMetrics.operatingMargin)}</div>
          <p className="text-sm text-gray-600">Industry benchmark: 15-25%</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Net Margin</h3>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">{formatPercentage(profitabilityMetrics.netMargin)}</div>
          <p className="text-sm text-gray-600">Industry benchmark: 10-15%</p>
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
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-gray-700">Strong gross margin indicates good pricing power and cost control</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-gray-700">Operating margin could be improved through operational efficiency</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-gray-700">ROE indicates efficient use of shareholder equity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkingCapitalInsights = () => (
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
              <span className="font-semibold">{mockFinancialData.accountsReceivableDays} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Inventory Days</span>
              <span className="font-semibold">{mockFinancialData.inventoryDays} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Accounts Payable Days</span>
              <span className="font-semibold">{mockFinancialData.accountsPayableDays} days</span>
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
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-gray-700">Reduce inventory days to improve cash flow</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-gray-700">Negotiate longer payment terms with suppliers</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-gray-700">Implement faster collection processes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFundingInsights = () => (
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
              <span className="font-semibold">{formatCurrency(mockFinancialData.longTermDebt)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-gray-700">Strong interest coverage indicates low financial risk</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-gray-700">Consider refinancing at lower rates if available</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-gray-700">Maintain current debt levels for optimal leverage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSensitivityAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Impact Analysis on Cash Flow & Profit</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Scenario</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Revenue Impact</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Profit Impact</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Cash Flow Impact</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Difficulty</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Timeframe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 px-4 font-medium text-gray-900">1% Price Increase</td>
                <td className="py-3 px-4 text-center text-green-600 font-semibold">+{formatCurrency(sensitivityAnalysis.priceIncrease1Percent.revenueImpact)}</td>
                <td className="py-3 px-4 text-center text-green-600 font-semibold">+{formatCurrency(sensitivityAnalysis.priceIncrease1Percent.profitImpact)}</td>
                <td className="py-3 px-4 text-center text-green-600 font-semibold">+{formatCurrency(sensitivityAnalysis.priceIncrease1Percent.cashFlowImpact)}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">{sensitivityAnalysis.priceIncrease1Percent.difficulty}</span>
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">{sensitivityAnalysis.priceIncrease1Percent.timeframe}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-900">1% Volume Increase</td>
                <td className="py-3 px-4 text-center text-green-600 font-semibold">+{formatCurrency(sensitivityAnalysis.volumeIncrease1Percent.revenueImpact)}</td>
                <td className="py-3 px-4 text-center text-green-600 font-semibold">+{formatCurrency(sensitivityAnalysis.volumeIncrease1Percent.profitImpact)}</td>
                <td className="py-3 px-4 text-center text-green-600 font-semibold">+{formatCurrency(sensitivityAnalysis.volumeIncrease1Percent.cashFlowImpact)}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">{sensitivityAnalysis.volumeIncrease1Percent.difficulty}</span>
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">{sensitivityAnalysis.volumeIncrease1Percent.timeframe}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-900">1% COGS Decrease</td>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
                <td className="py-3 px-4 text-center text-green-600 font-semibold">+{formatCurrency(sensitivityAnalysis.cogsDecrease1Percent.profitImpact)}</td>
                <td className="py-3 px-4 text-center text-green-600 font-semibold">+{formatCurrency(sensitivityAnalysis.cogsDecrease1Percent.cashFlowImpact)}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">{sensitivityAnalysis.cogsDecrease1Percent.difficulty}</span>
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">{sensitivityAnalysis.cogsDecrease1Percent.timeframe}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-900">1% Operating Expenses Decrease</td>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
                <td className="py-3 px-4 text-center text-green-600 font-semibold">+{formatCurrency(sensitivityAnalysis.opexDecrease1Percent.profitImpact)}</td>
                <td className="py-3 px-4 text-center text-green-600 font-semibold">+{formatCurrency(sensitivityAnalysis.opexDecrease1Percent.cashFlowImpact)}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{sensitivityAnalysis.opexDecrease1Percent.difficulty}</span>
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">{sensitivityAnalysis.opexDecrease1Percent.timeframe}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-900">1 Day AR Decrease</td>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
                <td className="py-3 px-4 text-center text-blue-600 font-semibold">+{formatCurrency(sensitivityAnalysis.arDecrease1Day.cashFlowImpact)}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">{sensitivityAnalysis.arDecrease1Day.difficulty}</span>
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">{sensitivityAnalysis.arDecrease1Day.timeframe}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-900">1 Day Inventory Decrease</td>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
                <td className="py-3 px-4 text-center text-blue-600 font-semibold">+{formatCurrency(sensitivityAnalysis.inventoryDecrease1Day.cashFlowImpact)}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">{sensitivityAnalysis.inventoryDecrease1Day.difficulty}</span>
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">{sensitivityAnalysis.inventoryDecrease1Day.timeframe}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-900">1 Day AP Increase</td>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
                <td className="py-3 px-4 text-center text-gray-500">-</td>
                <td className="py-3 px-4 text-center text-blue-600 font-semibold">+{formatCurrency(sensitivityAnalysis.apIncrease1Day.cashFlowImpact)}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{sensitivityAnalysis.apIncrease1Day.difficulty}</span>
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-600">{sensitivityAnalysis.apIncrease1Day.timeframe}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highest Profit Impact Opportunities */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            Highest Profit Impact Opportunities
          </h3>
          <div className="space-y-3">
            {topProfitOpportunities.map((opportunity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">{index + 1}</div>
                  <div>
                    <span className="text-sm font-medium text-green-800">{opportunity.name}</span>
                    <div className="text-xs text-green-600">
                      {opportunity.difficulty} • {opportunity.timeframe}
                    </div>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600">+{formatCurrency(opportunity.profitImpact)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Cash Flow Impact Opportunities */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 text-blue-600 mr-2" />
            Highest Cash Flow Impact Opportunities
          </h3>
          <div className="space-y-3">
            {topCashFlowOpportunities.map((opportunity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">{index + 1}</div>
                  <div>
                    <span className="text-sm font-medium text-blue-800">{opportunity.name}</span>
                    <div className="text-xs text-blue-600">
                      {opportunity.difficulty} • {opportunity.timeframe}
                    </div>
                  </div>
                </div>
                <span className="text-sm font-bold text-blue-600">+{formatCurrency(opportunity.cashFlowImpact)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Implementation Priority Matrix */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 text-purple-600 mr-2" />
          Implementation Priority Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">1</div>
              <h4 className="font-semibold text-green-800">Immediate Actions</h4>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-green-700">• Review and optimize pricing strategy</div>
              <div className="text-sm text-green-700">• Reduce operating expenses</div>
              <div className="text-sm text-green-700">• Negotiate payment terms</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">2</div>
              <h4 className="font-semibold text-yellow-800">Short-term (1-3 months)</h4>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-yellow-700">• Optimize supplier relationships</div>
              <div className="text-sm text-yellow-700">• Improve collection processes</div>
              <div className="text-sm text-yellow-700">• Streamline inventory management</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">3</div>
              <h4 className="font-semibold text-blue-800">Long-term (3+ months)</h4>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-blue-700">• Develop growth strategies</div>
              <div className="text-sm text-blue-700">• Invest in operational efficiency</div>
              <div className="text-sm text-blue-700">• Explore new revenue streams</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderValuationTool = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Valuation Calculator</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-4">Valuation Inputs</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">EBITDA</label>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(mockFinancialData.ebitda)}</div>
                <p className="text-xs text-gray-500">Based on your financial data</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">EBITDA Multiplier</label>
                <div className="flex items-center space-x-4">
                  <input type="range" min="4" max="15" step="0.5" value={ebitdaMultiplier} onChange={(e) => setEbitdaMultiplier(parseFloat(e.target.value))} className="flex-1" />
                  <div className="text-xl font-bold text-blue-600 min-w-[60px]">{ebitdaMultiplier}x</div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Restaurant industry range: 4x - 12x</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-4">Valuation Result</h4>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{formatCurrency(valuation)}</div>
                <p className="text-sm text-blue-700">Estimated Company Value</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">EBITDA:</span>
                <span className="font-medium">{formatCurrency(mockFinancialData.ebitda)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Multiplier:</span>
                <span className="font-medium">{ebitdaMultiplier}x</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-sm font-semibold">
                <span>Valuation:</span>
                <span>{formatCurrency(valuation)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Multiplier Guidelines</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
              <span className="text-sm text-red-800">Struggling (4x - 6x)</span>
              <span className="text-xs text-red-600">Low profitability, high risk</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
              <span className="text-sm text-yellow-800">Average (6x - 8x)</span>
              <span className="text-xs text-yellow-600">Stable operations</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-sm text-green-800">Strong (8x - 10x)</span>
              <span className="text-xs text-green-600">Good growth, profitable</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-sm text-blue-800">Premium (10x - 12x)</span>
              <span className="text-xs text-blue-600">Excellent brand, prime location</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Valuation Factors</h4>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-gray-700">Strong financial performance increases multiplier</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-gray-700">Prime location and brand recognition add value</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-gray-700">Growth potential and market position matter</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-gray-700">Quality of management and operations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSegmentContent = () => {
    switch (activeSegment) {
      case "profitability":
        return renderProfitabilityInsights();
      case "workingCapital":
        return renderWorkingCapitalInsights();
      case "funding":
        return renderFundingInsights();
      case "sensitivity":
        return renderSensitivityAnalysis();
      case "valuation":
        return renderValuationTool();
      default:
        return renderProfitabilityInsights();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Performance Insights"
          description="Advanced financial analysis and strategic insights for your business"
          icon={<PieChart className="w-8 h-8 text-oxford_blue-600" />}
        />

        {/* Data Warning Banner */}
        {showDataWarning && data && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-800">Data Analysis Note</h3>
                <p className="text-sm text-amber-700 mt-1">
                  These insights are based on {data.inputData?.branches.length || 0} branch(es) of financial data. For more accurate insights, ensure all financial data is complete
                  and up-to-date.
                </p>
              </div>
              <button onClick={() => setShowDataWarning(false)} className="text-amber-600 hover:text-amber-800">
                ×
              </button>
            </div>
          </div>
        )}

        {/* Segment Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {segments.map((segment) => {
              const Icon = segment.icon;
              return (
                <button
                  key={segment.id}
                  onClick={() => setActiveSegment(segment.id)}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeSegment === segment.id ? "bg-oxford_blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${activeSegment === segment.id ? "text-white" : "text-gray-600"}`} />
                  {segment.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Segment Content */}
        <div className="transition-all duration-300">{renderSegmentContent()}</div>

        {/* Summary Footer */}
        <div className="mt-8 bg-oxford_blue-50 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-oxford_blue-900 mb-2">Performance Insights Summary</h3>
            <p className="text-sm text-oxford_blue-700">Advanced financial analysis providing actionable insights for strategic decision-making and business optimization.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceInsightsPage;
