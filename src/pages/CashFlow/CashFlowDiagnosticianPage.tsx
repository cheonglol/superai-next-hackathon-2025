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
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { agentService } from '@/services/agentService';
import type { CashFlowData, CashFlowAnalysis } from '@/types/cashflow';

const CashFlowDiagnosticianPage: React.FC = () => {
  const [analysis, setAnalysis] = useState<CashFlowAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'metrics' | 'leakage' | 'actions' | 'tools'>('metrics');

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

  // Cash flow metrics
  const cashFlowMetrics = [
    { name: 'Operating Ratio', value: '0.85', benchmark: '0.80', status: 'good' },
    { name: 'Working Capital Adequacy', value: '1.75', benchmark: '1.50', status: 'good' },
    { name: 'Cash Conversion Cycle', value: '32 days', benchmark: '45 days', status: 'good' },
    { name: 'Burn Rate', value: '$2,500/day', benchmark: '$3,000/day', status: 'good' },
    { name: 'Cash Flow Coverage Ratio', value: '1.35', benchmark: '1.20', status: 'good' },
    { name: 'Days Sales Outstanding', value: '38 days', benchmark: '30 days', status: 'warning' },
    { name: 'Days Payable Outstanding', value: '28 days', benchmark: '30 days', status: 'good' },
    { name: 'Inventory Turnover', value: '8.5x', benchmark: '10x', status: 'warning' },
    { name: 'Cash to Current Liabilities', value: '0.65', benchmark: '0.50', status: 'good' },
    { name: 'Operating Cash Flow Ratio', value: '1.25', benchmark: '1.00', status: 'good' },
    { name: 'Free Cash Flow Yield', value: '8.5%', benchmark: '5.0%', status: 'good' },
    { name: 'Cash Flow to Debt Ratio', value: '0.45', benchmark: '0.30', status: 'good' },
    { name: 'Cash Return on Assets', value: '12.5%', benchmark: '10.0%', status: 'good' },
    { name: 'Cash to Cash Cycle', value: '42 days', benchmark: '45 days', status: 'good' },
    { name: 'Cash Flow Margin', value: '15.5%', benchmark: '12.0%', status: 'good' }
  ];

  // Leakage points
  const leakagePoints = [
    { 
      category: 'Inventory', 
      issue: 'Excess inventory holding', 
      impact: '$12,500/month', 
      severity: 'high',
      details: 'Current inventory levels exceed optimal by 25%, resulting in increased storage costs and tied-up capital'
    },
    { 
      category: 'Receivables', 
      issue: 'Late-paying customers', 
      impact: '$8,200/month', 
      severity: 'medium',
      details: 'Average collection period is 38 days vs. industry benchmark of 30 days'
    },
    { 
      category: 'Pricing', 
      issue: 'Suboptimal pricing strategy', 
      impact: '$5,000/month', 
      severity: 'medium',
      details: 'Current pricing structure doesn't account for seasonal demand fluctuations'
    },
    { 
      category: 'Operations', 
      issue: 'Inefficient procurement process', 
      impact: '$3,800/month', 
      severity: 'low',
      details: 'Manual procurement processes leading to missed early payment discounts'
    },
    { 
      category: 'Expenses', 
      issue: 'Unused software subscriptions', 
      impact: '$1,200/month', 
      severity: 'low',
      details: 'Multiple overlapping SaaS tools with low utilization rates'
    }
  ];

  // Corrective actions
  const correctiveActions = [
    { 
      priority: 'high', 
      action: 'Negotiate 45→30 day terms with Supplier X', 
      impact: '$4,500/month', 
      timeframe: '1-2 weeks',
      difficulty: 'medium',
      details: 'Supplier X has indicated willingness to offer better terms in exchange for volume commitment'
    },
    { 
      priority: 'high', 
      action: 'Implement just-in-time inventory for top 20% SKUs', 
      impact: '$8,200/month', 
      timeframe: '1 month',
      difficulty: 'high',
      details: 'Reduce inventory holding costs by 15% through JIT implementation for fast-moving items'
    },
    { 
      priority: 'medium', 
      action: 'Automate accounts receivable follow-ups', 
      impact: '$3,800/month', 
      timeframe: '2 weeks',
      difficulty: 'low',
      details: 'Set up automated email reminders at 7, 3, and 1 days before payment due dates'
    },
    { 
      priority: 'medium', 
      action: 'Implement early payment discount (2/10 net 30)', 
      impact: '$2,500/month', 
      timeframe: 'Immediate',
      difficulty: 'low',
      details: 'Offer 2% discount for payments received within 10 days to accelerate cash collection'
    },
    { 
      priority: 'low', 
      action: 'Consolidate SaaS subscriptions', 
      impact: '$1,200/month', 
      timeframe: '1 month',
      difficulty: 'low',
      details: 'Audit and eliminate redundant software subscriptions across departments'
    }
  ];

  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await agentService.analyzeCashFlow(mockCashFlowData);
      setAnalysis(result);
      setLastUpdate(new Date().toLocaleString());
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

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
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
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

        {/* Agent Header */}
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
            <div className="flex flex-wrap gap-2">
              <button
                onClick={runAnalysis}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Analysis
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filter Data
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center">
                <Search className="w-4 h-4 mr-2" />
                Advanced Search
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
              onClick={() => setActiveTab('actions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'actions' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Zap className="w-4 h-4 mr-2 inline" />
              Corrective Actions
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'tools' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Target className="w-4 h-4 mr-2 inline" />
              Analysis Tools
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
                <h3 className="text-lg font-semibold text-gray-900">15+ Cash Flow Metrics</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cashFlowMetrics.map((metric, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{metric.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                        {metric.status === 'good' ? 'Good' : metric.status === 'warning' ? 'Needs Attention' : 'Critical'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-bold text-gray-900">{metric.value}</div>
                        <div className="text-xs text-gray-600">Benchmark: {metric.benchmark}</div>
                      </div>
                      {metric.status === 'good' ? 
                        <CheckCircle className="w-5 h-5 text-green-600" /> : 
                        metric.status === 'warning' ? 
                        <AlertTriangle className="w-5 h-5 text-yellow-600" /> : 
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      }
                    </div>
                  </div>
                ))}
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
                          'bg-blue-200'
                        }`}>
                          {point.category === 'Inventory' && <BarChart3 className="w-4 h-4" />}
                          {point.category === 'Receivables' && <DollarSign className="w-4 h-4" />}
                          {point.category === 'Pricing' && <Target className="w-4 h-4" />}
                          {point.category === 'Operations' && <Activity className="w-4 h-4" />}
                          {point.category === 'Expenses' && <TrendingDown className="w-4 h-4" />}
                        </div>
                        <span className="font-medium ml-2">{point.category}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          point.severity === 'high' ? 'bg-red-200 text-red-800' : 
                          point.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' : 
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

          {/* Corrective Actions Tab */}
          {activeTab === 'actions' && (
            <div>
              <div className="flex items-center mb-6">
                <Zap className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Prioritized Corrective Actions</h3>
              </div>
              
              <div className="space-y-4">
                {correctiveActions.map((action, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getPriorityColor(action.priority)}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <div className="flex items-center mb-2 md:mb-0">
                        <div className={`p-2 rounded-full ${
                          action.priority === 'high' ? 'bg-red-200' : 
                          action.priority === 'medium' ? 'bg-yellow-200' : 
                          'bg-green-200'
                        }`}>
                          {index + 1}
                        </div>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          action.priority === 'high' ? 'bg-red-200 text-red-800' : 
                          action.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' : 
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

          {/* Analysis Tools Tab */}
          {activeTab === 'tools' && (
            <div>
              <div className="flex items-center mb-6">
                <Target className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Advanced Analysis Tools</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg mr-3">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-blue-900">ML Anomaly Detection</h4>
                  </div>
                  <p className="text-sm text-blue-800 mb-4">
                    Our machine learning algorithms analyze your cash flow patterns to identify anomalies and unusual transactions that may indicate problems or opportunities.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                    <h5 className="font-medium text-blue-900 mb-2">Recent Anomalies Detected</h5>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Unusual spike in operational expenses (Jan 15-20)</span>
                      </li>
                      <li className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Recurring payment amount increased by 35% (Vendor: CloudTech)</span>
                      </li>
                    </ul>
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Run Anomaly Detection
                  </button>
                </div>

                <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-100 rounded-lg mr-3">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-green-900">Industry Benchmarking</h4>
                  </div>
                  <p className="text-sm text-green-800 mb-4">
                    Compare your cash flow metrics against industry standards and similar businesses to identify areas for improvement and competitive advantages.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                    <h5 className="font-medium text-green-900 mb-2">Your Performance vs. Industry</h5>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Cash Conversion Cycle</span>
                          <span className="font-medium text-green-700">Better than 75% of peers</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Operating Cash Flow Ratio</span>
                          <span className="font-medium text-green-700">Better than 62% of peers</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    View Full Benchmark Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashFlowDiagnosticianPage;