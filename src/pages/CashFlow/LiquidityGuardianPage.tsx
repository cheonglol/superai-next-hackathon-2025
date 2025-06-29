import React from "react";
import { Shield } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import LiquidityGuardian from "@/components/LiquidityGuardian";

const LiquidityGuardianPage: React.FC = () => {
  // Mock financial data
  const mockFinancialData = {
    totalLiquidity: 48920,
    safetyBuffer: 15000,
    bankBalances: [
      { name: "DBS", balance: 28400, change: 1.5, trend: 'up' as const },
      { name: "OCBC", balance: 15700, change: -0.8, trend: 'down' as const },
      { name: "UOB", balance: 4820, change: 0, trend: 'stable' as const }
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

        {/* Liquidity Guardian Component */}
        <LiquidityGuardian mockFinancialData={mockFinancialData} />
      </div>
    </div>
  );
};

export default LiquidityGuardianPage;