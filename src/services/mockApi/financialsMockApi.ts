import type { FinancialData, FinancialsFilters, FinancialInputData, Branch, PeriodData } from "@/types/financials";

export class FinancialsMockApi {
  async getFinancialData(filters: FinancialsFilters): Promise<FinancialData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const mockBranches: Branch[] = [
      { id: "1", name: "Main Branch", location: "Downtown", isActive: true },
      { id: "2", name: "Mall Branch", location: "Shopping Center", isActive: true },
      { id: "3", name: "Airport Branch", location: "Terminal 1", isActive: false },
    ];

    const generatePeriodData = (periodIndex: number, branchMultiplier: number = 1): PeriodData => ({
      periodId: `period-${periodIndex}`,
      periodLabel: `Period ${periodIndex + 1}`,
      date: new Date(2025, 0, (periodIndex + 1) * 7).toISOString().split('T')[0],
      
      // P&L Statement
      revenue: Math.round(50000 * branchMultiplier * (1 + Math.random() * 0.2)),
      grossMargin: Math.round(30000 * branchMultiplier * (1 + Math.random() * 0.15)),
      netProfitAfterTax: Math.round(12000 * branchMultiplier * (1 + Math.random() * 0.25)),
      depreciationAmortisation: Math.round(2000 * branchMultiplier),
      interestPaid: Math.round(1500 * branchMultiplier),
      tax: Math.round(3000 * branchMultiplier),
      dividends: Math.round(2000 * branchMultiplier),
      
      // Assets
      totalAssets: Math.round(200000 * branchMultiplier * (1 + Math.random() * 0.1)),
      cash: Math.round(25000 * branchMultiplier * (1 + Math.random() * 0.3)),
      accountsReceivable: Math.round(15000 * branchMultiplier * (1 + Math.random() * 0.2)),
      inventory: Math.round(20000 * branchMultiplier * (1 + Math.random() * 0.15)),
      totalCurrentAssets: Math.round(60000 * branchMultiplier * (1 + Math.random() * 0.2)),
      fixedAssets: Math.round(140000 * branchMultiplier),
      
      // Liabilities
      currentLiabilities: Math.round(30000 * branchMultiplier * (1 + Math.random() * 0.15)),
      nonCurrentLiabilities: Math.round(80000 * branchMultiplier),
      accountsPayable: Math.round(12000 * branchMultiplier * (1 + Math.random() * 0.2)),
      
      // Debt Funding
      bankLoansCurrent: Math.round(15000 * branchMultiplier),
      bankLoansNonCurrent: Math.round(65000 * branchMultiplier),
    });

    const inputData: FinancialInputData = {
      branches: mockBranches,
      branchData: mockBranches.map(branch => ({
        branchId: branch.id,
        periods: Array.from({ length: 4 }, (_, i) => 
          generatePeriodData(i, branch.id === "1" ? 1 : branch.id === "2" ? 0.7 : 0.5)
        ),
      })),
      consolidatedData: {
        periods: Array.from({ length: 4 }, (_, i) => generatePeriodData(i, 2.2)),
      },
      selectedPeriodType: 'monthly',
      numberOfPeriods: 4,
    };

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
      inputData,
    };
  }

  async saveBranchData(branchId: string, periodData: PeriodData[]): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real implementation, this would save to backend
  }

  async saveConsolidatedData(consolidatedData: PeriodData[]): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real implementation, this would save to backend
  }

  async addBranch(branch: Omit<Branch, 'id'>): Promise<Branch> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      ...branch,
      id: Date.now().toString(),
    };
  }

  async updateBranch(branchId: string, updates: Partial<Branch>): Promise<Branch> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      id: branchId,
      name: updates.name || "Updated Branch",
      location: updates.location || "Updated Location",
      isActive: updates.isActive ?? true,
    };
  }
}

export const financialsMockApi = new FinancialsMockApi();