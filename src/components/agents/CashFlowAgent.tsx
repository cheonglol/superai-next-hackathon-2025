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
  Zap
} from 'lucide-react';
import { agentService } from '@/services/agentService';
import type { CashFlowData, CashFlowAnalysis } from '@/types/cashflow';

export const CashFlowAgent: React.FC = () => {
  const [analysis, setAnalysis] = useState<CashFlowAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cash Flow Diagnostician analyzing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-3">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Cash Flow Diagnostician</h2>
              <p className="text-sm text-gray-600">AI-powered cash flow analysis and optimization</p>
            </div>
          </div>
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Zap className="w-4 h-4 mr-2 inline" />
            Analyze
          </button>
        </div>
        {lastUpdate && (
          <div className="mt-4 text-xs text-gray-500">
            Last updated: {lastUpdate}
          </div>
        )}
      </div>

      {analysis && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Health Score</p>
                  <p className={`text-2xl font-bold px-3 py-1 rounded-full ${getHealthScoreColor(analysis.healthScore)}`}>
                    {analysis.healthScore.toFixed(0)}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Liquidity Ratio</p>
                  <p className="text-2xl font-bold text-gray-900">{analysis.liquidityRatio.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Daily Burn Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analysis.burnRate)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Runway Days</p>
                  <p className="text-2xl font-bold text-gray-900">{analysis.runwayDays}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Trends Analysis */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Trends</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                {getTrendIcon(analysis.trends.direction)}
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Direction</p>
                  <p className="text-sm text-gray-600 capitalize">{analysis.trends.direction}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Target className="w-4 h-4 text-blue-600" />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Velocity</p>
                  <p className="text-sm text-gray-600">{analysis.trends.velocity.toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center">
                <Activity className="w-4 h-4 text-purple-600" />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Volatility</p>
                  <p className="text-sm text-gray-600">{analysis.trends.volatility.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risks and Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Identified Risks</h3>
              </div>
              <div className="space-y-3">
                {analysis.risks.map((risk) => (
                  <div key={risk.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-red-800">{risk.description}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        risk.severity === 'critical' ? 'bg-red-200 text-red-800' :
                        risk.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                        risk.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {risk.severity}
                      </span>
                    </div>
                    <p className="text-sm text-red-700 mb-2">Impact: {formatCurrency(risk.impact)}</p>
                    <div className="text-xs text-red-600">
                      <strong>Mitigation:</strong> {risk.mitigation.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Opportunities</h3>
              </div>
              <div className="space-y-3">
                {analysis.opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-800">{opportunity.description}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        opportunity.effort === 'low' ? 'bg-green-200 text-green-800' :
                        opportunity.effort === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {opportunity.effort} effort
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      Potential: {formatCurrency(opportunity.potential)} | Timeframe: {opportunity.timeframe}
                    </p>
                    <div className="text-xs text-green-600">
                      <strong>Requirements:</strong> {opportunity.requirements.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seasonality Patterns */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonality Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {analysis.seasonality.map((pattern, index) => (
                <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{pattern.period}</div>
                  <div className={`text-sm font-medium ${
                    pattern.pattern === 'high' ? 'text-green-600' :
                    pattern.pattern === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {pattern.pattern.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-600">
                    Variance: {(pattern.variance * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">
                    Confidence: {(pattern.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};