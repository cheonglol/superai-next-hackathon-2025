import React, { useState } from "react";
import { Calculator, TrendingUp, AlertTriangle, DollarSign, Calendar, Target, Plus, X, ArrowUpDown, ChevronDown } from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  type: "rent_increase" | "hiring" | "equipment_purchase" | "custom";
  monthlyImpact: number;
  oneTimeImpact: number;
  startMonth: number;
  description: string;
}

interface ScenarioStressTesterProps {
  mockFinancialData?: {
    currentCashFlow: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    currentRent: number;
    currentStaff: number;
    averageSalary: number;
  };
  formatCurrency: (amount: number) => string;
}

const ScenarioStressTester: React.FC<ScenarioStressTesterProps> = ({ mockFinancialData, formatCurrency }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [showAddScenario, setShowAddScenario] = useState(false);
  const [newScenario, setNewScenario] = useState<Partial<Scenario>>({
    type: "rent_increase",
    monthlyImpact: 0,
    oneTimeImpact: 0,
    startMonth: 1,
  });
  const [sortBy, setSortBy] = useState<"impact" | "timeframe" | "difficulty">("impact");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Default financial data if not provided
  const financialData = mockFinancialData || {
    currentCashFlow: 15000,
    monthlyRevenue: 85000,
    monthlyExpenses: 70000,
    currentRent: 8000,
    currentStaff: 12,
    averageSalary: 3500,
  };

  // Calculate 6-month cash flow projection with scenarios
  const calculateProjection = () => {
    const projection = [];
    let cumulativeCash = 50000; // Starting cash position

    for (let month = 1; month <= 6; month++) {
      let monthlyImpact = 0;
      let oneTimeImpact = 0;

      // Apply scenario impacts
      scenarios.forEach((scenario) => {
        if (month >= scenario.startMonth) {
          monthlyImpact += scenario.monthlyImpact;
        }
        if (month === scenario.startMonth) {
          oneTimeImpact += scenario.oneTimeImpact;
        }
      });

      const netCashFlow = financialData.currentCashFlow + monthlyImpact;
      cumulativeCash += netCashFlow - oneTimeImpact;

      projection.push({
        month,
        netCashFlow,
        oneTimeImpact,
        cumulativeCash,
        monthlyImpact,
      });
    }

    return projection;
  };

  // Calculate affordability thresholds
  const calculateAffordabilityThresholds = () => {
    const safetyBuffer = 20000; // Minimum cash buffer
    const availableCashFlow = financialData.currentCashFlow - safetyBuffer / 6; // Monthly available

    return {
      maxRent: Math.floor(financialData.currentRent + availableCashFlow * 0.3),
      maxSalaryBudget: Math.floor(availableCashFlow * 0.6),
      maxEquipmentPurchase: Math.floor(availableCashFlow * 6 * 0.8), // 6 months of available cash flow
      maxMonthlyCommitment: Math.floor(availableCashFlow),
    };
  };

  const addScenario = () => {
    if (newScenario.name && newScenario.type) {
      const scenario: Scenario = {
        id: Date.now().toString(),
        name: newScenario.name || "",
        type: newScenario.type,
        monthlyImpact: newScenario.monthlyImpact || 0,
        oneTimeImpact: newScenario.oneTimeImpact || 0,
        startMonth: newScenario.startMonth || 1,
        description: newScenario.description || "",
      };

      setScenarios([...scenarios, scenario]);
      setNewScenario({
        type: "rent_increase",
        monthlyImpact: 0,
        oneTimeImpact: 0,
        startMonth: 1,
      });
      setShowAddScenario(false);
    }
  };

  const removeScenario = (id: string) => {
    setScenarios(scenarios.filter((s) => s.id !== id));
  };

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case "rent_increase":
        return <DollarSign className="w-4 h-4" />;
      case "hiring":
        return <TrendingUp className="w-4 h-4" />;
      case "equipment_purchase":
        return <Calculator className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getScenarioColor = (type: string) => {
    switch (type) {
      case "rent_increase":
        return "bg-red-100 text-red-800";
      case "hiring":
        return "bg-blue-100 text-blue-800";
      case "equipment_purchase":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const projection = calculateProjection();
  const thresholds = calculateAffordabilityThresholds();
  const worstCashPosition = Math.min(...projection.map((p) => p.cumulativeCash));
  const isRisky = worstCashPosition < 10000;

  // Enhanced Sensitivity Analysis with different impacts
  const sensitivityAnalysis = {
    priceIncrease1Percent: {
      revenueImpact: financialData.monthlyRevenue * 0.01,
      profitImpact: financialData.monthlyRevenue * 0.01, // 100% flows to profit (highest impact)
      cashFlowImpact: financialData.monthlyRevenue * 0.01 * 0.85, // 85% after taxes
      priority: 1,
      difficulty: "Medium",
      timeframe: "1-3 months",
    },
    volumeIncrease1Percent: {
      revenueImpact: financialData.monthlyRevenue * 0.01,
      profitImpact: financialData.monthlyRevenue * 0.01 - financialData.monthlyExpenses * 0.01 * 0.7, // Revenue minus variable costs
      cashFlowImpact: (financialData.monthlyRevenue * 0.01 - financialData.monthlyExpenses * 0.01 * 0.7) * 0.85,
      priority: 4,
      difficulty: "Hard",
      timeframe: "3-6 months",
    },
    cogsDecrease1Percent: {
      revenueImpact: 0,
      profitImpact: financialData.monthlyExpenses * 0.01 * 0.7, // Direct cost savings (70% of expenses are COGS)
      cashFlowImpact: financialData.monthlyExpenses * 0.01 * 0.7 * 0.85,
      priority: 2,
      difficulty: "Medium",
      timeframe: "1-2 months",
    },
    opexDecrease1Percent: {
      revenueImpact: 0,
      profitImpact: financialData.monthlyExpenses * 0.01 * 0.3, // Direct expense reduction (30% of expenses are OpEx)
      cashFlowImpact: financialData.monthlyExpenses * 0.01 * 0.3 * 0.85,
      priority: 3,
      difficulty: "Easy",
      timeframe: "Immediate",
    },
  };

  // Get opportunities sorted by the selected metric
  const getOpportunities = () => {
    const opportunities = [
      { name: "1% Price Increase", ...sensitivityAnalysis.priceIncrease1Percent },
      { name: "1% COGS Decrease", ...sensitivityAnalysis.cogsDecrease1Percent },
      { name: "1% Operating Expenses Decrease", ...sensitivityAnalysis.opexDecrease1Percent },
      { name: "1% Volume Increase", ...sensitivityAnalysis.volumeIncrease1Percent },
    ];

    if (sortBy === "impact") {
      return opportunities.sort((a, b) => b.cashFlowImpact - a.cashFlowImpact);
    } else if (sortBy === "timeframe") {
      // Sort by timeframe (Immediate first, then by months)
      return opportunities.sort((a, b) => {
        if (a.timeframe === "Immediate" && b.timeframe !== "Immediate") return -1;
        if (a.timeframe !== "Immediate" && b.timeframe === "Immediate") return 1;
        
        // Extract numbers from timeframe strings
        const aMonths = a.timeframe.match(/\d+/g);
        const bMonths = b.timeframe.match(/\d+/g);
        
        if (!aMonths || !bMonths) return 0;
        return parseInt(aMonths[0]) - parseInt(bMonths[0]);
      });
    } else if (sortBy === "difficulty") {
      // Sort by difficulty (Easy first, then Medium, then Hard)
      const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
      return opportunities.sort((a, b) => {
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      });
    }
    
    return opportunities;
  };

  const sortedOpportunities = getOpportunities();

  return (
    <div className="space-y-6">
      {/* Affordability Thresholds */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 text-green-600 mr-2" />
          Affordability Thresholds
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-700 mb-1">Max Sustainable Rent</div>
            <div className="text-2xl font-bold text-green-800">{formatCurrency(thresholds.maxRent)}/mo</div>
            <div className="text-xs text-green-600">Current: {formatCurrency(financialData.currentRent)}/mo</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-700 mb-1">Max New Salary Budget</div>
            <div className="text-2xl font-bold text-blue-800">{formatCurrency(thresholds.maxSalaryBudget)}/mo</div>
            <div className="text-xs text-blue-600">Per new hire capacity</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-purple-700 mb-1">Max Equipment Purchase</div>
            <div className="text-2xl font-bold text-purple-800">{formatCurrency(thresholds.maxEquipmentPurchase)}</div>
            <div className="text-xs text-purple-600">One-time purchase limit</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="text-sm text-orange-700 mb-1">Max Monthly Commitment</div>
            <div className="text-2xl font-bold text-orange-800">{formatCurrency(thresholds.maxMonthlyCommitment)}/mo</div>
            <div className="text-xs text-orange-600">Any recurring expense</div>
          </div>
        </div>
      </div>

      {/* Scenario Management */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calculator className="w-5 h-5 text-blue-600 mr-2" />
            What-If Scenarios
          </h3>
          <button
            onClick={() => setShowAddScenario(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Scenario
          </button>
        </div>

        {/* Active Scenarios */}
        {scenarios.length > 0 && (
          <div className="space-y-3 mb-6">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${getScenarioColor(scenario.type)}`}>{getScenarioIcon(scenario.type)}</div>
                  <div>
                    <div className="font-medium text-gray-900">{scenario.name}</div>
                    <div className="text-sm text-gray-600">
                      {scenario.monthlyImpact !== 0 && <span>{formatCurrency(Math.abs(scenario.monthlyImpact))}/mo </span>}
                      {scenario.oneTimeImpact !== 0 && <span>{formatCurrency(Math.abs(scenario.oneTimeImpact))} one-time </span>}
                      • Starts Month {scenario.startMonth}
                    </div>
                  </div>
                </div>
                <button onClick={() => removeScenario(scenario.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Scenario Form */}
        {showAddScenario && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Add New Scenario</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Name</label>
                <input
                  type="text"
                  value={newScenario.name || ""}
                  onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Rent increase to new location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Type</label>
                <select
                  value={newScenario.type}
                  onChange={(e) => setNewScenario({ ...newScenario, type: e.target.value as Scenario["type"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="rent_increase">Rent Increase</option>
                  <option value="hiring">New Hiring</option>
                  <option value="equipment_purchase">Equipment Purchase</option>
                  <option value="custom">Custom Scenario</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Impact ($)</label>
                <input
                  type="number"
                  value={newScenario.monthlyImpact || ""}
                  onChange={(e) => setNewScenario({ ...newScenario, monthlyImpact: -Math.abs(Number(e.target.value)) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Monthly cost increase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">One-time Cost ($)</label>
                <input
                  type="number"
                  value={Math.abs(newScenario.oneTimeImpact || 0)}
                  onChange={(e) => setNewScenario({ ...newScenario, oneTimeImpact: -Math.abs(Number(e.target.value)) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Upfront investment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Month</label>
                <select
                  value={newScenario.startMonth}
                  onChange={(e) => setNewScenario({ ...newScenario, startMonth: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map((month) => (
                    <option key={month} value={month}>
                      Month {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newScenario.description || ""}
                  onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional description"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowAddScenario(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addScenario}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Scenario
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6-Month Cash Flow Projection */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 text-purple-600 mr-2" />
            6-Month Cash Flow Projection
          </h3>
          {isRisky && (
            <div className="flex items-center text-red-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Cash Flow Risk Detected</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Month</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Base Cash Flow</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Scenario Impact</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">One-time Costs</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Net Cash Flow</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Cumulative Cash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projection.map((month) => (
                <tr key={month.month} className={month.cumulativeCash < 10000 ? "bg-red-50" : ""}>
                  <td className="py-3 px-4 font-medium text-gray-900">Month {month.month}</td>
                  <td className="py-3 px-4 text-center text-green-600 font-semibold">{formatCurrency(financialData.currentCashFlow)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={month.monthlyImpact < 0 ? "text-red-600" : month.monthlyImpact > 0 ? "text-green-600" : "text-gray-600"}>
                      {month.monthlyImpact !== 0 ? formatCurrency(month.monthlyImpact) : "-"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={month.oneTimeImpact < 0 ? "text-red-600" : "text-gray-600"}>
                      {month.oneTimeImpact !== 0 ? formatCurrency(Math.abs(month.oneTimeImpact)) : "-"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold">
                    <span className={month.netCashFlow < 0 ? "text-red-600" : "text-green-600"}>{formatCurrency(month.netCashFlow)}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold">
                    <span className={month.cumulativeCash < 10000 ? "text-red-600" : month.cumulativeCash < 25000 ? "text-yellow-600" : "text-green-600"}>
                      {formatCurrency(month.cumulativeCash)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Risk Assessment */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Risk Assessment</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(worstCashPosition)}</div>
              <div className="text-sm text-gray-600">Lowest Cash Position</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${isRisky ? "text-red-600" : "text-green-600"}`}>{isRisky ? "HIGH RISK" : "SAFE"}</div>
              <div className="text-sm text-gray-600">Risk Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{projection.filter((p) => p.cumulativeCash < 10000).length}</div>
              <div className="text-sm text-gray-600">Months Below Safety</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {scenarios.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            Scenario Recommendations
          </h3>
          <div className="space-y-3">
            {isRisky ? (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">High Risk Detected</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Your scenarios push cash flow below safety levels. Consider reducing scope, delaying implementation, or securing additional funding.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Scenarios Look Manageable</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Your planned scenarios maintain healthy cash flow levels. Monitor actual performance and adjust as needed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Optimization Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Consider phasing large expenses across multiple months</li>
                <li>• Negotiate payment terms to spread costs</li>
                <li>• Build in 20% buffer for unexpected costs</li>
                <li>• Review scenarios monthly and adjust projections</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Corrective Actions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Corrective Actions</h3>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort by: {sortBy === "impact" ? "Cash Flow Impact" : 
                        sortBy === "timeframe" ? "Timeframe" : "Difficulty"}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <ul className="py-1">
                  <li>
                    <button
                      onClick={() => {
                        setSortBy("impact");
                        setShowSortDropdown(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        sortBy === "impact" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Cash Flow Impact
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setSortBy("timeframe");
                        setShowSortDropdown(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        sortBy === "timeframe" ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Timeframe
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setSortBy("difficulty");
                        setShowSortDropdown(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        sortBy === "difficulty" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Difficulty
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Cash Flow Impact</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Profit Impact</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Difficulty</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Timeframe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedOpportunities.map((opportunity, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-3 px-4 font-medium text-gray-900">{opportunity.name}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-semibold ${opportunity.cashFlowImpact >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {opportunity.cashFlowImpact >= 0 ? "+" : ""}{formatCurrency(opportunity.cashFlowImpact)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-semibold ${opportunity.profitImpact >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {opportunity.profitImpact > 0 ? "+" : ""}{formatCurrency(opportunity.profitImpact)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      opportunity.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                      opportunity.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {opportunity.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">{opportunity.timeframe}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
};

export default ScenarioStressTester;