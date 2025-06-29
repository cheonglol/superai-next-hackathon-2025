import React, { useState } from "react";
import { TrendingUp, BarChart3, DollarSign, Target, AlertTriangle, Clock, Users, Zap, Activity, CreditCard, CheckCircle, ArrowRight, ChevronDown, Calculator, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import ScenarioStressTester from "@/components/ScenarioStressTester";

const ScenarioStressTesterPage: React.FC = () => {
  // Mock financial data for analysis
  const mockFinancialData = {
    currentMonthlyCashFlow: 15000,
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
          icon={<TrendingUp className="w-8 h-8 text-oxford_blue-600" />}
        />

        {/* Capabilities Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-lg mr-3">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">What-If Scenario Modeling</h2>
              <p className="text-sm text-gray-600">Test financial impacts before making decisions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">What-If Scenarios</h3>
              </div>
              <p className="text-sm text-blue-700">Model rent increases, new hires, equipment purchases, and other financial changes</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center mb-3">
                <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-800">6-Month Projections</h3>
              </div>
              <p className="text-sm text-green-700">See 6-month cash flow projections under new financial obligations</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center mb-3">
                <Target className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="font-semibold text-purple-800">Affordability Thresholds</h3>
              </div>
              <p className="text-sm text-purple-700">Calculate maximum sustainable expenses like rent, salaries, and equipment</p>
            </div>
          </div>
        </div>

        {/* Scenario Stress Tester Component */}
        <ScenarioStressTester 
          mockFinancialData={mockFinancialData}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
};

export default ScenarioStressTesterPage;