import React, { useState, useEffect } from "react";
import { TrendingUp, BarChart3, DollarSign, Target, AlertTriangle, Clock, Users, Zap, Activity, CreditCard, CheckCircle, ArrowRight, ChevronDown, Calculator, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchFinancialData } from "@/store/slices/financialsSlice";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import ScenarioStressTester from "@/components/ScenarioStressTester";

const NextStepsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error, filters } = useAppSelector((state) => state.financials);
  const [viewMode, setViewMode] = useState<"priority" | "timeline">("priority");
  const [activeTab, setActiveTab] = useState<"diagnostician" | "stress-tester">("diagnostician");
  const [sortBy, setSortBy] = useState<"impact" | "timeframe" | "difficulty">("impact");

  // Scenario Stress Tester state
  const [scenarios, setScenarios] = useState([
    {
      id: 1,
      name: "Rent Increase",
      type: "expense",
      currentValue: 2500,
      newValue: 3200,
      monthlyImpact: -700,
      description: "Landlord proposing 28% rent increase",
      active: false,
    },
    {
      id: 2,
      name: "New Staff Hire",
      type: "expense",
      currentValue: 0,
      newValue: 3500,
      monthlyImpact: -3500,
      description: "Hiring additional chef",
      active: false,
    },
    {
      id: 3,
      name: "Equipment Purchase",
      type: "expense",
      currentValue: 0,
      newValue: 15000,
      monthlyImpact: -625,
      description: "New commercial oven (24-month financing)",
      active: false,
    },
    {
      id: 4,
      name: "Menu Price Increase",
      type: "revenue",
      currentValue: 85000,
      newValue: 91800,
      monthlyImpact: 6800,
      description: "8% across-the-board price increase",
      active: false,
    },
  ]);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchFinancialData(filters));
  }, [dispatch, filters]);

  const refetch = () => {
    dispatch(fetchFinancialData(filters));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Mock financial data for analysis
  const mockFinancialData = {
    currentMonthlyCashFlow: 15000,
    monthlyRevenue: 85000,
    monthlyExpenses: 70000,
    cashReserves: 45000,
    fixedCosts: 45000,
    variableCosts: 25000,
  };

  // Calculate scenario impact
  const calculateScenarioImpact = () => {
    const activeScenarios = scenarios.filter(s => s.active);
    const totalImpact = activeScenarios.reduce((sum, scenario) => sum + scenario.monthlyImpact, 0);
    const newCashFlow = mockFinancialData.currentMonthlyCashFlow + totalImpact;
    
    return {
      totalImpact,
      newCashFlow,
      activeScenarios,
      affordabilityThreshold: mockFinancialData.currentMonthlyCashFlow + mockFinancialData.cashReserves / 6, // 6-month buffer
    };
  };

  const scenarioImpact = calculateScenarioImpact();

  // Generate 6-month projection
  const generateProjection = () => {
    const projection = [];
    let runningCash = mockFinancialData.cashReserves;
    
    for (let month = 1; month <= 6; month++) {
      runningCash += scenarioImpact.newCashFlow;
      projection.push({
        month: `Month ${month}`,
        cashFlow: scenarioImpact.newCashFlow,
        cumulativeCash: runningCash,
        status: runningCash > 0 ? 'healthy' : 'critical'
      });
    }
    
    return projection;
  };

  const projection = generateProjection();

  const toggleScenario = (id: number) => {
    setScenarios(prev => prev.map(scenario => 
      scenario.id === id ? { ...scenario, active: !scenario.active } : scenario
    ));
  };

  // Priority Areas Overview
  const priorityAreas = [
    {
      id: "cashFlow",
      title: "Cash Flow Crisis?",
      icon: DollarSign,
      status: mockFinancialData.cashReserves / (mockFinancialData.monthlyExpenses - mockFinancialData.currentMonthlyCashFlow) > 6 ? "green" : 
              mockFinancialData.cashReserves / (mockFinancialData.monthlyExpenses - mockFinancialData.currentMonthlyCashFlow) > 3 ? "amber" : "red",
      metrics: [
        {
          label: "Cash Burn Rate",
          value: `${Math.floor(mockFinancialData.cashReserves / mockFinancialData.monthlyExpenses)} months runway left`,
          detail: `${formatCurrency(mockFinancialData.monthlyExpenses)}/month burn rate`,
        },
        {
          label: "Top Cash Outflows",
          value: "Payroll (40%), Rent (15%), Marketing (12%)",
          detail: "Biggest expenses to optimize",
        },
      ],
      recommendation: mockFinancialData.cashReserves / mockFinancialData.monthlyExpenses < 3
        ? "URGENT: Reduce overhead costs by 25% or secure short-term financing immediately."
        : "Maintain current cash management practices and optimize working capital.",
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
      cashFlowImpact: 2500,
      difficulty: "Easy",
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
      cashFlowImpact: 3200,
      difficulty: "Easy",
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
      cashFlowImpact: 8000,
      difficulty: "Medium",
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
      cashFlowImpact: 5000,
      difficulty: "Medium",
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
      cashFlowImpact: 450,
      difficulty: "Easy",
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
      cashFlowImpact: 1800,
      difficulty: "Hard",
    },
  ];

  const getSortedQuickWins = () => {
    const sorted = [...quickWins];
    switch (sortBy) {
      case "impact":
        return sorted.sort((a, b) => b.cashFlowImpact - a.cashFlowImpact);
      case "timeframe":
        const timeframeOrder = { "Immediate": 0, "1 week": 1, "2 weeks": 2, "1-2 weeks": 3, "2-3 weeks": 4 };
        return sorted.sort((a, b) => (timeframeOrder[a.timeframe as keyof typeof timeframeOrder] || 5) - (timeframeOrder[b.timeframe as keyof typeof timeframeOrder] || 5));
      case "difficulty":
        const difficultyOrder = { "Easy": 0, "Medium": 1, "Hard": 2 };
        return sorted.sort((a, b) => (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 3) - (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 3));
      default:
        return sorted;
    }
  };

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
          title="Cash Flow Management"
          description="Strategic recommendations and scenario planning for your business"
          icon={<Target className="w-8 h-8 text-oxford_blue-600" />}
        />

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("diagnostician")}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "diagnostician" ? "bg-oxford_blue-600 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Activity className="w-4 h-4 mr-2" />
              Cash Flow Diagnostician
            </button>
            <button
              onClick={() => setActiveTab("stress-tester")}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "stress-tester" ? "bg-oxford_blue-600 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Scenario Stress Tester
            </button>
          </div>
        </div>

        {activeTab === "diagnostician" && (
          <>
            {/* Priority Areas Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Target className="w-6 h-6 text-oxford_blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Priority Action Areas</h2>
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

              <div className="grid grid-cols-1 gap-6">
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
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Zap className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Prioritised Corrective Actions</h2>
                    <p className="text-sm text-gray-600">Immediate actions with high impact and low effort</p>
                  </div>
                </div>
                
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "impact" | "timeframe" | "difficulty")}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-oxford_blue-500 focus:border-transparent"
                  >
                    <option value="impact">Sort by Cash Flow Impact</option>
                    <option value="timeframe">Sort by Timeframe</option>
                    <option value="difficulty">Sort by Difficulty</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getSortedQuickWins().map((item) => (
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
          </>
        )}

        {activeTab === "stress-tester" && (
          <ScenarioStressTester 
            mockFinancialData={{
              currentCashFlow: 15000,
              monthlyRevenue: 85000,
              monthlyExpenses: 70000,
              currentRent: 8000,
              currentStaff: 12,
              averageSalary: 3500,
            }}
            formatCurrency={formatCurrency}
          />
        )}

        {/* Summary Footer */}
        <div className="mt-8 bg-oxford_blue-50 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-oxford_blue-900 mb-2">Cash Flow Management Summary</h3>
            <p className="text-sm text-oxford_blue-700">
              {activeTab === "diagnostician" 
                ? "Focus on critical areas first, then work through caution items. Start with quick wins to build momentum."
                : "Use scenario modeling to test potential changes before implementation. Maintain at least 3-6 months of cash reserves."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextStepsPage;