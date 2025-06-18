export interface Branch {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
}

export interface PeriodData {
  periodId: string;
  periodLabel: string;
  date: string;
  
  // Profit & Loss Statement
  revenue: number;
  grossMargin: number;
  netProfitAfterTax: number;
  depreciationAmortisation: number;
  interestPaid: number;
  tax: number;
  dividends: number;
  
  // Balance Sheet - Assets
  totalAssets: number;
  cash: number;
  accountsReceivable: number;
  inventory: number;
  totalCurrentAssets: number;
  fixedAssets: number;
  
  // Balance Sheet - Liabilities
  currentLiabilities: number;
  nonCurrentLiabilities: number;
  accountsPayable: number;
  
  // Debt Funding
  bankLoansCurrent: number;
  bankLoansNonCurrent: number;
}

export interface BranchFinancialData {
  branchId: string;
  periods: PeriodData[];
}

export interface ConsolidatedData {
  periods: PeriodData[];
}

export interface FinancialInputData {
  branches: Branch[];
  branchData: BranchFinancialData[];
  consolidatedData: ConsolidatedData;
  selectedPeriodType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  numberOfPeriods: number; // 2-6
}

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
  inputData?: FinancialInputData;
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