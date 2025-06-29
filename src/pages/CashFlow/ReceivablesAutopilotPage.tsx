import React from "react";
import { Zap, Mail, DollarSign, Clock } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import ReceivablesAutopilot from "@/components/ReceivablesAutopilot";

const ReceivablesAutopilotPage: React.FC = () => {
  // Mock financial data
  const mockFinancialData = {
    totalOutstanding: 42560,
    overdueAmount: 18200,
    avgDaysLate: 12,
    collectionsRisk: 8,
    invoices: [
      {
        id: "INV-2025-0156",
        customer: "Linear Dots Production Pte Ltd",
        amount: 2500,
        dueDate: "5 days ago",
        status: 'overdue' as const,
        daysLate: 5,
        payProbability: 92,
        remindersSent: 1,
        responseReceived: false
      },
      {
        id: "INV-2025-0187",
        customer: "A&P Floral Creation",
        amount: 1200,
        dueDate: "Today",
        status: 'due-today' as const,
        payProbability: 88,
        riskOfDelay: 35,
        remindersSent: 0,
        responseReceived: false
      },
      {
        id: "INV-2025-0098",
        customer: "Curators Collective Pte Ltd",
        amount: 4800,
        dueDate: "47 days ago",
        status: 'collections' as const,
        daysLate: 47,
        payProbability: 68,
        remindersSent: 3,
        responseReceived: false
      },
      {
        id: "INV-2025-0203",
        customer: "HoneySpree Pte Ltd",
        amount: 850,
        dueDate: "Tomorrow",
        status: 'on-time' as const,
        payProbability: 95,
        remindersSent: 0,
        responseReceived: false
      },
      {
        id: "INV-2025-0142",
        customer: "Quant Consulting Group Pte Ltd",
        amount: 3200,
        dueDate: "12 days ago",
        status: 'overdue' as const,
        daysLate: 12,
        payProbability: 78,
        remindersSent: 2,
        responseReceived: false
      },
      {
        id: "INV-2025-0175",
        customer: "Whimsy Safari Pte Ltd",
        amount: 1750,
        dueDate: "3 days ago",
        status: 'overdue' as const,
        daysLate: 3,
        payProbability: 89,
        remindersSent: 1,
        responseReceived: true
      }
    ],
    customerHealthScores: [
      {
        customer: "Linear Dots Production Pte Ltd",
        score: 76,
        insight: "Prompt payer, 5% delay risk next invoice"
      },
      {
        customer: "A&P Floral Creation",
        score: 65,
        insight: "Increasing delay probability"
      }
    ],
    trendAlerts: [
      {
        trend: "Overdue invoices increased",
        value: "+22% vs. last month"
      },
      {
        trend: "A&P Floral Creation delay probability",
        value: "Rising trend detected"
      }
    ],
    optimizationTips: [
      {
        tip: "Offer 2% discount for A&P Floral Creation early payments"
      },
      {
        tip: "Send reminders 3 days before due date to improve on-time payments"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Receivables Autopilot"
          description="Automated receivables management and collections optimization"
          icon={<Zap className="w-8 h-8 text-oxford_blue-600" />}
        />

        {/* Capabilities Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-lg mr-3">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Receivables Management System</h2>
              <p className="text-sm text-gray-600">Automated tracking and follow-up for outstanding invoices</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <Mail className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Automated Reminders</h3>
              </div>
              <p className="text-sm text-blue-700">Intelligent follow-up system for overdue invoices</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center mb-3">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-800">Cash Flow Optimization</h3>
              </div>
              <p className="text-sm text-green-700">Accelerate collections to improve working capital</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center mb-3">
                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="font-semibold text-purple-800">Escalation Workflow</h3>
              </div>
              <p className="text-sm text-purple-700">Timely human intervention for critical receivables</p>
            </div>
          </div>
        </div>

        {/* Receivables Autopilot Component */}
        <ReceivablesAutopilot mockFinancialData={mockFinancialData} />
      </div>
    </div>
  );
};

export default ReceivablesAutopilotPage;