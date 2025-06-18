export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  revenueGrowth: number;
  expenseGrowth: number;
}

export interface FinancialSummary {
  currentMonth: FinancialMetrics;
  previousMonth: FinancialMetrics;
  yearToDate: FinancialMetrics;
}

export interface FinancialData {
  summary: FinancialSummary;
  recentTransactions: FinancialTransaction[];
  cashFlow: CashFlowData[];
  budgetVsActual: BudgetComparison[];
}

export interface FinancialTransaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface CashFlowData {
  month: string;
  income: number;
  expenses: number;
  netFlow: number;
}

export interface BudgetComparison {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercentage: number;
}

export interface FinancialsFilters {
  period: string;
  category?: string;
}