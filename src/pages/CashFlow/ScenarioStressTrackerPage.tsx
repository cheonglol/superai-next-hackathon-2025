import { PageHeader } from "@/components/common/PageHeader";
import ScenarioStressTester from "@/components/ScenarioStressTester";
import {
  Calculator
} from "lucide-react";
import React from "react";

const ScenarioStressTesterPage: React.FC = () => {
  // Mock financial data for analysis
  const mockFinancialData = {
    currentCashFlow: 15000,
    monthlyRevenue: 85000,
    monthlyExpenses: 70000,
    cashReserves: 45000,
    fixedCosts: 45000,
    variableCosts: 25000,
    currentRent: 8000,
    currentStaff: 12,
    averageSalary: 3500,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Scenario Stress Tester"
          description="Model what-if scenarios and project cash flow under different conditions"
          icon={<Calculator className="w-8 h-8 text-oxford_blue-600" />}
        />

        {/* Scenario Stress Tester Component */}
        <ScenarioStressTester mockFinancialData={mockFinancialData} formatCurrency={formatCurrency} />
      </div>
    </div>
  );
};

export default ScenarioStressTesterPage;
