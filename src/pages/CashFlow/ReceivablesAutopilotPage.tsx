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
        id: "INV-001",
        customer: "Ray's Hardware",
        amount: 2500,
        dueDate: "5 days ago",
        status: 'overdue' as const,
        daysLate: 5,
        payProbability: 92
      },
      {
        id: "INV-002",
        customer: "Bloom Café",
        amount: 1200,
        dueDate: "Today",
        status: 'due-today' as const,
        payProbability: 88,
        riskOfDelay: 35
      },
      {
        id: "INV-003",
        customer: "TechGadgets",
        amount: 4800,
        dueDate: "47 days ago",
        status: 'collections' as const,
        daysLate: 47,
        payProbability: 68
      },
      {
        id: "INV-004",
        customer: "Green Grocers",
        amount: 850,
        dueDate: "Tomorrow",
        status: 'on-time' as const,
        payProbability: 95
      },
      {
        id: "INV-005",
        customer: "City Fitness",
        amount: 3200,
        dueDate: "12 days ago",
        status: 'overdue' as const,
        daysLate: 12,
        payProbability: 78
      },
      {
        id: "INV-006",
        customer: "Lakeside Spa",
        amount: 1750,
        dueDate: "3 days ago",
        status: 'overdue' as const,
        daysLate: 3,
        payProbability: 89
      }
    ],
    customerHealthScores: [
      {
        customer: "Ray's Hardware",
        score: 76,
        insight: "Prompt payer, 5% delay risk next invoice"
      },
      {
        customer: "Bloom Café",
        score: 65,
        insight: "Increasing delay probability"
      },
      {
        customer: "TechGadgets",
        score: 42,
        insight: "Consistent late payments, needs attention"
      }
    ],
    trendAlerts: [
      {
        trend: "Overdue invoices increased",
        value: "+22% vs. last month"
      },
      {
        trend: "Bloom Café delay probability",
        value: "Rising trend detected"
      }
    ],
    optimizationTips: [
      {
        tip: "Offer 2% discount for Bloom Café early payments"
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

        {/* Receivables Autopilot Component */}
        <ReceivablesAutopilot mockFinancialData={mockFinancialData} />
      </div>
    </div>
  );
};

export default ReceivablesAutopilotPage;