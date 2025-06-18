import React, { useState } from "react";
import { TrendingUp, BarChart3, DollarSign, Target, AlertTriangle, Clock, Users, Zap, Activity, CreditCard, CheckCircle, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { useFinancialsData } from "@/hooks/useFinancialsData";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

const NextStepsPage: React.FC = () => {
  const { data, loading, error, refetch } = useFinancialsData();
  const [viewMode, setViewMode] = useState<"priority" | "timeline">("priority");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Mock financial data for analysis (in a real app, this would come from actual data)
  const mockFinancialData = {
    cash: 45000,
    monthlyBurnRate: 15000,
    monthlyRevenue: 85000,
    monthlyCosts: 70000,
    accountsReceivable: 25000,
    overdueReceivables: 8000,
    grossMargin: 65, // percentage
    industryGrossMargin: 70,
    customerAcquisitionCost: 150,
    customerLifetimeValue: 1200,
    debtToEquityRatio: 1.2,
    monthlyDebtService: 8500,
    monthlyProfit: 15000,
    highestInterestLoan: { amount: 50000, rate: 12.5, payment: 1200 },
    revenueGrowthRate: 15, // percentage
    operatingEfficiencyRatio: 25, // admin costs vs revenue percentage
  };

  // Calculate metrics for each priority area
  const priorityAreas = [
    {
      id: "cashFlow",
      title: "Cash Flow Crisis?",
      icon: DollarSign,
      status: mockFinancialData.cash / mockFinancialData.monthlyBurnRate > 6 ? "green" : mockFinancialData.cash / mockFinancialData.monthlyBurnRate > 3 ? "amber" : "red",
      metrics: [
        {
          label: "Cash Burn Rate",
          value: `${Math.floor(mockFinancialData.cash / mockFinancialData.monthlyBurnRate)} months runway left`,
          detail: `${formatCurrency(mockFinancialData.monthlyBurnRate)}/month burn rate`,
        },
        {
          label: "Top Cash Outflows",
          value: "Payroll (40%), Rent (15%), Marketing (12%)",
          detail: "Biggest expenses to optimize",
        },
        {
          label: "Receivables Aging",
          value: `${formatCurrency(mockFinancialData.overdueReceivables)} overdue`,
          detail: `${((mockFinancialData.overdueReceivables / mockFinancialData.accountsReceivable) * 100).toFixed(1)}% of total receivables`,
        },
      ],
      recommendation:
        mockFinancialData.cash / mockFinancialData.monthlyBurnRate < 3
          ? "URGENT: Reduce overhead costs by 25% or secure short-term financing immediately."
          : mockFinancialData.cash / mockFinancialData.monthlyBurnRate < 6
            ? "Reduce overhead costs by 15% and accelerate collections."
            : "Maintain current cash management practices and optimize working capital.",
    },
    {
      id: "profitability",
      title: "Profitability Problem?",
      icon: TrendingUp,
      status:
        mockFinancialData.grossMargin >= mockFinancialData.industryGrossMargin && mockFinancialData.customerLifetimeValue / mockFinancialData.customerAcquisitionCost > 3
          ? "green"
          : mockFinancialData.grossMargin >= mockFinancialData.industryGrossMargin - 5
            ? "amber"
            : "red",
      metrics: [
        {
          label: "Gross Margin %",
          value: `${mockFinancialData.grossMargin}%`,
          detail: `Industry benchmark: ${mockFinancialData.industryGrossMargin}%`,
        },
        {
          label: "Lowest-Margin Products/Services",
          value: "Lunch Menu (45%), Catering (52%), Delivery (48%)",
          detail: "Top 3 to fix or drop",
        },
        {
          label: "CAC vs LTV Ratio",
          value: `1:${(mockFinancialData.customerLifetimeValue / mockFinancialData.customerAcquisitionCost).toFixed(1)}`,
          detail: `CAC: ${formatCurrency(mockFinancialData.customerAcquisitionCost)}, LTV: ${formatCurrency(mockFinancialData.customerLifetimeValue)}`,
        },
      ],
      recommendation:
        mockFinancialData.grossMargin < mockFinancialData.industryGrossMargin - 5
          ? "Raise prices on Lunch Menu by 15% or renegotiate supplier costs immediately."
          : mockFinancialData.grossMargin < mockFinancialData.industryGrossMargin
            ? "Optimize pricing on low-margin items and review supplier contracts."
            : "Maintain current profitability and explore premium offerings.",
    },
    {
      id: "debt",
      title: "Debt Overload?",
      icon: CreditCard,
      status:
        mockFinancialData.debtToEquityRatio < 0.5 && mockFinancialData.monthlyProfit / mockFinancialData.monthlyDebtService > 2
          ? "green"
          : mockFinancialData.debtToEquityRatio < 1.0 && mockFinancialData.monthlyProfit / mockFinancialData.monthlyDebtService > 1.25
            ? "amber"
            : "red",
      metrics: [
        {
          label: "Debt-to-Equity Ratio",
          value: `${mockFinancialData.debtToEquityRatio.toFixed(2)}:1`,
          detail: "Ideal range: 0.3 - 0.6",
        },
        {
          label: "Monthly Debt Service Coverage",
          value: `${(mockFinancialData.monthlyProfit / mockFinancialData.monthlyDebtService).toFixed(2)}x`,
          detail: `${formatCurrency(mockFinancialData.monthlyProfit)} profit vs ${formatCurrency(mockFinancialData.monthlyDebtService)} debt service`,
        },
        {
          label: "Highest-Interest Loans",
          value: `${mockFinancialData.highestInterestLoan.rate}% APR`,
          detail: `${formatCurrency(mockFinancialData.highestInterestLoan.amount)} at ${formatCurrency(mockFinancialData.highestInterestLoan.payment)}/month`,
        },
      ],
      recommendation:
        mockFinancialData.monthlyProfit / mockFinancialData.monthlyDebtService < 1.25
          ? "URGENT: Restructure debt or focus on profit-boosting activities immediately."
          : mockFinancialData.debtToEquityRatio > 1.0
            ? "Prioritize debt reduction and consider refinancing high-interest loans."
            : "Consider refinancing highest-interest loan to reduce monthly payments.",
    },
    {
      id: "growth",
      title: "Growth vs. Efficiency",
      icon: Activity,
      status:
        mockFinancialData.revenueGrowthRate > 20 && mockFinancialData.operatingEfficiencyRatio < 20
          ? "green"
          : mockFinancialData.revenueGrowthRate > 10 && mockFinancialData.operatingEfficiencyRatio < 30
            ? "amber"
            : "red",
      metrics: [
        {
          label: "Revenue Growth Rate",
          value: `${mockFinancialData.revenueGrowthRate}% annually`,
          detail: mockFinancialData.revenueGrowthRate > 15 ? "Strong growth" : mockFinancialData.revenueGrowthRate > 5 ? "Moderate growth" : "Slow growth",
        },
        {
          label: "Operating Efficiency Ratio",
          value: `${mockFinancialData.operatingEfficiencyRatio}%`,
          detail: "Admin costs vs. revenue (lower is better)",
        },
        {
          label: "Growth Sustainability",
          value: mockFinancialData.revenueGrowthRate > 20 && mockFinancialData.operatingEfficiencyRatio > 25 ? "Unsustainable" : "Sustainable",
          detail: "Based on growth rate vs. efficiency",
        },
      ],
      recommendation:
        mockFinancialData.revenueGrowthRate > 20 && mockFinancialData.operatingEfficiencyRatio > 25
          ? "Pause expansion until operating efficiency improves below 20%."
          : mockFinancialData.operatingEfficiencyRatio > 30
            ? "Focus on operational efficiency before pursuing growth."
            : "Continue balanced growth while monitoring efficiency metrics.",
    },
  ];

  // Quick Wins vs. Long-Term Fixes
  const quickWins = [
    {
      id: "rent-reduction",
      title: "Negotiate rent reduction",
      description: "Contact landlord to renegotiate lease terms or request temporary reduction",
      impact: "High",
      effort: "Low",
      timeframe: "1-2 weeks",
      potentialSavings: "$2,500/month",
      category: "Cost Reduction",
    },
    {
      id: "underperforming-clients",
      title: "Drop underperforming clients",
      description: "Identify and discontinue relationships with low-margin or problematic clients",
      impact: "Medium",
      effort: "Low",
      timeframe: "Immediate",
      potentialSavings: "$1,800/month",
      category: "Revenue Optimization",
    },
    {
      id: "payment-terms",
      title: "Extend supplier payment terms",
      description: "Negotiate 30-45 day payment terms with key suppliers to improve cash flow",
      impact: "Medium",
      effort: "Low",
      timeframe: "2-3 weeks",
      potentialSavings: "$8,000 cash flow improvement",
      category: "Cash Flow",
    },
    {
      id: "subscription-audit",
      title: "Cancel unused subscriptions",
      description: "Audit and cancel software subscriptions, memberships, and services not actively used",
      impact: "Low",
      effort: "Low",
      timeframe: "1 week",
      potentialSavings: "$450/month",
      category: "Cost Reduction",
    },
    {
      id: "pricing-adjustment",
      title: "Implement immediate price increases",
      description: "Raise prices on high-demand, low-margin items by 5-10%",
      impact: "High",
      effort: "Low",
      timeframe: "1 week",
      potentialSavings: "$3,200/month",
      category: "Revenue Optimization",
    },
    {
      id: "collections-acceleration",
      title: "Accelerate collections process",
      description: "Implement daily follow-up on overdue accounts and offer early payment discounts",
      impact: "Medium",
      effort: "Medium",
      timeframe: "2 weeks",
      potentialSavings: "$5,000 one-time",
      category: "Cash Flow",
    },
  ];

  const strategicShifts = [
    {
      id: "supplier-diversification",
      title: "Diversify suppliers",
      description: "Develop relationships with 2-3 alternative suppliers for each critical ingredient/service to reduce dependency and negotiate better terms",
      impact: "High",
      effort: "High",
      timeframe: "3-6 months",
      potentialSavings: "15-20% cost reduction",
      category: "Supply Chain",
    },
    {
      id: "premium-product-line",
      title: "Launch higher-margin product line",
      description: "Develop and introduce premium menu items or services with 70%+ gross margins",
      impact: "High",
      effort: "High",
      timeframe: "4-8 months",
      potentialSavings: "$8,000-12,000/month",
      category: "Revenue Growth",
    },
    {
      id: "technology-automation",
      title: "Implement operational automation",
      description: "Deploy POS integration, inventory management, and automated scheduling to reduce labor costs",
      impact: "High",
      effort: "High",
      timeframe: "6-12 months",
      potentialSavings: "25% operational efficiency",
      category: "Operations",
    },
    {
      id: "market-expansion",
      title: "Expand to new market segments",
      description: "Develop catering, corporate lunch programs, or delivery-only concepts to diversify revenue streams",
      impact: "High",
      effort: "High",
      timeframe: "6-18 months",
      potentialSavings: "40-60% revenue increase",
      category: "Market Expansion",
    },
    {
      id: "loyalty-program",
      title: "Implement customer loyalty program",
      description: "Create comprehensive loyalty program with mobile app to increase customer retention and frequency",
      impact: "Medium",
      effort: "Medium",
      timeframe: "3-4 months",
      potentialSavings: "20% customer retention improvement",
      category: "Customer Retention",
    },
    {
      id: "franchise-model",
      title: "Develop franchise model",
      description: "Create scalable franchise system to expand brand presence without capital investment",
      impact: "Very High",
      effort: "Very High",
      timeframe: "12-24 months",
      potentialSavings: "300-500% revenue potential",
      category: "Business Model",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "green":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-800",
          icon: "text-green-600",
          badge: "bg-green-100 text-green-800",
        };
      case "amber":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-800",
          icon: "text-yellow-600",
          badge: "bg-yellow-100 text-yellow-800",
        };
      case "red":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-800",
          icon: "text-red-600",
          badge: "bg-red-100 text-red-800",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-800",
          icon: "text-gray-600",
          badge: "bg-gray-100 text-gray-800",
        };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "green":
        return "Healthy";
      case "amber":
        return "Caution";
      case "red":
        return "Critical";
      default:
        return "Unknown";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Very High":
        return "bg-purple-100 text-purple-800";
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "Very High":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading next steps...</p>
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Next Steps"
          description="Strategic recommendations and priority action areas for your business"
          icon={<Target className="w-8 h-8 text-oxford_blue-600" />}
        />
        {/* Priority Areas Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Target className="w-6 h-6 text-oxford_blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Priority Action Areas (Ranked by Impact)</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Critical</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Caution</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Healthy</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {priorityAreas.map((area, index) => {
              const Icon = area.icon;
              const colors = getStatusColor(area.status);

              return (
                <div key={area.id} className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-3 bg-white rounded-lg mr-3 shadow-sm`}>
                        <Icon className={`w-6 h-6 ${colors.icon}`} />
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${colors.text}`}>{area.title}</h3>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors.badge}`}>{getStatusLabel(area.status)}</span>
                          <span className="ml-2 text-sm text-gray-600">Priority #{index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {area.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                          <span className={`text-sm font-bold ${colors.text}`}>{metric.value}</span>
                        </div>
                        <p className="text-xs text-gray-600">{metric.detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start">
                      <AlertTriangle className={`w-4 h-4 ${colors.icon} mr-2 mt-0.5 flex-shrink-0`} />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Recommended Action:</span>
                        <p className={`text-sm ${colors.text} mt-1 font-medium`}>{area.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Quick Wins Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <Zap className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Quick Wins</h2>
              <p className="text-sm text-gray-600">Immediate actions with high impact and low effort</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickWins.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-green-700 mb-3">{item.description}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Impact</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(item.impact)}`}>{item.impact}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Effort</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEffortColor(item.effort)}`}>{item.effort}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Timeframe</span>
                    <span className="text-xs font-medium text-gray-800">{item.timeframe}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Potential Savings</span>
                    <span className="text-xs font-bold text-green-600">{item.potentialSavings}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-green-200">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Strategic Shifts Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <Target className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Strategic Shifts</h2>
              <p className="text-sm text-gray-600">Long-term initiatives for sustainable growth and competitive advantage</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategicShifts.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-blue-700 mb-4">{item.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Impact</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(item.impact)}`}>{item.impact}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Effort</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEffortColor(item.effort)}`}>{item.effort}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Timeframe</span>
                      <span className="text-xs font-medium text-gray-800">{item.timeframe}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Potential</span>
                      <span className="text-xs font-bold text-blue-600">{item.potentialSavings}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-200">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>{" "}
        {/* View Mode Toggle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BarChart3 className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Implementation Roadmap</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Timeline View
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("priority")}
                  className={`px-3 py-2 text-sm rounded-md ${viewMode === "priority" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  Priority
                </button>
                <button
                  onClick={() => setViewMode("timeline")}
                  className={`px-3 py-2 text-sm rounded-md ${viewMode === "timeline" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                  Timeline
                </button>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                Team View
              </div>
            </div>
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phase 1: Immediate (0-30 days) */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Immediate Actions</h3>
                  <p className="text-sm text-green-600">0-30 days</p>
                </div>
              </div>
              <div className="space-y-3">
                {quickWins
                  .filter((item) => item.timeframe.includes("week") || item.timeframe === "Immediate")
                  .slice(0, 4)
                  .map((item) => (
                    <div key={item.id} className="flex items-center text-sm text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{item.title}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Phase 2: Short-term (1-6 months) */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">Short-term Initiatives</h3>
                  <p className="text-sm text-yellow-600">1-6 months</p>
                </div>
              </div>
              <div className="space-y-3">
                {strategicShifts
                  .filter((item) => item.timeframe.includes("3-") || item.timeframe.includes("4-") || item.timeframe.includes("6"))
                  .slice(0, 4)
                  .map((item) => (
                    <div key={item.id} className="flex items-center text-sm text-yellow-700">
                      <ArrowRight className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{item.title}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Phase 3: Long-term (6+ months) */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">Long-term Strategy</h3>
                  <p className="text-sm text-blue-600">6+ months</p>
                </div>
              </div>
              <div className="space-y-3">
                {strategicShifts
                  .filter((item) => item.timeframe.includes("12-") || item.timeframe.includes("18"))
                  .map((item) => (
                    <div key={item.id} className="flex items-center text-sm text-blue-700">
                      <Target className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{item.title}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {/* Data Usage Indicator */}
          {data && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>Recommendations based on financial data from {data.inputData?.branches.length || 0} branch(es)</span>
                <Clock className="w-4 h-4 ml-4 mr-2" />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
        {/* Summary Footer */}
        <div className="bg-oxford_blue-50 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-oxford_blue-900 mb-2">Next Steps Summary</h3>
            <p className="text-sm text-oxford_blue-700">
              Focus on critical areas first, then work through caution items. Start with quick wins to build momentum, then implement strategic shifts for long-term growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextStepsPage;
