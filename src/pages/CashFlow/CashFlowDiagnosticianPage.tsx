/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Activity, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { loadFinancialData, calculateCashFlowMetrics, setCurrentPeriod } from "@/store/slices/cashFlowSlice";
import { CashFlowData } from "@/types/cashflow";

const CashFlowDiagnosticianPage: React.FC = () => {
  const dispatch = useDispatch();
  const { periods, currentPeriod, metrics, loading } = useSelector((state: RootState) => state.cashFlow);

  const [activeTab, setActiveTab] = useState<"overview" | "issues" | "recommendations" | "forecast">("overview");

  // All React hooks must be at the top level
  useEffect(() => {
    runAnalysis();
  }, []);

  // Initialize data when component mounts
  useEffect(() => {
    if (periods.length === 0) {
      dispatch(loadFinancialData());
    }
  }, [dispatch, periods.length]);

  // Calculate metrics when periods or current period changes
  useEffect(() => {
    if (periods.length > 0 && metrics === null) {
      dispatch(calculateCashFlowMetrics());
    }
  }, [dispatch, periods.length, metrics]);

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  const runAnalysis = async () => {
    dispatch(calculateCashFlowMetrics());
  };

  // Get current period data
  const currentPeriodData = periods[currentPeriod];

  // Mock data for demonstration
  const cashFlowIssues = [
    {
      id: 1,
      title: "Seasonal Revenue Fluctuation",
      severity: "high" as const,
      category: "operating",
      description: "Revenue drops 40% during Q1 and Q3, creating cash flow gaps",
      impact: -125000,
      likelihood: 85,
      timeframe: "Next 3 months",
      recommendations: ["Implement monthly recurring revenue model", "Negotiate staggered payment terms with key clients", "Build seasonal cash reserves during peak periods"],
    },
    {
      id: 2,
      title: "Extended Payment Terms",
      severity: "medium" as const,
      category: "working_capital",
      description: "Average collection period has increased to 65 days, well above industry standard of 45 days",
      impact: -85000,
      likelihood: 90,
      timeframe: "Ongoing",
      recommendations: ["Implement early payment discounts (2/10 net 30)", "Automate invoice reminders and follow-ups", "Review credit policies for new customers"],
    },
    {
      id: 3,
      title: "Inventory Buildup",
      severity: "medium" as const,
      category: "working_capital",
      description: "Inventory levels have grown 35% while sales remained flat, tying up working capital",
      impact: -65000,
      likelihood: 75,
      timeframe: "Next 6 months",
      recommendations: ["Implement just-in-time inventory management", "Negotiate consignment arrangements with suppliers", "Improve demand forecasting accuracy"],
    },
  ];

  const recommendations = [
    {
      id: 1,
      title: "Implement Dynamic Pricing Strategy",
      priority: "high" as const,
      category: "Revenue Optimization",
      impact: `${formatCurrency(currentPeriodData?.totalRevenue ? currentPeriodData.totalRevenue * 0.08 : 0)}/month`,
      timeframe: "1-2 months",
      difficulty: "medium",
      details: "Adjust pricing based on demand patterns and competitor analysis to increase revenue by 8-12%",
    },
    {
      id: 2,
      title: "Optimize Supplier Payment Terms",
      priority: "medium" as const,
      category: "Working Capital",
      impact: `${formatCurrency(currentPeriodData?.totalExpenses ? currentPeriodData.totalExpenses * 0.15 : 0)} freed up`,
      timeframe: "2-3 months",
      difficulty: "low",
      details: "Negotiate extended payment terms from 30 to 45 days with key suppliers to improve cash conversion cycle",
    },
    {
      id: 3,
      title: "Debt Refinancing Opportunity",
      priority: "medium" as const,
      category: "Financing",
      impact: `${formatCurrency(currentPeriodData?.interestPaid ? currentPeriodData.interestPaid * 0.2 : 0)}/year`,
      timeframe: "2-4 months",
      difficulty: "medium",
      details: "Reduce interest expense by refinancing existing debt at lower rates, potentially saving 15-20% annually",
    },
  ];

  // Mock cash flow data
  const mockCashFlowData: CashFlowData = {
    id: "cf-001",
    companyId: "company-001",
    period: "2025-01",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    operatingCashFlow: {
      receipts: [
        { id: "1", category: "Sales", description: "Product sales", amount: 150000, date: "2025-01-15", type: "inflow", source: "actual", confidence: 0.95, tags: ["revenue"] },
        {
          id: "2",
          category: "Services",
          description: "Consulting services",
          amount: 45000,
          date: "2025-01-20",
          type: "inflow",
          source: "actual",
          confidence: 0.9,
          tags: ["revenue"],
        },
      ],
      payments: [
        {
          id: "3",
          category: "Payroll",
          description: "Employee salaries",
          amount: 80000,
          date: "2025-01-31",
          type: "outflow",
          source: "actual",
          confidence: 1.0,
          tags: ["expense"],
        },
        { id: "4", category: "Rent", description: "Office rent", amount: 15000, date: "2025-01-01", type: "outflow", source: "actual", confidence: 1.0, tags: ["expense"] },
      ],
      netOperating: 100000,
    },
    investingCashFlow: {
      receipts: [],
      payments: [
        { id: "5", category: "Equipment", description: "New computers", amount: 25000, date: "2025-01-10", type: "outflow", source: "actual", confidence: 1.0, tags: ["capex"] },
      ],
      netInvesting: -25000,
    },
    financingCashFlow: {
      receipts: [],
      payments: [
        {
          id: "6",
          category: "Loan Payment",
          description: "Monthly loan payment",
          amount: 5000,
          date: "2025-01-15",
          type: "outflow",
          source: "actual",
          confidence: 1.0,
          tags: ["debt"],
        },
      ],
      netFinancing: -5000,
    },
    openingBalance: 120000,
    closingBalance: 190000,
    netCashFlow: 70000,
    forecast: [
      {
        period: "2025-02",
        projectedInflow: 180000,
        projectedOutflow: 110000,
        projectedBalance: 260000,
        confidence: 0.85,
        scenarios: { optimistic: 280000, realistic: 260000, pessimistic: 240000 },
        assumptions: ["Seasonal uptick in sales", "No major expenses planned"],
      },
    ],
    lastUpdated: new Date().toISOString(),
    dataQuality: "high",
    confidence: 0.92,
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "critical":
        return "text-purple-600 bg-purple-100 border-purple-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      case "critical":
        return "text-purple-600 bg-purple-100 border-purple-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "operating":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "working_capital":
        return "bg-green-100 text-green-800 border-green-200";
      case "liquidity":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "impact":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "financing":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <PageHeader title="Cash Flow Diagnostician" description="AI-powered cash flow analysis and optimization" icon={<Activity className="w-8 h-8 text-blue-600" />} />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cash Flow Diagnostician analyzing...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Cash Flow Diagnostician" description="AI-powered cash flow analysis and optimization" icon={<Activity className="w-8 h-8 text-blue-600" />} />

        {/* Period Selector & Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Period Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Financial Period:</label>
              <select
                value={currentPeriod}
                onChange={(e) => dispatch(setCurrentPeriod(parseInt(e.target.value)))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {periods.map((period, index) => (
                  <option key={index} value={index}>
                    {period.period} (Year {index + 1})
                  </option>
                ))}
              </select>
              <button
                onClick={() => dispatch(calculateCashFlowMetrics())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "overview" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("issues")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "issues" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Issues
            </button>
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "recommendations" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Recommendations
            </button>
            <button
              onClick={() => setActiveTab("forecast")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "forecast" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Forecast
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Cash Flow Metrics Tab */}
          {activeTab === "overview" && (
            <div>
              <div className="flex items-center mb-6">
                <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Cash Flow Metrics</h3>
              </div>

              {/* Group metrics by category */}
              <div className="space-y-6">
                {/* Operating Cash Flow */}
                <div>
                  <h4 className="text-md font-semibold text-blue-800 mb-4 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Operating Cash Flow
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cashFlowMetrics
                      .filter((metric) => metric.category === "operating")
                      .map((metric, index) => (
                        <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-blue-800">{metric.name}</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 mb-2">{metric.value}</div>
                          <div className="text-xs text-blue-700">{metric.description}</div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Working Capital Efficiency */}
                <div>
                  <h4 className="text-md font-semibold text-green-800 mb-4 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Working Capital Efficiency
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cashFlowMetrics
                      .filter((metric) => metric.category === "working_capital")
                      .map((metric, index) => (
                        <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-green-800">{metric.name}</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 mb-2">{metric.value}</div>
                          <div className="text-xs text-green-700">{metric.description}</div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Liquidity & Buffer */}
                <div>
                  <h4 className="text-md font-semibold text-purple-800 mb-4 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Liquidity & Buffer
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cashFlowMetrics
                      .filter((metric) => metric.category === "liquidity")
                      .map((metric, index) => (
                        <div key={index} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-purple-800">{metric.name}</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 mb-2">{metric.value}</div>
                          <div className="text-xs text-purple-700">{metric.description}</div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Revenue & Cost Impact */}
                <div>
                  <h4 className="text-md font-semibold text-amber-800 mb-4 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Revenue & Cost Impact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cashFlowMetrics
                      .filter((metric) => metric.category === "impact")
                      .map((metric, index) => (
                        <div key={index} className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-amber-800">{metric.name}</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 mb-2">{metric.value}</div>
                          <div className="text-xs text-amber-700">{metric.description}</div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Financing & Debt-Related */}
                <div>
                  <h4 className="text-md font-semibold text-indigo-800 mb-4 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Financing & Debt-Related
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cashFlowMetrics
                      .filter((metric) => metric.category === "financing")
                      .map((metric, index) => (
                        <div key={index} className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-indigo-800">{metric.name}</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 mb-2">{metric.value}</div>
                          <div className="text-xs text-indigo-700">{metric.description}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Issues Tab */}
          {activeTab === "issues" && (
            <div>
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Cash Flow Issues</h3>
              </div>

              <div className="space-y-4">
                {cashFlowIssues.map((issue, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <div className="flex items-center mb-2 md:mb-0">
                        <div
                          className={`p-2 rounded-full ${
                            issue.severity === "high"
                              ? "bg-red-200"
                              : issue.severity === "medium"
                                ? "bg-yellow-200"
                                : issue.severity === "critical"
                                  ? "bg-purple-200"
                                  : "bg-blue-200"
                          }`}
                        >
                          {issue.category === "operating" && <BarChart3 className="w-4 h-4" />}
                          {issue.category === "working_capital" && <DollarSign className="w-4 h-4" />}
                          {issue.category === "liquidity" && <DollarSign className="w-4 h-4" />}
                          {issue.category === "impact" && <TrendingUp className="w-4 h-4" />}
                          {issue.category === "financing" && <Target className="w-4 h-4" />}
                        </div>
                        <span className="font-medium ml-2">{issue.title}</span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            issue.severity === "high"
                              ? "bg-red-200 text-red-800"
                              : issue.severity === "medium"
                                ? "bg-yellow-200 text-yellow-800"
                                : issue.severity === "critical"
                                  ? "bg-purple-200 text-purple-800"
                                  : "bg-blue-200 text-blue-800"
                          }`}
                        >
                          {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)} Severity
                        </span>
                        <span className="ml-3 font-bold">{issue.impact}</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{issue.description}</h4>
                    <p className="text-sm">{issue.recommendations.join(", ")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === "recommendations" && (
            <div>
              <div className="flex items-center mb-6">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Cash Flow Recommendations</h3>
              </div>

              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getPriorityColor(recommendation.priority)}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <div className="flex items-center mb-2 md:mb-0">
                        <div
                          className={`p-2 rounded-full ${
                            recommendation.priority === "high"
                              ? "bg-red-200"
                              : recommendation.priority === "medium"
                                ? "bg-yellow-200"
                                : recommendation.priority === "critical"
                                  ? "bg-purple-200"
                                  : "bg-green-200"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            recommendation.priority === "high"
                              ? "bg-red-200 text-red-800"
                              : recommendation.priority === "medium"
                                ? "bg-yellow-200 text-yellow-800"
                                : recommendation.priority === "critical"
                                  ? "bg-purple-200 text-purple-800"
                                  : "bg-green-200 text-green-800"
                          }`}
                        >
                          {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm mr-3">
                          Impact: <strong>{recommendation.impact}</strong>
                        </span>
                        <span className="text-sm">
                          Timeframe: <strong>{recommendation.timeframe}</strong>
                        </span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{recommendation.title}</h4>
                    <p className="text-sm mb-2">{recommendation.details}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">
                        Difficulty:{" "}
                        <span className={getDifficultyColor(recommendation.difficulty)}>
                          {recommendation.difficulty.charAt(0).toUpperCase() + recommendation.difficulty.slice(1)}
                        </span>
                      </span>
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center">
                        Implement <ArrowRight className="w-3 h-3 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Forecast Tab */}
          {activeTab === "forecast" && (
            <div>
              <div className="flex items-center mb-6">
                <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Cash Flow Forecast</h3>
              </div>

              <div className="space-y-4">
                {mockCashFlowData.forecast.map((forecast, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${forecast.projectedBalance > 0 ? "bg-green-50" : "bg-red-50"}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <div className="flex items-center mb-2 md:mb-0">
                        <span className="font-medium text-gray-900">{forecast.period}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm mr-3">
                          Projected Cash Flow:{" "}
                          <strong>{forecast.projectedBalance > 0 ? formatCurrency(forecast.projectedBalance) : formatCurrency(-forecast.projectedBalance)}</strong>
                        </span>
                        <span className="text-sm">Confidence: {forecast.confidence * 100}%</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{forecast.projectedBalance > 0 ? "Positive Cash Flow" : "Negative Cash Flow"}</h4>
                    <p className="text-sm">{forecast.assumptions.join(", ")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashFlowDiagnosticianPage;
