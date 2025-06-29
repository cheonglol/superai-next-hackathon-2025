import React, { useState } from "react";
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Calendar, 
  Target, 
  Plus, 
  X, 
  ArrowRight, 
  CheckCircle, 
  RefreshCw,
  BarChart3,
  TrendingDown
} from "lucide-react";

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
  // Default financial data if not provided
  const financialData = mockFinancialData || {
    currentCashFlow: 15000,
    monthlyRevenue: 85000,
    monthlyExpenses: 70000,
    currentRent: 8000,
    currentStaff: 12,
    averageSalary: 3500,
  };

  // Scenario state
  const [scenarios, setScenarios] = useState([
    {
      id: "rent-increase",
      name: "Rent Increase",
      type: "expense",
      description: "Rent increase of 20%",
      monthlyImpact: -1600, // 20% of 8000
      oneTimeImpact: 0,
      startMonth: 1,
      active: false,
    },
    {
      id: "new-hire",
      name: "New Staff Hire",
      type: "expense",
      description: "Hiring additional chef",
      monthlyImpact: -3500,
      oneTimeImpact: -1000, // Onboarding costs
      startMonth: 1,
      active: false,
    },
    {
      id: "equipment-purchase",
      name: "Equipment Purchase",
      type: "expense",
      description: "New commercial oven (24-month financing)",
      monthlyImpact: -625, // $15,000 over 24 months
      oneTimeImpact: -3000, // Down payment
      startMonth: 2,
      active: false,
    },
    {
      id: "price-increase",
      name: "Menu Price Increase",
      type: "revenue",
      description: "8% across-the-board price increase",
      monthlyImpact: 6800, // 8% of monthly revenue
      oneTimeImpact: -500, // Menu reprinting costs
      startMonth: 1,
      active: false,
    },
  ]);

  // Custom scenario form state
  const [showAddScenario, setShowAddScenario] = useState(false);
  const [newScenario, setNewScenario] = useState({
    name: "",
    type: "expense",
    description: "",
    monthlyImpact: 0,
    oneTimeImpact: 0,
    startMonth: 1,
  });

  // Time horizon state
  const [timeHorizon, setTimeHorizon] = useState(6); // 6 months by default
  
  // Safety buffer state - default is 1 month of expenses + 1 month of loan installments
  const [safetyBufferMonths, setSafetyBufferMonths] = useState(1);
  
  // Calculate the default safety buffer (1 month expenses + 1 month loan installments)
  const calculateDefaultSafetyBuffer = () => {
    // Estimate monthly loan installment (assuming 10% of expenses are loan payments)
    const estimatedMonthlyLoanPayment = financialData.monthlyExpenses * 0.1;
    return financialData.monthlyExpenses + estimatedMonthlyLoanPayment;
  };
  
  const [safetyBuffer, setSafetyBuffer] = useState(calculateDefaultSafetyBuffer());

  // Resilience score calculation
  const calculateResilienceScore = (cashFlow: number, reserves: number) => {
    // Simple formula: higher is better, max 100
    const score = Math.min(100, Math.max(0, 50 + (cashFlow / 1000) + (reserves / 10000)));
    return Math.round(score);
  };

  // Toggle scenario active state
  const toggleScenario = (id: string) => {
    setScenarios(prev => 
      prev.map(scenario => 
        scenario.id === id ? { ...scenario, active: !scenario.active } : scenario
      )
    );
  };

  // Add new custom scenario
  const addCustomScenario = () => {
    if (!newScenario.name) return;
    
    const id = `custom-${Date.now()}`;
    setScenarios([...scenarios, {
      id,
      name: newScenario.name,
      type: newScenario.type as "expense" | "revenue",
      description: newScenario.description || newScenario.name,
      monthlyImpact: newScenario.type === "expense" ? -Math.abs(newScenario.monthlyImpact) : Math.abs(newScenario.monthlyImpact),
      oneTimeImpact: newScenario.type === "expense" ? -Math.abs(newScenario.oneTimeImpact) : Math.abs(newScenario.oneTimeImpact),
      startMonth: newScenario.startMonth,
      active: false,
    }]);
    
    setNewScenario({
      name: "",
      type: "expense",
      description: "",
      monthlyImpact: 0,
      oneTimeImpact: 0,
      startMonth: 1,
    });
    
    setShowAddScenario(false);
  };

  // Calculate scenario impact
  const calculateScenarioImpact = () => {
    const activeScenarios = scenarios.filter(s => s.active);
    
    // Calculate monthly impact
    const monthlyImpact = activeScenarios.reduce((sum, scenario) => sum + scenario.monthlyImpact, 0);
    
    // Calculate one-time impacts
    const oneTimeImpacts = {};
    activeScenarios.forEach(scenario => {
      const month = scenario.startMonth;
      if (!oneTimeImpacts[month]) oneTimeImpacts[month] = 0;
      oneTimeImpacts[month] += scenario.oneTimeImpact;
    });
    
    // Calculate new cash flow
    const newMonthlyCashFlow = financialData.currentCashFlow + monthlyImpact;
    
    // Calculate affordability threshold
    const affordabilityThreshold = financialData.currentCashFlow * 0.8; // 80% of current cash flow
    
    return {
      activeScenarios,
      monthlyImpact,
      oneTimeImpacts,
      newMonthlyCashFlow,
      affordabilityThreshold,
      isAffordable: newMonthlyCashFlow > affordabilityThreshold,
    };
  };

  // Generate cash flow projection
  const generateProjection = () => {
    const impact = calculateScenarioImpact();
    const projection = [];
    let runningCash = financialData.currentCashFlow * 3; // Starting with 3 months of cash reserves
    
    for (let month = 1; month <= timeHorizon; month++) {
      // Apply monthly cash flow
      const monthCashFlow = impact.newMonthlyCashFlow;
      
      // Apply one-time costs for this month
      const oneTimeCost = impact.oneTimeImpacts[month] || 0;
      
      // Update running cash
      runningCash = runningCash + monthCashFlow + oneTimeCost;
      
      projection.push({
        month,
        cashFlow: monthCashFlow,
        oneTimeCost,
        runningCash,
        status: runningCash > safetyBuffer ? 'healthy' : 'critical'
      });
    }
    
    return projection;
  };

  const projection = generateProjection();
  const impact = calculateScenarioImpact();
  
  // Calculate resilience scores
  const currentResilienceScore = calculateResilienceScore(
    financialData.currentCashFlow, 
    financialData.currentCashFlow * 3 // Starting cash reserves
  );
  
  const projectedResilienceScore = calculateResilienceScore(
    impact.newMonthlyCashFlow,
    projection[projection.length - 1].runningCash
  );

  // Calculate affordability thresholds
  const affordabilityThresholds = {
    maxRent: formatCurrency(financialData.currentRent * 1.2), // 20% more than current rent
    maxSalary: formatCurrency(financialData.averageSalary * 1.5), // 50% more than average salary
    maxEquipment: formatCurrency(financialData.currentCashFlow * 12 * 0.2), // 20% of annual cash flow
    maxMonthlyCommitment: formatCurrency(financialData.currentCashFlow * 0.3), // 30% of monthly cash flow
  };
  
  // Update safety buffer when months change
  const updateSafetyBufferMonths = (months: number) => {
    setSafetyBufferMonths(months);
    
    // Calculate new safety buffer based on months
    // Safety buffer = X months of expenses + X months of loan installments
    const estimatedMonthlyLoanPayment = financialData.monthlyExpenses * 0.1;
    const newBuffer = (financialData.monthlyExpenses + estimatedMonthlyLoanPayment) * months;
    setSafetyBuffer(newBuffer);
  };

  return (
    <div className="space-y-6">
      {/* Main layout with 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Scenario Setup Panel */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          <div className="bg-white rounded-lg p-6 border border-gray-200 flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 text-blue-600 mr-2" />
              Scenario Setup
            </h3>
            
            {/* Adverse Event Selector */}
            <div className="space-y-3 mb-6">
              {scenarios.map(scenario => (
                <div 
                  key={scenario.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    scenario.active 
                      ? scenario.type === 'expense' 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => toggleScenario(scenario.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-sm mr-2 flex items-center justify-center ${
                        scenario.active ? (scenario.type === 'expense' ? 'bg-red-500' : 'bg-green-500') : 'border border-gray-400'
                      }`}>
                        {scenario.active && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className="font-medium">{scenario.name}</span>
                    </div>
                    <span className={`text-sm ${scenario.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                      {scenario.monthlyImpact > 0 ? '+' : ''}{formatCurrency(scenario.monthlyImpact)}/mo
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{scenario.description}</p>
                </div>
              ))}
              
              {/* Add Custom Scenario Button */}
              <button
                onClick={() => setShowAddScenario(true)}
                className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Scenario
              </button>
            </div>
            
            {/* Time Horizon Selector */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Time Horizon</h4>
              <div className="flex space-x-2">
                {[3, 6, 12].map(months => (
                  <button
                    key={months}
                    onClick={() => setTimeHorizon(months)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                      timeHorizon === months 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {months} Months
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => {
                // This would trigger a more complex simulation in a real app
                // For now, we'll just refresh the component state
                setScenarios([...scenarios]);
              }}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Simulation
            </button>
          </div>
        </div>
        
        {/* Center Column - Impact Visualization */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
              Cash Flow Impact Visualization
            </h3>
            
            {/* Cash Flow Thermometer */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Monthly Cash Flow</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span className="text-xs text-gray-600">Current</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span className="text-xs text-gray-600">Projected</span>
                  </div>
                </div>
              </div>
              
              <div className="relative h-16 flex items-center">
                {/* Current Cash Flow Bar */}
                <div className="absolute top-0 left-0 h-8 bg-blue-100 rounded-lg w-full">
                  <div 
                    className="h-8 bg-blue-500 rounded-lg"
                    style={{ width: `${Math.min(100, Math.max(0, (financialData.currentCashFlow / (financialData.currentCashFlow * 2)) * 100))}%` }}
                  ></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white font-bold">
                    {formatCurrency(financialData.currentCashFlow)}/mo
                  </div>
                </div>
                
                {/* Projected Cash Flow Bar - Make it less than current */}
                <div className="absolute bottom-0 left-0 h-8 bg-red-100 rounded-lg w-full">
                  <div 
                    className={`h-8 ${impact.newMonthlyCashFlow >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded-lg`}
                    style={{ 
                      width: `${Math.min(100, Math.max(0, (Math.abs(impact.newMonthlyCashFlow) / (financialData.currentCashFlow * 2)) * 100 * 0.8))}%` 
                    }}
                  ></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white font-bold">
                    {formatCurrency(impact.newMonthlyCashFlow)}/mo
                  </div>
                </div>
              </div>
            </div>
            
            {/* 6-Month Cash Flow Projection */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {timeHorizon}-Month Cash Flow Projection
              </h4>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-900">Month</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-900">Cash Flow</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-900">One-time Costs</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-900">Running Cash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {projection.map((month) => (
                      <tr key={month.month} className={month.status === 'critical' ? 'bg-red-50' : ''}>
                        <td className="py-2 px-3 font-medium text-gray-900">Month {month.month}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={month.cashFlow >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {formatCurrency(month.cashFlow)}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {month.oneTimeCost !== 0 ? (
                            <span className="text-red-600 font-semibold">
                              {formatCurrency(month.oneTimeCost)}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center font-bold">
                          <span className={month.runningCash >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(month.runningCash)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Risk Assessment */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              Risk Assessment
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Cash Buffer</div>
                <div className="text-xl font-bold text-gray-900">{formatCurrency(projection[projection.length - 1].runningCash)}</div>
                <div className="text-xs text-gray-500">End of period cash position</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Monthly Impact</div>
                <div className={`text-xl font-bold ${impact.monthlyImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {impact.monthlyImpact >= 0 ? '+' : ''}{formatCurrency(impact.monthlyImpact)}
                </div>
                <div className="text-xs text-gray-500">Change to monthly cash flow</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Risk Level</div>
                <div className={`text-xl font-bold ${
                  projectedResilienceScore > 75 ? 'text-green-600' : 
                  projectedResilienceScore > 50 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {projectedResilienceScore > 75 ? 'Low' : 
                   projectedResilienceScore > 50 ? 'Medium' : 
                   'High'}
                </div>
                <div className="text-xs text-gray-500">Based on resilience score</div>
              </div>
            </div>
            
            {/* Risk Warnings */}
            {projection.some(month => month.runningCash < safetyBuffer) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Cash Flow Risk Detected</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Your cash reserves are projected to fall below your safety buffer of {formatCurrency(safetyBuffer)} in month {projection.findIndex(month => month.runningCash < safetyBuffer) + 1}.
                      Consider reducing expenses or securing additional funding.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {impact.monthlyImpact < 0 && Math.abs(impact.monthlyImpact) > financialData.currentCashFlow * 0.3 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">High Monthly Impact</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      The selected scenarios would reduce your monthly cash flow by more than 30%.
                      This may put strain on your business operations.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Contingency Planner */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          <div className="bg-white rounded-lg p-6 border border-gray-200 flex-grow h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 text-purple-600 mr-2" />
              Contingency Planner
            </h3>
            
            {/* Automated Recommendations */}
            <div className="space-y-3 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-green-800">Defer tax payment</span>
                  <div className="flex items-center">
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">High Impact</span>
                  </div>
                </div>
                <p className="text-xs text-green-700 mb-2">Saves $1,200/month | Resilience Boost: +18 points</p>
                <button className="text-xs flex items-center text-green-700 hover:text-green-800">
                  Apply to simulation <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-blue-800">Negotiate supplier terms</span>
                  <div className="flex items-center">
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Medium Impact</span>
                  </div>
                </div>
                <p className="text-xs text-blue-700 mb-2">Frees $800/mo | Resilience Boost: +12 points</p>
                <button className="text-xs flex items-center text-blue-700 hover:text-blue-800">
                  Apply to simulation <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-purple-800">Activate emergency credit line</span>
                  <div className="flex items-center">
                    <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">High Impact</span>
                  </div>
                </div>
                <p className="text-xs text-purple-700 mb-2">$5,000 buffer | Risk: Medium</p>
                <button className="text-xs flex items-center text-purple-700 hover:text-purple-800">
                  Apply to simulation <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Affordability Thresholds - full width below main grid */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 text-green-600 mr-2" />
          Affordability Thresholds
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="text-sm text-green-700 mb-1">Max Sustainable Rent</div>
            <div className="text-xl font-bold text-green-800">{affordabilityThresholds.maxRent}/mo</div>
            <div className="text-xs text-green-600">Current: {formatCurrency(financialData.currentRent)}/mo</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-sm text-blue-700 mb-1">Max New Salary</div>
            <div className="text-xl font-bold text-blue-800">{affordabilityThresholds.maxSalary}/mo</div>
            <div className="text-xs text-blue-600">Per new hire capacity</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <div className="text-sm text-purple-700 mb-1">Max Equipment Purchase</div>
            <div className="text-xl font-bold text-purple-800">{affordabilityThresholds.maxEquipment}</div>
            <div className="text-xs text-purple-600">One-time purchase limit</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
            <div className="text-sm text-orange-700 mb-1">Max Monthly Commitment</div>
            <div className="text-xl font-bold text-orange-800">{affordabilityThresholds.maxMonthlyCommitment}/mo</div>
            <div className="text-xs text-orange-600">Any recurring expense</div>
          </div>
        </div>
      </div>
      
      {/* Add Custom Scenario Modal */}
      {showAddScenario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Custom Scenario</h3>
              <button onClick={() => setShowAddScenario(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scenario Name</label>
                <input
                  type="text"
                  value={newScenario.name}
                  onChange={(e) => setNewScenario({...newScenario, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., New Marketing Campaign"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newScenario.type}
                  onChange={(e) => setNewScenario({...newScenario, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="expense">Expense (Cost)</option>
                  <option value="revenue">Revenue (Income)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Impact ($)</label>
                <input
                  type="number"
                  value={newScenario.monthlyImpact}
                  onChange={(e) => setNewScenario({...newScenario, monthlyImpact: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Monthly amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">One-time Cost/Benefit ($)</label>
                <input
                  type="number"
                  value={newScenario.oneTimeImpact}
                  onChange={(e) => setNewScenario({...newScenario, oneTimeImpact: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="One-time amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Month</label>
                <select
                  value={newScenario.startMonth}
                  onChange={(e) => setNewScenario({...newScenario, startMonth: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: timeHorizon }, (_, i) => (
                    <option key={i+1} value={i+1}>Month {i+1}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  value={newScenario.description}
                  onChange={(e) => setNewScenario({...newScenario, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of this scenario"
                  rows={2}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddScenario(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={addCustomScenario}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Scenario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioStressTester;