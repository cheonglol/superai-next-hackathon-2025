import type { FinancialData, FinancialsFilters } from "@/types/financials";

export class FinancialsMockApi {
  async getFinancialData(filters: FinancialsFilters): Promise<FinancialData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      summary: {
        currentMonth: {
          totalRevenue: 125000,
          totalExpenses: 89000,
          netProfit: 36000,
          profitMargin: 28.8,
          revenueGrowth: 12.5,
          expenseGrowth: 8.3,
        },
        previousMonth: {
          totalRevenue: 111000,
          totalExpenses: 82000,
          netProfit: 29000,
          profitMargin: 26.1,
          revenueGrowth: 8.2,
          expenseGrowth: 5.7,
        },
        yearToDate: {
          totalRevenue: 1450000,
          totalExpenses: 1020000,
          netProfit: 430000,
          profitMargin: 29.7,
          revenueGrowth: 15.3,
          expenseGrowth: 9.8,
        },
      },
      recentTransactions: [
        {
          id: "1",
          type: "income",
          category: "Sales Revenue",
          amount: 15000,
          description: "Monthly subscription revenue",
          date: "2025-01-15",
        },
        {
          id: "2",
          type: "expense",
          category: "Marketing",
          amount: 3500,
          description: "Social media advertising",
          date: "2025-01-14",
        },
        {
          id: "3",
          type: "income",
          category: "Service Revenue",
          amount: 8500,
          description: "Consulting services",
          date: "2025-01-13",
        },
        {
          id: "4",
          type: "expense",
          category: "Operations",
          amount: 2200,
          description: "Office supplies and utilities",
          date: "2025-01-12",
        },
      ],
      cashFlow: [
        { month: "Jan", income: 125000, expenses: 89000, netFlow: 36000 },
        { month: "Dec", income: 111000, expenses: 82000, netFlow: 29000 },
        { month: "Nov", income: 118000, expenses: 85000, netFlow: 33000 },
        { month: "Oct", income: 105000, expenses: 78000, netFlow: 27000 },
        { month: "Sep", income: 112000, expenses: 81000, netFlow: 31000 },
        { month: "Aug", income: 108000, expenses: 79000, netFlow: 29000 },
      ],
      budgetVsActual: [
        {
          category: "Marketing",
          budgeted: 15000,
          actual: 12500,
          variance: -2500,
          variancePercentage: -16.7,
        },
        {
          category: "Operations",
          budgeted: 25000,
          actual: 27800,
          variance: 2800,
          variancePercentage: 11.2,
        },
        {
          category: "Salaries",
          budgeted: 45000,
          actual: 45000,
          variance: 0,
          variancePercentage: 0,
        },
        {
          category: "Technology",
          budgeted: 8000,
          actual: 6200,
          variance: -1800,
          variancePercentage: -22.5,
        },
      ],
    };
  }
}

export const financialsMockApi = new FinancialsMockApi();