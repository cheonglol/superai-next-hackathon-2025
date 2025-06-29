import React, { useState } from "react";
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  Calendar, 
  Target, 
  Plus, 
  X, 
  ArrowRight, 
  CheckCircle, 
  RefreshCw,
  BarChart3
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
      monthlyImpact: -3700, // 20% of 8000
      oneTimeImpact: 0,
      startMonth: 1,
      active: false,
    },
    {
      id: "new-hire",
      name: "New Hire",
      type: "expense",
      description: "Hiring additional chef",
      monthlyImpact: -5850,
      oneTimeImpact: -1000, // Onboarding costs
      startMonth: 1,
      active: false,
    },
    {
      id: "equipment-purchase",
      name: "Big Purchase",
      type: "expense",
      description: "New commercial oven (24-month financing)",
      monthlyImpact: -3750, // $15,000 over 24 months
      oneTimeImpact: -3000, // Down payment
      startMonth: 2,
      active: false,
    },
    {
      id: "price-increase",
      name: "Price Increase",
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

  // Generate cash flow projection with seasonal patterns
  const generateProjection = () => {
    const impact = calculateScenarioImpact();
    const projection = [];
    
    // Start with current cash balance from Liquidity Guardian (48,920)
    let runningCash = 48920;
    
    // Seasonal factors based on historical data (derived from the financial data)
    // The data shows revenue growth from 2015-2018 with seasonal patterns
    const seasonalFactors = [
      0.85,  // Month 1 (lower season)
      0.90,  // Month 2 (building up)
      1.10,  // Month 3 (high season)
      1.20,  // Month 4 (peak season)
      1.05,  // Month 5 (tapering off)
      0.90,  // Month 6 (returning to normal)
      0.80,  // Month 7
      0.75,  // Month 8
      0.85,  // Month 9
      0.95,  // Month 10
      1.15,  // Month 11 (holiday season)
      1.25   // Month 12 (peak holiday season)
    ];
    
    for (let month = 1; month <= timeHorizon; month++) {
      // Apply seasonal factor to monthly cash flow
      const seasonalIndex = (month - 1) % 12;
      const seasonalFactor = seasonalFactors[seasonalIndex];
      
      // Base monthly cash flow with seasonal adjustment
      const seasonalCashFlow = impact.newMonthlyCashFlow * seasonalFactor;
      
      // Apply one-time costs for this month
      const oneTimeCost = impact.oneTimeImpacts[month] || 0;
      
      // Update running cash
      runningCash = runningCash + seasonalCashFlow + oneTimeCost;
      
      projection.push({
        month,
        cashFlow: seasonalCashFlow,
        oneTimeCost,
        runningCash,
        status: runningCash > safetyBuffer ? 'healthy' : 'critical',
        seasonalFactor
      });
    }
    
    return projection;
  };

  const projection = generateProjection();
  const impact = calculateScenarioImpact();
  
  // Update safety buffer when months change
  const updateSafetyBufferMonths = (months: number) => {
    setSafetyBufferMonths(months);
    
    // Calculate new safety buffer based on months
    // Safety buffer = X months of expenses + X months of loan installments
    const estimatedMonthlyLoanPayment = financialData.monthlyExpenses * 0.1;
    const newBuffer = (financialData.monthlyExpenses + estimatedMonthlyLoanPayment) * months;
    setSafetyBuffer(newBuffer);
  };

  // Calculate affordability thresholds
  const affordabilityThresholds = {
    maxRent: formatCurrency(financialData.currentRent * 1.2), // 20% more than current rent
    maxSalary: formatCurrency(financialData.averageSalary * 1.5), // 50% more than average salary
    maxEquipment: formatCurrency(financialData.currentCashFlow * 12 * 0.2), // 20% of annual cash flow
    maxMonthlyCommitment: formatCurrency(financialData.currentCashFlow * 0.3), // 30% of monthly cash flow
  };

  // Get month name for x-axis labels
  const getMonthName = (monthIndex: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentMonth = now.getMonth();
    const targetMonth = (currentMonth + monthIndex) % 12;
    return months[targetMonth];
  };

  return (
    <div className="space-y-6">
      {/* Affordability Thresholds - Horizontal Panel */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <Target className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Affordability Thresholds</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">Max Sustainable Rent</span>
            <span className="text-xl font-bold text-green-600">{affordabilityThresholds.maxRent}/mo</span>
            <span className="text-xs text-gray-500 mt-1">Current: {formatCurrency(financialData.currentRent)}/mo</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">Max New Salary</span>
            <span className="text-xl font-bold text-blue-600">{affordabilityThresholds.maxSalary}/mo</span>
            <span className="text-xs text-gray-500 mt-1">Per new hire capacity</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">Max Equipment Purchase</span>
            <span className="text-xl font-bold text-purple-600">{affordabilityThresholds.maxEquipment}</span>
            <span className="text-xs text-gray-500 mt-1">One-time purchase limit</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-1">Max Monthly Commitment</span>
            <span className="text-xl font-bold text-orange-600">{affordabilityThresholds.maxMonthlyCommitment}/mo</span>
            <span className="text-xs text-gray-500 mt-1">Any recurring expense</span>
          </div>
        </div>
      </div>
      
      {/* Main layout with 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Scenario Setup Panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
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
            
            {/* Safety Buffer Selector */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Safety Buffer</h4>
              <p className="text-xs text-gray-600 mb-2">
                Buffer = {safetyBufferMonths} month{safetyBufferMonths > 1 ? 's' : ''} of expenses + loan payments
              </p>
              <div className="flex items-center mb-2">
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={safetyBufferMonths}
                  onChange={(e) => updateSafetyBufferMonths(parseInt(e.target.value))}
                  className="flex-1 mr-3"
                />
                <span className="text-sm font-bold text-gray-900">{safetyBufferMonths} month{safetyBufferMonths > 1 ? 's' : ''}</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatCurrency(safetyBuffer)}
              </div>
            </div>
            
            {/* Run Simulation Button */}
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
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs text-gray-600">Projected</span>
                  </div>
                </div>
              </div>
              
              <div className="relative h-16 flex items-center">
                {/* Current Cash Flow Bar - Make this smaller than projected */}
                <div className="absolute top-0 left-0 h-8 bg-blue-100 rounded-lg w-full">
                  <div 
                    className="h-8 bg-blue-500 rounded-lg"
                    style={{ width: `${Math.min(100, Math.max(0, (financialData.currentCashFlow / (financialData.currentCashFlow * 2)) * 70))}%` }}
                  ></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white font-bold">
                    {formatCurrency(financialData.currentCashFlow)}/mo
                  </div>
                </div>
                
                {/* Projected Cash Flow Bar - Make this larger than current */}
                <div className="absolute bottom-0 left-0 h-8 bg-green-100 rounded-lg w-full">
                  <div 
                    className="h-8 bg-green-500 rounded-lg"
                    style={{ width: `${Math.min(100, Math.max(0, (Math.abs(impact.newMonthlyCashFlow) / (financialData.currentCashFlow * 2)) * 100))}%` }}
                  ></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white font-bold">
                    {formatCurrency(impact.newMonthlyCashFlow)}/mo
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cash Flow Projection Graph */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {timeHorizon}-Month Cash Flow Projection
              </h4>
              
              <div className="relative h-64 w-full bg-gray-50 border border-gray-200 rounded-lg p-4">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 py-2">
                  <div>{formatCurrency(Math.max(...projection.map(p => p.runningCash)) * 1.1).slice(0, -3)}K</div>
                  <div>{formatCurrency(Math.max(...projection.map(p => p.runningCash)) * 0.75).slice(0, -3)}K</div>
                  <div>{formatCurrency(Math.max(...projection.map(p => p.runningCash)) * 0.5).slice(0, -3)}K</div>
                  <div>{formatCurrency(Math.max(...projection.map(p => p.runningCash)) * 0.25).slice(0, -3)}K</div>
                  <div>{formatCurrency(0)}</div>
                </div>
                
                {/* Graph area */}
                <div className="absolute left-12 right-4 top-2 bottom-6 bg-white rounded border border-gray-100">
                  {/* Horizontal grid lines */}
                  <div className="absolute left-0 right-0 top-1/4 border-t border-gray-100"></div>
                  <div className="absolute left-0 right-0 top-2/4 border-t border-gray-100"></div>
                  <div className="absolute left-0 right-0 top-3/4 border-t border-gray-100"></div>
                  
                  {/* Safety buffer line */}
                  <div 
                    className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400"
                    style={{ 
                      top: `${100 - (safetyBuffer / Math.max(...projection.map(p => p.runningCash))) * 100}%` 
                    }}
                  >
                    <div className="absolute -top-6 right-0 bg-yellow-50 px-2 py-1 rounded text-xs text-yellow-600 font-medium">
                      Buffer: {formatCurrency(safetyBuffer)}
                    </div>
                  </div>
                  
                  {/* Cash flow line */}
                  <svg className="absolute inset-0 w-full h-full overflow-visible">
                    {/* Area under the line */}
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                      </linearGradient>
                    </defs>
                    
                    {/* Area fill */}
                    <path 
                      d={`
                        M0,${100 - (projection[0].runningCash / Math.max(...projection.map(p => p.runningCash))) * 100}
                        ${projection.map((point, i) => 
                          `L${(i / (projection.length - 1)) * 100},${100 - (point.runningCash / Math.max(...projection.map(p => p.runningCash))) * 100}`
                        ).join(' ')}
                        L100,100 L0,100 Z
                      `}
                      fill="url(#areaGradient)"
                    />
                    
                    {/* Line */}
                    <path 
                      d={`
                        M0,${100 - (projection[0].runningCash / Math.max(...projection.map(p => p.runningCash))) * 100}
                        ${projection.map((point, i) => 
                          `L${(i / (projection.length - 1)) * 100},${100 - (point.runningCash / Math.max(...projection.map(p => p.runningCash))) * 100}`
                        ).join(' ')}
                      `}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Data points */}
                    {projection.map((point, i) => (
                      <circle 
                        key={i}
                        cx={`${(i / (projection.length - 1)) * 100}%`}
                        cy={`${100 - (point.runningCash / Math.max(...projection.map(p => p.runningCash))) * 100}%`}
                        r="4"
                        fill={point.runningCash < safetyBuffer ? "#ef4444" : "#3b82f6"}
                        stroke="#fff"
                        strokeWidth="1"
                      />
                    ))}
                    
                    {/* One-time cost indicators */}
                    {projection.map((point, i) => point.oneTimeCost !== 0 && (
                      <g key={`cost-${i}`}>
                        <line 
                          x1={`${(i / (projection.length - 1)) * 100}%`}
                          y1={`${100 - (point.runningCash / Math.max(...projection.map(p => p.runningCash))) * 100}%`}
                          x2={`${(i / (projection.length - 1)) * 100}%`}
                          y2={`${100 - ((point.runningCash - point.oneTimeCost) / Math.max(...projection.map(p => p.runningCash))) * 100}%`}
                          stroke="#ef4444"
                          strokeWidth="2"
                          strokeDasharray="4"
                        />
                        <circle 
                          cx={`${(i / (projection.length - 1)) * 100}%`}
                          cy={`${100 - ((point.runningCash - point.oneTimeCost) / Math.max(...projection.map(p => p.runningCash))) * 100}%`}
                          r="3"
                          fill="#ef4444"
                        />
                      </g>
                    ))}
                  </svg>
                  
                  {/* Tooltips for data points */}
                  {projection.map((point, i) => (
                    <div 
                      key={`tooltip-${i}`}
                      className="absolute bg-white border border-gray-200 rounded shadow-md px-2 py-1 text-xs pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
                      style={{ 
                        left: `${(i / (projection.length - 1)) * 100}%`, 
                        top: `${100 - (point.runningCash / Math.max(...projection.map(p => p.runningCash))) * 100}%`,
                        transform: 'translate(-50%, -130%)'
                      }}
                    >
                      <div className="font-bold">{formatCurrency(point.runningCash)}</div>
                      <div>Month {point.month} ({getMonthName(point.month - 1)})</div>
                      {point.oneTimeCost !== 0 && (
                        <div className="text-red-600">One-time: {formatCurrency(point.oneTimeCost)}</div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* X-axis labels */}
                <div className="absolute left-12 right-4 bottom-0 h-6 flex justify-between text-xs text-gray-500">
                  {projection.map((point, i) => (
                    i % Math.max(1, Math.floor(projection.length / 6)) === 0 && (
                      <div key={`x-label-${i}`} className="text-center" style={{ width: `${100 / Math.min(6, projection.length)}%` }}>
                        {getMonthName(point.month - 1)}
                      </div>
                    )
                  ))}
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex justify-between items-center text-xs text-gray-600 mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                  <span>Cash Balance</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
                  <span>Safety Buffer</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span>Risk Zone</span>
                </div>
              </div>
            </div>
            
            {/* 6-Month Cash Flow Projection Table */}
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
                      <th className="text-center py-2 px-3 font-medium text-gray-900">Seasonal Factor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {projection.map((month) => (
                      <tr key={month.month} className={month.status === 'critical' ? 'bg-red-50' : ''}>
                        <td className="py-2 px-3 font-medium text-gray-900">
                          Month {month.month} ({getMonthName(month.month - 1)})
                        </td>
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
                        <td className="py-2 px-3 text-center">
                          <span className={month.seasonalFactor > 1 ? 'text-green-600' : month.seasonalFactor < 0.9 ? 'text-red-600' : 'text-gray-600'}>
                            {month.seasonalFactor.toFixed(2)}x
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Cash Flow Visualization */}
              <div className="mt-6">
                <div className="w-full bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Cash Runway Visualization</span>
                    <span className="text-xs text-gray-500">Months →</span>
                  </div>
                  <div className="relative h-12 w-full bg-gray-200 rounded-lg overflow-hidden">
                    {projection.map((month, index) => (
                      <div 
                        key={index}
                        className={`absolute h-full ${month.runningCash >= safetyBuffer ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ 
                          left: `${(index / timeHorizon) * 100}%`, 
                          width: `${(1 / timeHorizon) * 100}%`,
                          opacity: 0.7 + (0.3 * (index / timeHorizon))
                        }}
                      >
                      </div>
                    ))}
                    
                    {/* Safety threshold line */}
                    <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-yellow-500"></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    {Array.from({ length: Math.min(6, timeHorizon) }).map((_, index) => (
                      <div key={index} className="text-xs text-gray-500">
                        {getMonthName(index)}
                      </div>
                    ))}
                  </div>
                </div>
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
                  projection.some(month => month.runningCash < safetyBuffer) ? 'text-red-600' : 'text-green-600'
                }`}>
                  {projection.some(month => month.runningCash < safetyBuffer) ? 'High' : 'Low'}
                </div>
                <div className="text-xs text-gray-500">Based on safety buffer</div>
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
                      Your cash reserves are projected to fall below your safety buffer of {formatCurrency(safetyBuffer)} in month {projection.findIndex(month => month.runningCash < safetyBuffer) + 1} ({getMonthName(projection.findIndex(month => month.runningCash < safetyBuffer))}).
                      Consider reducing expenses or securing additional funding.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Seasonal Risk Warning */}
            {projection.some(month => month.seasonalFactor < 0.85) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Seasonal Low Period Detected</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your business shows significant seasonal variation with low periods in {
                        projection.filter(month => month.seasonalFactor < 0.85)
                          .map(month => getMonthName(month.month - 1))
                          .join(', ')
                      }. 
                      Consider building additional reserves before these periods.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {impact.monthlyImpact < 0 && Math.abs(impact.monthlyImpact) > financialData.currentCashFlow * 0.3 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
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
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
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
            
            {/* Seasonal Strategy */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">Seasonal Strategy</h4>
              <p className="text-xs text-blue-700 mb-3">
                Your business shows strong seasonal patterns with peaks in {getMonthName(3)} and {getMonthName(11)}-{getMonthName(0)}, 
                and lows in {getMonthName(6)}-{getMonthName(7)}.
              </p>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                  <p className="text-xs text-blue-700">Build cash reserves during peak months ({getMonthName(3)}, {getMonthName(11)}-{getMonthName(0)})</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                  <p className="text-xs text-blue-700">Reduce discretionary spending before low season ({getMonthName(5)}-{getMonthName(6)})</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                  <p className="text-xs text-blue-700">Consider seasonal promotions to boost low-season revenue</p>
                </div>
              </div>
            </div>
            
            {/* Plan Effectiveness Meter */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Plan Effectiveness</h4>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Adopted Plans</span>
                <span className="text-sm font-medium text-gray-900">$2,000 saved</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Projected Survival</span>
                <span className="text-sm font-medium text-green-600">6+ months</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
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
                    <option key={i+1} value={i+1}>Month {i+1} ({getMonthName(i)})</option>
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