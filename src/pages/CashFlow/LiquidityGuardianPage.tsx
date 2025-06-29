import React from "react";
import { Activity, Shield, TrendingUp, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import LiquidityGuardian from "@/components/LiquidityGuardian";

const LiquidityGuardianPage: React.FC = () => {
  // Mock financial data
  const mockFinancialData = {
    totalLiquidity: 48920,
    safetyBuffer: 15000,
    bankBalances: [
      { name: "Bank of A", balance: 28400, change: 1.5, trend: 'up' as const },
      { name: "NeoBank B", balance: 15700, change: -0.8, trend: 'down' as const },
      { name: "Credit Union", balance: 4820, change: 0, trend: 'stable' as const }
    ],
    todayNetChange: 1200,
    alerts: [
      { 
        date: "July 3", 
        projectedBalance: 12400, 
        bufferDifference: -2600, 
        reason: "Vendor payment", 
        likelihood: 89 
      },
      { 
        date: "July 5", 
        projectedBalance: 14100, 
        bufferDifference: -900, 
        reason: "Payroll processing day", 
        likelihood: 76 
      }
    ],
    predictionConfidence: 97.3,
    predictionVariance: 2.1,
    lastUpdated: "Today 08:45",
    dataSources: ["Xero", "Bank feeds"]
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Liquidity Guardian"
          description="Real-time liquidity monitoring and cash flow alerts"
          icon={<Shield className="w-8 h-8 text-oxford_blue-600" />}
        />

        {/* Capabilities Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-lg mr-3">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Liquidity Monitoring System</h2>
              <p className="text-sm text-gray-600">Proactive cash flow monitoring and early warning system</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <Activity className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Real-time Monitoring</h3>
              </div>
              <p className="text-sm text-blue-700">Continuous tracking of all bank accounts and cash positions</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center mb-3">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-800">Predictive Alerts</h3>
              </div>
              <p className="text-sm text-green-700">AI-powered forecasting to identify potential cash shortfalls</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center mb-3">
                <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="font-semibold text-purple-800">Adaptive Thresholds</h3>
              </div>
              <p className="text-sm text-purple-700">Smart safety buffers that adjust to your business patterns</p>
            </div>
          </div>
        </div>

        {/* Liquidity Guardian Component */}
        <LiquidityGuardian mockFinancialData={mockFinancialData} />
      </div>
    </div>
  );
};

export default LiquidityGuardianPage;