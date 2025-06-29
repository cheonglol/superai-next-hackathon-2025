import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Calendar,
  Target,
  Zap,
  BarChart3,
  ArrowRight,
  RefreshCw,
  Percent
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { agentService } from '@/services/agentService';
import type { CashFlowData, CashFlowAnalysis } from '@/types/cashflow';

const CashFlowDiagnosticianPage: React.FC = () => {
  const [analysis, setAnalysis] = useState<CashFlowAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'metrics' | 'leakage' | 'onepercent' | 'actions'>('metrics');
  const [fyEndingDate, setFyEndingDate] = useState<string>('2024-12-31');

  // Helper function - defined early to avoid initialization issues
  const formatCurrency = (amount: number | string) => {
    if (typeof amount === 'string') {
      if (amount.startsWith('$')) return amount;
      return amount;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Financial data from the provided image
  const financialData = {
    // Latest year data (2018)
    revenue: 6612000,
    grossMargin: 1917500,
    operatingProfit: 701300,
    netProfit: 410000,
    depreciation: 100000,
    interestPaid: 176000,
    totalAssets: 5014000,
    cash: 0,
    accountsReceivable: 1443000,
    inventory: 1550000,
    totalCurrentAssets: 3064000,
    fixedAssets: 1800000,
    totalLiabilities: 3704000,
    accountsPayable: 590000,
    totalCurrentLiabilities: 2454000,
    bankLoansCurrent: 1643000,
    bankLoansNonCurrent: 1200000,
    
    // Calculated values
    cogs: 6612000 - 1917500, // Revenue - Gross Margin = 4,694,500
    operatingExpenses: 1917500 - 701300, // Gross Margin - Operating Profit = 1,216,200
    
    // For cash flow calculation
    distributions: 150000, // Dividends from 2018
  };

  // Calculate metrics based on the financial data
  const calculateMetrics = () => {
    // Operating Cash Flow (estimated since we don't have direct cash flow statement)
    const estimatedOperatingCashFlow = financialData.operatingProfit + financialData.depreciation - financialData.interestPaid;
    
    // Days calculations
    const dso = (financialData.accountsReceivable / financialData.revenue) * 365; // Days Sales Outstanding
    const dio = (financialData.inventory / financialData.cogs) * 365; // Days Inventory Outstanding
    const dpo = (financialData.accountsPayable / financialData.cogs) * 365; // Days Payable Outstanding
    
    // Cash Conversion Cycle
    const ccc = dso + dio - dpo;
    
    // Working Capital
    const workingCapital = financialData.totalCurrentAssets - financialData.totalCurrentLiabilities;
    
    // Monthly expenses (estimated)
    const monthlyExpenses = financialData.cogs / 12 + financialData.operatingExpenses / 12;
    
    // Daily cash flow
    const dailyCashFlow = estimatedOperatingCashFlow / 365;
    
    // Burn rate (if negative cash flow)
    const burnRate = dailyCashFlow < 0 ? Math.abs(dailyCashFlow) : 0;
    
    // Cash reserve ratio (months of expenses covered by cash)
    // Since cash is 0, this would be 0, but we'll use a small value to avoid division by zero
    const effectiveCash = financialData.cash > 0 ? financialData.cash : 10000; // Assuming some minimal cash
    const cashReserveRatio = effectiveCash / monthlyExpenses;
    
    // Runway (days of cash left at current burn rate)
    const runway = burnRate > 0 ? effectiveCash / burnRate : 0;
    
    // Gross profit to cash conversion
    const grossProfitToCashConversion = estimatedOperatingCashFlow / financialData.grossMargin;
    
    // Profit vs Cash Flow Gap
    const profitCashFlowGap = financialData.netProfit - estimatedOperatingCashFlow;
    
    // Cost of Sales to Cash Outflow (estimated)
    const costOfSalesToCashOutflow = financialData.cogs / (financialData.cogs + financialData.operatingExpenses - financialData.depreciation);
    
    // Debt Service Coverage Ratio
    const totalDebtService = financialData.interestPaid + (financialData.bankLoansCurrent * 0.1); // Assuming 10% principal repayment
    const dscr = financialData.operatingProfit / totalDebtService;
    
    // Operating Cash Flow Margin
    const operatingCashFlowMargin = (estimatedOperatingCashFlow / financialData.revenue) * 100;
    
    return {
      // Operating Cash Flow
      netOperatingCashFlow: estimatedOperatingCashFlow,
      operatingCashFlowMargin: operatingCashFlowMargin,
      cashConversionCycle: ccc,
      cashFlowPerDay: dailyCashFlow,
      
      // Working Capital Efficiency
      dso: dso,
      dio: dio,
      dpo: dpo,
      workingCapitalRatio: financialData.totalCurrentAssets / financialData.totalCurrentLiabilities,
      
      // Liquidity & Buffer
      cashReserveRatio: cashReserveRatio,
      burnRate: burnRate,
      runway: runway,
      
      // Revenue & Cost Impact
      grossProfitToCashConversion: grossProfitToCashConversion,
      profitCashFlowGap: profitCashFlowGap,
      costOfSalesToCashOutflow: costOfSalesToCashOutflow,
      
      // Financing & Debt-Related
      dscr: dscr
    };
  };

  const calculatedMetrics = calculateMetrics();

  // Cash flow metrics with real calculated values
  const cashFlowMetrics = [
    // Operating Cash Flow
    { name: 'Net Operating Cash Flow', value: `${formatCurrency(calculatedMetrics.netOperatingCashFlow)}`, category: 'operating', description: 'Cash generated from business operations.' },
    { name: 'Operating Cash Flow Margin (%)', value: `${calculatedMetrics.operatingCashFlowMargin.toFixed(1)}%`, category: 'operating', description: '% of sales that turns into cash.' },
    { name: 'Cash Conversion Cycle (CCC)', value: `${Math.round(calculatedMetrics.cashConversionCycle)} days`, category: 'operating', description: 'How long cash is tied up in operations.' },
    { name: 'Cash Flow per Day', value: `${formatCurrency(calculatedMetrics.cashFlowPerDay)}/day`, category: 'operating', description: 'Assess daily cash burn or gain.' },
    
    // Working Capital Efficiency
    { name: 'Days Sales Outstanding (DSO)', value: `${Math.round(calculatedMetrics.dso)} days`, category: 'working_capital', description: 'How fast customers pay you.' },
    { name: 'Days Inventory Outstanding (DIO)', value: `${Math.round(calculatedMetrics.dio)} days`, category: 'working_capital', description: 'How long stock is sitting before it\'s sold.' },
    { name: 'Days Payable Outstanding (DPO)', value: `${Math.round(calculatedMetrics.dpo)} days`, category: 'working_capital', description: 'How long you\'re taking to pay suppliers.' },
    { name: 'Working Capital Ratio', value: `${calculatedMetrics.workingCapitalRatio.toFixed(2)}`, category: 'working_capital', description: 'Short-term liquidity (1.2–2.0 is generally healthy).' },
    
    // Liquidity & Buffer
    { name: 'Cash Reserve Ratio', value: `${calculatedMetrics.cashReserveRatio.toFixed(1)} months`, category: 'liquidity', description: 'Number of months you can survive without revenue.' },
    { name: 'Burn Rate', value: `${formatCurrency(calculatedMetrics.burnRate)}/day`, category: 'liquidity', description: 'Monthly Operating Cash Outflows.' },
    { name: 'Runway', value: `${Math.round(calculatedMetrics.runway)} days`, category: 'liquidity', description: 'How long before the business runs out of money.' },
    
    // Revenue & Cost Impact
    { name: 'Gross Profit to Cash Conversion', value: `${calculatedMetrics.grossProfitToCashConversion.toFixed(2)}`, category: 'impact', description: 'How well gross profit turns into real cash.' },
    { name: 'Profit vs Cash Flow Gap', value: `${formatCurrency(calculatedMetrics.profitCashFlowGap)}`, category: 'impact', description: 'Differences due to timing & accruals.' },
    { name: 'Cost of Sales to Cash Outflow', value: `${calculatedMetrics.costOfSalesToCashOutflow.toFixed(2)}`, category: 'impact', description: 'Tracks overpayment or mismatch between cost and cash.' },
    
    // Financing & Debt-Related
    { name: 'Debt Service Coverage Ratio (DSCR)', value: `${calculatedMetrics.dscr.toFixed(2)}`, category: 'financing', description: 'Ability to service debt (ideal > 1.25x).' }
  ];

  // Leakage points based on actual metrics
  const leakagePoints = [
    { 
      category: 'Receivables', 
      issue: 'Extended collection period', 
      impact: `${formatCurrency(financialData.accountsReceivable * 0.1)}/month`, 
      severity: 'high',
      details: `Current DSO is ${Math.round(calculatedMetrics.dso)} days, significantly above industry benchmark of 30 days, tying up cash in unpaid invoices`
    },
    { 
      category: 'Inventory', 
      issue: 'Excess inventory holding', 
      impact: `${formatCurrency(financialData.inventory * 0.08)}/month`, 
      severity: 'high',
      details: `Inventory days of ${Math.round(calculatedMetrics.dio)} days indicates slow-moving inventory, increasing storage costs and tying up capital`
    },
    { 
      category: 'Cash', 
      issue: 'Zero cash reserves', 
      impact: `${formatCurrency(financialData.monthlyExpenses * 0.05)}/month`, 
      severity: 'critical',
      details: 'No cash reserves creates high liquidity risk and potential emergency borrowing costs'
    },
    { 
      category: 'Payables', 
      issue: 'Suboptimal payment terms', 
      impact: `${formatCurrency(financialData.accountsPayable * 0.05)}/month`, 
      severity: 'medium',
      details: `Current DPO of ${Math.round(calculatedMetrics.dpo)} days is below optimal level, missing opportunity to extend payment terms with suppliers`
    },
    { 
      category: 'Debt', 
      issue: 'High interest expense', 
      impact: `${formatCurrency(financialData.interestPaid * 0.15)}/month`, 
      severity: 'medium',
      details: `Interest expense of ${formatCurrency(financialData.interestPaid)} annually represents a significant cash outflow that could be reduced through refinancing`
    }
  ];

  // Mock cash flow data
  const mockCashFlowData: CashFlowData = {
    id: 'cf-001',
    companyId: 'company-001',
    period: '2025-01',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    operatingCashFlow: {
      receipts: [
        { id: '1', category: 'Sales', description: 'Product sales', amount: 150000, date: '2025-01-15', type: 'inflow', source: 'actual', confidence: 0.95, tags: ['revenue'] },
        { id: '2', category: 'Services', description: 'Consulting services', amount: 45000, date: '2025-01-20', type: 'inflow', source: 'actual', confidence: 0.9, tags: ['revenue'] }
      ],
      payments: [
        { id: '3', category: 'Payroll', description: 'Employee salaries', amount: 80000, date: '2025-01-31', type: 'outflow', source: 'actual', confidence: 1.0, tags: ['expense'] },
        { id: '4', category: 'Rent', description: 'Office rent', amount: 15000, date: '2025-01-01', type: 'outflow', source: 'actual', confidence: 1.0, tags: ['expense'] }
      ],
      netOperating: 100000
    },
    investingCashFlow: {
      receipts: [],
      payments: [
        { id: '5', category: 'Equipment', description: 'New computers', amount: 25000, date: '2025-01-10', type: 'outflow', source: 'actual', confidence: 1.0, tags: ['capex'] }
      ],
      netInvesting: -25000
    },
    financingCashFlow: {
      receipts: [],
      payments: [
        { id: '6', category: 'Loan Payment', description: 'Monthly loan payment', amount: 5000, date: '2025-01-15', type: 'outflow', source: 'actual', confidence: 1.0, tags: ['debt'] }
      ],
      netFinancing: -5000
    },
    openingBalance: 120000,
    closingBalance: 190000,
    netCashFlow: 70000,
    forecast: [
      {
        period: '2025-02',
        projectedInflow: 180000,
        projectedOutflow: 110000,
        projectedBalance: 260000,
        confidence: 0.85,
        scenarios: { optimistic: 280000, realistic: 260000, pessimistic: 240000 },
        assumptions: ['Seasonal uptick in sales', 'No major expenses planned']
      }
    ],
    lastUpdated: new Date().toISOString(),
    dataQuality: 'high',
    confidence: 0.92
  };

  // One Percent Fix data with exact values from the image
  const onePercentFixData = [
    {
      category: 'Price Increase',
      value: '1 %',
      cashFlowImpact: 51690,
      profitImpact: 66120,
      details: 'Small price increase across all products and services'
    },
    {
      category: 'Volume Increase',
      value: '1 %',
      cashFlowImpact: -4855,
      profitImpact: 19175,
      details: 'Increase sales volume through targeted marketing campaigns'
    },
    {
      category: 'COGS Reduction',
      value: '1 %',
      cashFlowImpact: 56545,
      profitImpact: 46945,
      details: 'Negotiate better terms with suppliers or find alternative sources'
    },
    {
      category: 'Operating Expenses Reduction',
      value: '1 %',
      cashFlowImpact: 12162,
      profitImpact: 12162,
      details: 'Reduce overhead expenses through operational efficiency'
    },
    {
      category: 'Accounts Receivable Days Reduction',
      value: '1 day',
      cashFlowImpact: 18115,
      profitImpact: 0,
      details: 'Improve collection processes to receive payments faster'
    },
    {
      category: 'Inventory Days Reduction',
      value: '1 day',
      cashFlowImpact: 12862,
      profitImpact: 0,
      details: 'Optimize inventory management to reduce holding costs'
    },
    {
      category: 'Accounts Payable Days Increase',
      value: '1 day',
      cashFlowImpact: 12862,
      profitImpact: 0,
      details: 'Extend payment terms with suppliers without affecting relationships'
    }
  ];

  // Corrective actions
  const correctiveActions = [
    { 
      priority: 'high', 
      action: 'Implement accounts receivable acceleration program', 
      impact: `${formatCurrency(financialData.accountsReceivable * 0.2)}/quarter`, 
      timeframe: '1-2 months',
      difficulty: 'medium',
      details: 'Reduce DSO from 80 to 45 days through automated reminders, early payment incentives, and stricter credit terms'
    },
    { 
      priority: 'high', 
      action: 'Optimize inventory levels with just-in-time system', 
      impact: `${formatCurrency(financialData.inventory * 0.25)}/quarter`, 
      timeframe: '2-3 months',
      difficulty: 'high',
      details: 'Reduce inventory days from 120 to 60 days through demand forecasting, vendor-managed inventory, and ABC analysis'
    },
    { 
      priority: 'critical', 
      action: 'Establish minimum cash reserve policy', 
      impact: 'Risk mitigation', 
      timeframe: 'Immediate',
      difficulty: 'medium',
      details: 'Implement policy to maintain cash reserves equal to at least 1 month of operating expenses'
    },
    { 
      priority: 'medium', 
      action: 'Renegotiate supplier payment terms', 
      impact: `${formatCurrency(financialData.accountsPayable * 0.3)}/quarter`, 
      timeframe: '1-3 months',
      difficulty: 'medium',
      details: 'Extend DPO from 45 to 60-90 days through supplier negotiations and payment schedule optimization'
    },
    { 
      priority: 'medium', 
      action: 'Refinance high-interest debt', 
      impact: `${formatCurrency(financialData.interestPaid * 0.2)}/year`, 
      timeframe: '2-4 months',
      difficulty: 'medium',
      details: 'Reduce interest expense by refinancing existing debt at lower rates, potentially saving 15-20% annually'
    }
  ];

  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      // Update the mock data with the selected FY ending date
      const updatedMockData = {
        ...mockCashFlowData,
        endDate: fyEndingDate,
        period: `${fyEndingDate.substring(0, 4)}` // Extract YYYY format for the period
      };
      
      const result = await agentService.analyzeCashFlow(updatedMockData);
      setAnalysis(result);
      setLastUpdate(new Date().toLocaleString());
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFYEndingDateChange = () => {
    runAnalysis();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'critical': return 'text-purple-600 bg-purple-100 border-purple-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'critical': return 'text-purple-600 bg-purple-100 border-purple-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact < 0) return 'text-red-600';
    return 'text-green-600';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'operating': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'working_capital': return 'bg-green-100 text-green-800 border-green-200';
      case 'liquidity': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'impact': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'financing': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <PageHeader 
            title="Cash Flow Diagnostician" 
            description="AI-powered cash flow analysis and optimization"
            icon={<Activity className="w-8 h-8 text-blue-600" />} 
          />
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
        <PageHeader 
          title="Cash Flow Diagnostician" 
          description="AI-powered cash flow analysis and optimization"
          icon={<Activity className="w-8 h-8 text-blue-600" />} 
        />

        {/* Agent Header with FY Ending Date Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="p-3 bg-blue-100 rounded-lg mr-3">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Cash Flow Diagnostician</h2>
                <p className="text-sm text-gray-600">Financial health assessment and optimization</p>
              </div>
            </div>
            
            {/* FY Ending Date Selector */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm text-gray-600 mr-2">Latest FY Ending Date:</span>
                <input 
                  type="date" 
                  value={fyEndingDate} 
                  onChange={(e) => setFyEndingDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <button
                onClick={handleFYEndingDateChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Analyze
              </button>
            </div>
          </div>
          {lastUpdate && (
            <div className="mt-4 text-xs text-gray-500">
              Last updated: {lastUpdate}
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'metrics' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2 inline" />
              Cash Flow Metrics
            </button>
            <button
              onClick={() => setActiveTab('leakage')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'leakage' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingDown className="w-4 h-4 mr-2 inline" />
              Leakage Points
            </button>
            <button
              onClick={() => setActiveTab('onepercent')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'onepercent' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Percent className="w-4 h-4 mr-2 inline" />
              Margin Movers
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'actions' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Zap className="w-4 h-4 mr-2 inline" />
              Corrective Actions
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Cash Flow Metrics Tab */}
          {activeTab === 'metrics' && (
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
                    {cashFlowMetrics.filter(metric => metric.category === 'operating').map((metric, index) => (
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
                    {cashFlowMetrics.filter(metric => metric.category === 'working_capital').map((metric, index) => (
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
                    {cashFlowMetrics.filter(metric => metric.category === 'liquidity').map((metric, index) => (
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
                    {cashFlowMetrics.filter(metric => metric.category === 'impact').map((metric, index) => (
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
                    {cashFlowMetrics.filter(metric => metric.category === 'financing').map((metric, index) => (
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

          {/* Leakage Points Tab */}
          {activeTab === 'leakage' && (
            <div>
              <div className="flex items-center mb-6">
                <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Cash Flow Leakage Points</h3>
              </div>
              
              <div className="space-y-4">
                {leakagePoints.map((point, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(point.severity)}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <div className="flex items-center mb-2 md:mb-0">
                        <div className={`p-2 rounded-full ${
                          point.severity === 'high' ? 'bg-red-200' : 
                          point.severity === 'medium' ? 'bg-yellow-200' : 
                          point.severity === 'critical' ? 'bg-purple-200' :
                          'bg-blue-200'
                        }`}>
                          {point.category === 'Inventory' && <BarChart3 className="w-4 h-4" />}
                          {point.category === 'Receivables' && <DollarSign className="w-4 h-4" />}
                          {point.category === 'Cash' && <DollarSign className="w-4 h-4" />}
                          {point.category === 'Payables' && <Activity className="w-4 h-4" />}
                          {point.category === 'Debt' && <TrendingDown className="w-4 h-4" />}
                        </div>
                        <span className="font-medium ml-2">{point.category}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          point.severity === 'high' ? 'bg-red-200 text-red-800' : 
                          point.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' : 
                          point.severity === 'critical' ? 'bg-purple-200 text-purple-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {point.severity.charAt(0).toUpperCase() + point.severity.slice(1)} Severity
                        </span>
                        <span className="ml-3 font-bold">{point.impact}</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{point.issue}</h4>
                    <p className="text-sm">{point.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Margin Movers Tab (formerly Your 1% Fix) */}
          {activeTab === 'onepercent' && (
            <div>
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start">
                  <div className="p-2 bg-green-100 rounded-full mr-3 mt-1">
                    <Percent className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700">
                      Small, incremental changes that are easy to implement but compound over time. Each 1% or 1-day improvement may seem minor on its own, but together, they create a powerful ripple effect—freeing up cash, lifting profits, and strengthening your business's financial foundation.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Table Header */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net Cash Flow
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Operating Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Your current position row */}
                    <tr className="bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Your Current Position
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-red-600">
                        -193,000
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                        701,300
                      </td>
                    </tr>
                    
                    {/* Empty row for spacing */}
                    <tr className="h-6">
                      <td colSpan={4}></td>
                    </tr>
                    
                    {/* Impact header row */}
                    <tr className="bg-gray-50">
                      <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                        Impact on<br />Cash Flow
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                        Impact on<br />Operating Profit
                      </td>
                    </tr>
                    
                    {/* Margin Movers rows */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Price Increase
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        1 %
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                        51,690
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                        66,120
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Volume Increase
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        1 %
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-red-600">
                        -4,855
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                        19,175
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        COGS Reduction
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        1 %
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                        56,545
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                        46,945
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Operating Expenses Reduction
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        1 %
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                        12,162
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                        12,162
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Accounts Receivable Days Reduction
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        1 day
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                        18,115
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                        
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Inventory Days Reduction
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        1 day
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                        12,862
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                        
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Accounts Payable Days Increase
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        1 day
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                        12,862
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                        
                      </td>
                    </tr>
                    
                    {/* Empty row for spacing */}
                    <tr className="h-6">
                      <td colSpan={4}></td>
                    </tr>
                    
                    {/* Margin Movers Impact row */}
                    <tr className="bg-green-50 font-bold">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Margin Movers Impact
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-700">
                        159,381
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-700">
                        144,402
                      </td>
                    </tr>
                    
                    {/* Empty row for spacing */}
                    <tr className="h-6">
                      <td colSpan={4}></td>
                    </tr>
                    
                    {/* Your adjusted position row */}
                    <tr className="bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Your Adjusted Position
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-red-600">
                        -33,619
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-green-600">
                        845,702
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Corrective Actions Tab */}
          {activeTab === 'actions' && (
            <div>
              <div className="flex items-center mb-6">
                <Zap className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Corrective Actions</h3>
              </div>
              
              <div className="space-y-4">
                {correctiveActions.map((action, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getPriorityColor(action.priority)}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <div className="flex items-center mb-2 md:mb-0">
                        <div className={`p-2 rounded-full ${
                          action.priority === 'high' ? 'bg-red-200' : 
                          action.priority === 'medium' ? 'bg-yellow-200' : 
                          action.priority === 'critical' ? 'bg-purple-200' :
                          'bg-green-200'
                        }`}>
                          {index + 1}
                        </div>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          action.priority === 'high' ? 'bg-red-200 text-red-800' : 
                          action.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' : 
                          action.priority === 'critical' ? 'bg-purple-200 text-purple-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {action.priority.charAt(0).toUpperCase() + action.priority.slice(1)} Priority
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm mr-3">Impact: <strong>{action.impact}</strong></span>
                        <span className="text-sm">Timeframe: <strong>{action.timeframe}</strong></span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{action.action}</h4>
                    <p className="text-sm mb-2">{action.details}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Difficulty: <span className={getDifficultyColor(action.difficulty)}>{action.difficulty.charAt(0).toUpperCase() + action.difficulty.slice(1)}</span></span>
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center">
                        Implement <ArrowRight className="w-3 h-3 ml-1" />
                      </button>
                    </div>
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