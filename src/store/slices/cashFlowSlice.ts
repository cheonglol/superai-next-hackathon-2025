/* eslint-disable */
// @ts-nocheck
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Types for the CSV data structure
export interface FinancialPeriod {
  period: string;
  periodLength: number;
  revenue: number;
  grossProfit: number;
  operatingProfit: number;
  netProfit: number;
  depreciation: number;
  interestPaid: number;
  distributions: number;
  totalAssets: number;
  cash: number;
  accountsReceivable: number;
  inventory: number;
  totalCurrentAssets: number;
  fixedAssets: number;
  totalLiabilities: number;
  accountsPayable: number;
  totalCurrentLiabilities: number;
  bankLoansCurrent: number;
  bankLoansNonCurrent: number;
}

export interface CashFlowMetrics {
  // Operating Cash Flow Metrics
  operatingCashFlow: number;
  operatingCashFlowMargin: number;
  cashConversionCycle: number;
  cashFlowPerDay: number;

  // Working Capital Efficiency
  dso: number; // Days Sales Outstanding
  dio: number; // Days Inventory Outstanding
  dpo: number; // Days Payable Outstanding
  workingCapitalRatio: number;

  // Liquidity & Buffer Metrics
  cashReserveRatio: number;
  burnRate: number;
  runway: number;

  // Revenue & Cost Impact Metrics
  grossProfitToCashConversion: number;
  profitCashFlowGap: number;
  costOfSalesToCashOutflow: number;

  // Financing & Debt-Related
  debtServiceCoverageRatio: number;
}

export interface CashFlowState {
  periods: FinancialPeriod[];
  currentPeriod: number; // Index of the current period
  metrics: CashFlowMetrics | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: CashFlowState = {
  periods: [],
  currentPeriod: 0,
  metrics: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

// Helper function to calculate COGS (Cost of Goods Sold)
const calculateCOGS = (revenue: number, grossProfit: number): number => {
  return revenue - grossProfit;
};

// Helper function to calculate metrics based on period data
const calculateMetrics = (currentPeriod: FinancialPeriod, previousPeriod?: FinancialPeriod): CashFlowMetrics => {
  const cogs = calculateCOGS(currentPeriod.revenue, currentPeriod.grossProfit);

  // Calculate changes from previous period for cash flow calculation
  const arIncrease = previousPeriod ? currentPeriod.accountsReceivable - previousPeriod.accountsReceivable : 0;
  const inventoryIncrease = previousPeriod ? currentPeriod.inventory - previousPeriod.inventory : 0;
  const apIncrease = previousPeriod ? currentPeriod.accountsPayable - previousPeriod.accountsPayable : 0;

  // Operating Cash Flow = Net profit + Depreciation - Increase in AR - Increase in Inventory + Increase in AP
  const operatingCashFlow = currentPeriod.netProfit + currentPeriod.depreciation - arIncrease - inventoryIncrease + apIncrease;

  // Operating Cash Flow Margin (%) = Operating Cash Flow ÷ Revenue
  const operatingCashFlowMargin = (operatingCashFlow / currentPeriod.revenue) * 100;

  // Days Sales Outstanding (DSO) = (Accounts Receivable ÷ Revenue) × 365
  const dso = (currentPeriod.accountsReceivable / currentPeriod.revenue) * 365;

  // Days Inventory Outstanding (DIO) = (Inventory ÷ COGS) × 365
  const dio = (currentPeriod.inventory / cogs) * 365;

  // Days Payable Outstanding (DPO) = (Accounts Payable ÷ COGS) × 365
  const dpo = (currentPeriod.accountsPayable / cogs) * 365;

  // Cash Conversion Cycle (CCC) = DSO + DIO – DPO
  const cashConversionCycle = dso + dio - dpo;

  // Cash Flow per Day = Operating Cash Flow ÷ 365
  const cashFlowPerDay = operatingCashFlow / 365;

  // Working Capital Ratio = Current Assets ÷ Current Liabilities
  const workingCapitalRatio = currentPeriod.totalCurrentAssets / currentPeriod.totalCurrentLiabilities;

  // Cash Reserve Ratio = Cash ÷ (Revenue - Operating Profit)
  const cashReserveRatio = currentPeriod.cash / (currentPeriod.revenue - currentPeriod.operatingProfit);

  // Burn Rate = (Revenue - Operating Profit) ÷ 12
  const burnRate = (currentPeriod.revenue - currentPeriod.operatingProfit) / 12;

  // Runway = Cash ÷ [(Revenue - Operating Profit) ÷ 12]
  const runway = currentPeriod.cash / ((currentPeriod.revenue - currentPeriod.operatingProfit) / 12);

  // Gross Profit to Cash Conversion = Operating Cash Flow ÷ Gross Profit
  const grossProfitToCashConversion = operatingCashFlow / currentPeriod.grossProfit;

  // Profit vs Cash Flow Gap = Net Profit – Operating Cash Flow
  const profitCashFlowGap = currentPeriod.netProfit - operatingCashFlow;

  // Cost of Sales to Cash Outflow = (Revenue – Gross Profit) ÷ [(Revenue – Gross Profit) + Increase in Inventory – Increase in Accounts Payable]
  const costOfSalesToCashOutflow = cogs / (cogs + inventoryIncrease - apIncrease);

  // Debt Service Coverage Ratio (DSCR) = (Operating Profit + Depreciation & Amortisation) ÷ Interest Paid
  const debtServiceCoverageRatio = (currentPeriod.operatingProfit + currentPeriod.depreciation) / currentPeriod.interestPaid;

  return {
    operatingCashFlow,
    operatingCashFlowMargin,
    cashConversionCycle,
    cashFlowPerDay,
    dso,
    dio,
    dpo,
    workingCapitalRatio,
    cashReserveRatio,
    burnRate,
    runway,
    grossProfitToCashConversion,
    profitCashFlowGap,
    costOfSalesToCashOutflow,
    debtServiceCoverageRatio,
  };
};

// Async thunk to load financial data from CSV
export const loadFinancialData = createAsyncThunk("cashFlow/loadFinancialData", async (_, { rejectWithValue }) => {
  try {
    // In a real implementation, this would load data from the CSV file
    // For now, we'll use the data structure from the CSV provided
    const periods: FinancialPeriod[] = [
      {
        period: "31-Dec-21",
        periodLength: 12,
        revenue: 3400000,
        grossProfit: 865000,
        operatingProfit: 360000,
        netProfit: 195400,
        depreciation: 74000,
        interestPaid: 50000,
        distributions: 45400,
        totalAssets: 2700000,
        cash: 160000,
        accountsReceivable: 570000,
        inventory: 600000,
        totalCurrentAssets: 1500000,
        fixedAssets: 1000000,
        totalLiabilities: 2000000,
        accountsPayable: 300000,
        totalCurrentLiabilities: 800000,
        bankLoansCurrent: 400000,
        bankLoansNonCurrent: 1000000,
      },
      {
        period: "31-Dec-22",
        periodLength: 12,
        revenue: 5000000,
        grossProfit: 1300000,
        operatingProfit: 467000,
        netProfit: 280000,
        depreciation: 100000,
        interestPaid: 100000,
        distributions: 180000,
        totalAssets: 3600000,
        cash: 75000,
        accountsReceivable: 900000,
        inventory: 920000,
        totalCurrentAssets: 2100000,
        fixedAssets: 1400000,
        totalLiabilities: 2800000,
        accountsPayable: 450000,
        totalCurrentLiabilities: 1600000,
        bankLoansCurrent: 1000000,
        bankLoansNonCurrent: 1200000,
      },
      {
        period: "31-Dec-23",
        periodLength: 12,
        revenue: 5800000,
        grossProfit: 1650000,
        operatingProfit: 625000,
        netProfit: 350000,
        depreciation: 100000,
        interestPaid: 150000,
        distributions: 100000,
        totalAssets: 4450000,
        cash: 0,
        accountsReceivable: 1200000,
        inventory: 1250000,
        totalCurrentAssets: 2500000,
        fixedAssets: 1800000,
        totalLiabilities: 3400000,
        accountsPayable: 500000,
        totalCurrentLiabilities: 2150000,
        bankLoansCurrent: 1450000,
        bankLoansNonCurrent: 1200000,
      },
      {
        period: "31-Dec-24",
        periodLength: 12,
        revenue: 6612000,
        grossProfit: 1917500,
        operatingProfit: 701300,
        netProfit: 410000,
        depreciation: 100000,
        interestPaid: 176000,
        distributions: 150000,
        totalAssets: 5014000,
        cash: 0,
        accountsReceivable: 1443000,
        inventory: 1550000,
        totalCurrentAssets: 3064000,
        fixedAssets: 1800000,
        totalLiabilities: 3704000,
        accountsPayable: 590000,
        totalCurrentLiabilities: 2454000,
        bankLoansCurrent: 1643000,
        bankLoansNonCurrent: 1200000,
      },
    ];

    return periods;
  } catch (error) {
    return rejectWithValue("Failed to load financial data");
  }
});

// Async thunk to calculate metrics
export const calculateCashFlowMetrics = createAsyncThunk("cashFlow/calculateMetrics", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { cashFlow: CashFlowState };
    const { periods, currentPeriod } = state.cashFlow;

    if (!periods.length) {
      throw new Error("No financial data available");
    }

    const current = periods[currentPeriod];
    const previous = currentPeriod > 0 ? periods[currentPeriod - 1] : undefined;

    return calculateMetrics(current, previous);
  } catch (error) {
    return rejectWithValue("Failed to calculate metrics");
  }
});

const cashFlowSlice = createSlice({
  name: "cashFlow",
  initialState,
  reducers: {
    setCurrentPeriod: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.periods.length) {
        state.currentPeriod = action.payload;
      }
    },
    updatePeriodData: (state, action: PayloadAction<{ periodIndex: number; field: keyof FinancialPeriod; value: number }>) => {
      const { periodIndex, field, value } = action.payload;
      if (periodIndex >= 0 && periodIndex < state.periods.length) {
        (state.periods[periodIndex] as any)[field] = value;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCashFlow: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFinancialData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFinancialData.fulfilled, (state, action) => {
        state.loading = false;
        state.periods = action.payload;
        state.currentPeriod = action.payload.length - 1; // Set to latest period
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(loadFinancialData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(calculateCashFlowMetrics.pending, (state) => {
        state.loading = true;
      })
      .addCase(calculateCashFlowMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(calculateCashFlowMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPeriod, updatePeriodData, clearError, resetCashFlow } = cashFlowSlice.actions;
export default cashFlowSlice.reducer;
