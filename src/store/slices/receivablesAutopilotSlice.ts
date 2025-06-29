/* eslint-disable */
// @ts-nocheck
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CashFlowMetrics, FinancialPeriod } from "./cashFlowSlice";

export interface ReceivableAccount {
  id: string;
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  outstandingAmount: number;
  daysOverdue: number;
  agingBucket: "0-30" | "31-60" | "61-90" | "91-120" | "120+";
  riskScore: number; // 0-100, higher is riskier
  collectionPriority: "low" | "medium" | "high" | "urgent";
  lastContactDate?: string;
  paymentHistory: "excellent" | "good" | "fair" | "poor";
  recommendedAction: string;
}

export interface CollectionStrategy {
  id: string;
  name: string;
  description: string;
  applicableAging: string[];
  actions: {
    timing: number; // Days after due date
    type: "email" | "call" | "letter" | "legal";
    template: string;
    priority: number;
  }[];
  successRate: number;
  averageCollectionDays: number;
}

export interface ReceivablesMetrics {
  totalOutstanding: number;
  weightedAverageDSO: number;
  collectionEfficiency: number; // Percentage
  badDebtRate: number;
  agingDistribution: {
    "0-30": { amount: number; count: number; percentage: number };
    "31-60": { amount: number; count: number; percentage: number };
    "61-90": { amount: number; count: number; percentage: number };
    "91-120": { amount: number; count: number; percentage: number };
    "120+": { amount: number; count: number; percentage: number };
  };
  monthlyCollectionForecast: number;
  potentialCashAcceleration: number;
}

export interface ReceivablesAutopilotState {
  receivables: ReceivableAccount[];
  metrics: ReceivablesMetrics | null;
  collectionStrategies: CollectionStrategy[];
  selectedStrategy: string | null;
  automationEnabled: boolean;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  filters: {
    agingBucket?: string;
    riskLevel?: string;
    amount?: { min: number; max: number };
  };
}

const initialState: ReceivablesAutopilotState = {
  receivables: [],
  metrics: null,
  collectionStrategies: [],
  selectedStrategy: null,
  automationEnabled: false,
  loading: false,
  error: null,
  lastUpdated: null,
  filters: {},
};

// Generate mock receivables data based on total AR
const generateReceivablesData = (totalAR: number, dso: number): ReceivableAccount[] => {
  const numberOfAccounts = Math.min(50, Math.max(10, Math.floor(totalAR / 25000))); // 10-50 accounts
  const receivables: ReceivableAccount[] = [];

  // Distribution of aging buckets (typical pattern)
  const agingDistribution = {
    "0-30": 0.6,
    "31-60": 0.2,
    "61-90": 0.1,
    "91-120": 0.05,
    "120+": 0.05,
  };

  const agingBuckets = Object.keys(agingDistribution) as Array<keyof typeof agingDistribution>;
  let remainingAmount = totalAR;

  for (let i = 0; i < numberOfAccounts; i++) {
    // Select aging bucket based on distribution
    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedBucket: keyof typeof agingDistribution = "0-30";

    for (const bucket of agingBuckets) {
      cumulativeProbability += agingDistribution[bucket];
      if (random <= cumulativeProbability) {
        selectedBucket = bucket;
        break;
      }
    }

    // Calculate amount for this receivable
    const isLastAccount = i === numberOfAccounts - 1;
    const maxAmount = isLastAccount ? remainingAmount : remainingAmount * 0.3;
    const minAmount = Math.min(5000, maxAmount * 0.1);
    const amount = isLastAccount ? remainingAmount : Math.random() * (maxAmount - minAmount) + minAmount;

    remainingAmount -= amount;

    // Calculate days overdue based on aging bucket
    let daysOverdue = 0;
    switch (selectedBucket) {
      case "0-30":
        daysOverdue = Math.floor(Math.random() * 30);
        break;
      case "31-60":
        daysOverdue = 31 + Math.floor(Math.random() * 30);
        break;
      case "61-90":
        daysOverdue = 61 + Math.floor(Math.random() * 30);
        break;
      case "91-120":
        daysOverdue = 91 + Math.floor(Math.random() * 30);
        break;
      case "120+":
        daysOverdue = 120 + Math.floor(Math.random() * 60);
        break;
    }

    // Calculate risk score and other attributes
    const riskScore = Math.min(100, daysOverdue * 0.8 + Math.random() * 20);
    const collectionPriority = riskScore > 80 ? "urgent" : riskScore > 60 ? "high" : riskScore > 40 ? "medium" : "low";

    const paymentHistory = riskScore < 30 ? "excellent" : riskScore < 50 ? "good" : riskScore < 70 ? "fair" : "poor";

    // Generate dates
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() - daysOverdue);
    const invoiceDate = new Date(dueDate);
    invoiceDate.setDate(dueDate.getDate() - 30); // Assume 30-day terms

    receivables.push({
      id: `receivable-${i + 1}`,
      customerName: `Customer ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(i + 1).padStart(4, "0")}`,
      invoiceDate: invoiceDate.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      amount,
      outstandingAmount: amount * (0.8 + Math.random() * 0.2), // 80-100% outstanding
      daysOverdue,
      agingBucket: selectedBucket,
      riskScore,
      collectionPriority,
      paymentHistory,
      recommendedAction: getRecommendedAction(daysOverdue, riskScore),
    });
  }

  return receivables.sort((a, b) => b.riskScore - a.riskScore);
};

const getRecommendedAction = (daysOverdue: number, riskScore: number): string => {
  if (daysOverdue < 7) return "Monitor - payment due soon";
  if (daysOverdue < 15) return "Send friendly reminder email";
  if (daysOverdue < 30) return "Follow up with phone call";
  if (daysOverdue < 60) return "Send formal notice";
  if (daysOverdue < 90) return "Escalate to collections team";
  return "Consider legal action or write-off";
};

// Calculate receivables metrics
const calculateReceivablesMetrics = (receivables: ReceivableAccount[], currentPeriod: FinancialPeriod): ReceivablesMetrics => {
  const totalOutstanding = receivables.reduce((sum, r) => sum + r.outstandingAmount, 0);

  // Calculate aging distribution
  const agingDistribution = receivables.reduce(
    (dist, receivable) => {
      const bucket = receivable.agingBucket;
      dist[bucket].amount += receivable.outstandingAmount;
      dist[bucket].count += 1;
      return dist;
    },
    {
      "0-30": { amount: 0, count: 0, percentage: 0 },
      "31-60": { amount: 0, count: 0, percentage: 0 },
      "61-90": { amount: 0, count: 0, percentage: 0 },
      "91-120": { amount: 0, count: 0, percentage: 0 },
      "120+": { amount: 0, count: 0, percentage: 0 },
    }
  );

  // Calculate percentages
  Object.keys(agingDistribution).forEach((bucket) => {
    const bucketKey = bucket as keyof typeof agingDistribution;
    agingDistribution[bucketKey].percentage = totalOutstanding > 0 ? (agingDistribution[bucketKey].amount / totalOutstanding) * 100 : 0;
  });

  // Calculate weighted average DSO
  let weightedDays = 0;
  let weightedAmount = 0;
  receivables.forEach((r) => {
    const daysSinceInvoice = Math.max(0, Math.floor((new Date().getTime() - new Date(r.invoiceDate).getTime()) / (1000 * 60 * 60 * 24)));
    weightedDays += daysSinceInvoice * r.outstandingAmount;
    weightedAmount += r.outstandingAmount;
  });
  const weightedAverageDSO = weightedAmount > 0 ? weightedDays / weightedAmount : 0;

  // Estimate collection efficiency (percentage of receivables collected within terms)
  const currentReceivables = receivables.filter((r) => r.agingBucket === "0-30");
  const collectionEfficiency = totalOutstanding > 0 ? (currentReceivables.reduce((sum, r) => sum + r.outstandingAmount, 0) / totalOutstanding) * 100 : 0;

  // Estimate bad debt rate (120+ days aging)
  const badDebtAmount = agingDistribution["120+"].amount;
  const badDebtRate = totalOutstanding > 0 ? (badDebtAmount / totalOutstanding) * 100 : 0;

  // Monthly collection forecast (based on aging and historical patterns)
  const monthlyCollectionForecast =
    agingDistribution["0-30"].amount * 0.95 + // 95% of current
    agingDistribution["31-60"].amount * 0.8 + // 80% of 31-60 days
    agingDistribution["61-90"].amount * 0.6 + // 60% of 61-90 days
    agingDistribution["91-120"].amount * 0.4 + // 40% of 91-120 days
    agingDistribution["120+"].amount * 0.2; // 20% of 120+ days

  // Potential cash acceleration (if DSO improved by 10 days)
  const dailySales = currentPeriod.revenue / 365;
  const potentialCashAcceleration = dailySales * Math.min(10, Math.max(0, weightedAverageDSO - 30));

  return {
    totalOutstanding,
    weightedAverageDSO,
    collectionEfficiency,
    badDebtRate,
    agingDistribution,
    monthlyCollectionForecast,
    potentialCashAcceleration,
  };
};

// Default collection strategies
const getDefaultCollectionStrategies = (): CollectionStrategy[] => [
  {
    id: "standard",
    name: "Standard Collection",
    description: "Balanced approach with email and phone follow-ups",
    applicableAging: ["0-30", "31-60"],
    actions: [
      { timing: 1, type: "email", template: "payment-reminder", priority: 1 },
      { timing: 7, type: "email", template: "overdue-notice", priority: 2 },
      { timing: 15, type: "call", template: "collection-call", priority: 3 },
      { timing: 30, type: "letter", template: "formal-notice", priority: 4 },
    ],
    successRate: 78,
    averageCollectionDays: 42,
  },
  {
    id: "aggressive",
    name: "Aggressive Collection",
    description: "Fast escalation for high-risk accounts",
    applicableAging: ["61-90", "91-120", "120+"],
    actions: [
      { timing: 0, type: "call", template: "immediate-payment-demand", priority: 1 },
      { timing: 3, type: "letter", template: "final-notice", priority: 2 },
      { timing: 7, type: "legal", template: "legal-warning", priority: 3 },
      { timing: 14, type: "legal", template: "legal-action", priority: 4 },
    ],
    successRate: 65,
    averageCollectionDays: 28,
  },
  {
    id: "diplomatic",
    name: "Relationship-Focused",
    description: "Preserves customer relationships while collecting",
    applicableAging: ["0-30", "31-60"],
    actions: [
      { timing: 3, type: "email", template: "friendly-reminder", priority: 1 },
      { timing: 10, type: "call", template: "check-in", priority: 2 },
      { timing: 20, type: "email", template: "payment-plan-offer", priority: 3 },
      { timing: 35, type: "call", template: "payment-arrangement", priority: 4 },
    ],
    successRate: 72,
    averageCollectionDays: 48,
  },
];

export const calculateReceivablesData = createAsyncThunk("receivablesAutopilot/calculateData", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as {
      cashFlow: { periods: FinancialPeriod[]; currentPeriod: number; metrics: CashFlowMetrics | null };
    };

    const { periods, currentPeriod, metrics } = state.cashFlow;

    if (!periods.length || !metrics) {
      throw new Error("Missing financial data or cash flow metrics");
    }

    const current = periods[currentPeriod];
    const receivables = generateReceivablesData(current.accountsReceivable, metrics.dso);
    const receivablesMetrics = calculateReceivablesMetrics(receivables, current);
    const collectionStrategies = getDefaultCollectionStrategies();

    return {
      receivables,
      metrics: receivablesMetrics,
      collectionStrategies,
    };
  } catch (error) {
    return rejectWithValue("Failed to calculate receivables data");
  }
});

const receivablesAutopilotSlice = createSlice({
  name: "receivablesAutopilot",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ReceivablesAutopilotState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    selectStrategy: (state, action: PayloadAction<string>) => {
      state.selectedStrategy = action.payload;
    },
    toggleAutomation: (state) => {
      state.automationEnabled = !state.automationEnabled;
    },
    updateReceivable: (state, action: PayloadAction<{ id: string; updates: Partial<ReceivableAccount> }>) => {
      const index = state.receivables.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.receivables[index] = { ...state.receivables[index], ...action.payload.updates };
      }
    },
    markAsContacted: (state, action: PayloadAction<string>) => {
      const index = state.receivables.findIndex((r) => r.id === action.payload);
      if (index !== -1) {
        state.receivables[index].lastContactDate = new Date().toISOString().split("T")[0];
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetReceivablesAutopilot: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateReceivablesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateReceivablesData.fulfilled, (state, action) => {
        state.loading = false;
        state.receivables = action.payload.receivables;
        state.metrics = action.payload.metrics;
        state.collectionStrategies = action.payload.collectionStrategies;
        state.selectedStrategy = action.payload.collectionStrategies[0]?.id || null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(calculateReceivablesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, selectStrategy, toggleAutomation, updateReceivable, markAsContacted, clearError, resetReceivablesAutopilot } = receivablesAutopilotSlice.actions;

export default receivablesAutopilotSlice.reducer;
