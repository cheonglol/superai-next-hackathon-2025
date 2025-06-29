import React, { useState, useEffect } from 'react';
import { Brain, Users, TrendingUp, Shield, Zap, Activity, Calculator } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { AgentDashboard } from '@/components/agents/AgentDashboard';
import { CashFlowAgent } from '@/components/agents/CashFlowAgent';
import ScenarioStressTester from '@/components/ScenarioStressTester';

const AgenticDashboardPage: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
  };

  const handleBackToDashboard = () => {
    setSelectedAgent(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderAgentView = () => {
    switch (selectedAgent) {
      case 'cashflow-diagnostician':
        return <CashFlowAgent />;
      case 'scenario-stress-tester':
        return (
          <ScenarioStressTester 
            mockFinancialData={{
              currentCashFlow: 15000,
              monthlyRevenue: 85000,
              monthlyExpenses: 70000,
              currentRent: 8000,
              currentStaff: 12,
              averageSalary: 3500,
            }}
            formatCurrency={formatCurrency}
          />
        );
      case 'liquidity-sentinel':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Liquidity Sentinel</h3>
              <p className="text-gray-600">Real-time liquidity monitoring coming soon...</p>
            </div>
          </div>
        );
      case 'receivables-autopilot':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Receivables Autopilot</h3>
              <p className="text-gray-600">Automated receivables management coming soon...</p>
            </div>
          </div>
        );
      default:
        return <AgentDashboard onAgentSelect={handleAgentSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Agentic AI Financial Platform"
          description="Empowering SMEs with AI-driven financial intelligence and automation"
          icon={<Brain className="w-8 h-8 text-blue-600" />}
          actions={
            selectedAgent ? (
              <button
                onClick={handleBackToDashboard}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Back to Dashboard
              </button>
            ) : undefined
          }
        />

        {/* Mission Statement */}
        {!selectedAgent && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg text-white p-8 mb-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-4">Democratizing Financial Intelligence for SMEs</h2>
              <p className="text-lg opacity-90 mb-6">
                Our AI-powered platform empowers small and medium enterprises to manage cash flow, optimize operations, 
                and access credit opportunities, enabling underserved businesses to participate fully in the digital economy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-2">
                    <TrendingUp className="w-8 h-8 mx-auto" />
                  </div>
                  <h3 className="font-semibold">Cash Flow Management</h3>
                  <p className="text-sm opacity-80">Real-time analysis & optimization</p>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-2">
                    <Shield className="w-8 h-8 mx-auto" />
                  </div>
                  <h3 className="font-semibold">Risk Assessment</h3>
                  <p className="text-sm opacity-80">Proactive risk identification</p>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-2">
                    <Zap className="w-8 h-8 mx-auto" />
                  </div>
                  <h3 className="font-semibold">Process Automation</h3>
                  <p className="text-sm opacity-80">Streamlined operations</p>
                </div>
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-2">
                    <Users className="w-8 h-8 mx-auto" />
                  </div>
                  <h3 className="font-semibold">Financial Inclusion</h3>
                  <p className="text-sm opacity-80">Democratized access to tools</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agent Content */}
        {renderAgentView()}
      </div>
    </div>
  );
};

export default AgenticDashboardPage;