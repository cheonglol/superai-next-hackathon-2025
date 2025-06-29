/* eslint-disable */
// @ts-nocheck
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CashFlowMetrics, FinancialPeriod } from "./cashFlowSlice";

export interface StressScenario {
  id: string;
  name: string;
  description: string;
  parameters: {
    revenueChange: number; // Percentage change
    cogSChange: number; // Percentage change
    arChange: number; // Days change in DSO
    inventoryChange: number; // Days change in DIO
    apChange: number; // Days change in DPO
    cashChange: number; // Absolute change
  };
  impact: {
    operatingCashFlow: number;
    cashConversionCycle: number;
    liquidityRatio: number;
    runway: number;
    severity: "low" | "medium" | "high" | "critical";
  };
}

export interface SensitivityAnalysis {
  variable: string;
  baseValue: number;
  scenarios: {
    change: number; // Percentage change
    newValue: number;
    cashFlowImpact: number;
    cccImpact: number;
    runwayImpact: number;
  }[];
}

export interface ScenarioStressState {
  baseMetrics: CashFlowMetrics | null;
  stressScenarios: StressScenario[];
  selectedScenario: string | null;
  sensitivityAnalysis: SensitivityAnalysis[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  customScenarios: StressScenario[];
}

const initialState: ScenarioStressState = {
  baseMetrics: null,
  stressScenarios: [],
  selectedScenario: null,
  sensitivityAnalysis: [],
  loading: false,
  error: null,
  lastUpdated: null,
  customScenarios: [],
};

// Predefined stress scenarios
const getDefaultStressScenarios = (): Omit<StressScenario, "impact">[] => [
  {
    id: "economic-downturn",
    name: "Economic Downturn",
    description: "20% revenue drop, 10% cost increase, extended payment terms",
    parameters: {
      revenueChange: -20,
      cogSChange: 10,
      arChange: 15, // 15 more days to collect
      inventoryChange: 10, // 10 more days inventory holding
      apChange: -5, // 5 fewer days to pay suppliers
      cashChange: 0,
    },
  },
  {
    id: "supply-chain-disruption",
    name: "Supply Chain Disruption",
    description: "Inventory buildup, higher costs, delayed collections",
    parameters: {
      revenueChange: -10,
      cogSChange: 15,
      arChange: 20,
      inventoryChange: 30,
      apChange: 10,
      cashChange: -50000, // Emergency cash outflow
    },
  },
  {
    id: "major-customer-loss",
    name: "Major Customer Loss",
    description: "30% revenue drop, fixed costs remain",
    parameters: {
      revenueChange: -30,
      cogSChange: -15, // Some variable cost reduction
      arChange: 5,
      inventoryChange: 20, // Excess inventory
      apChange: 15, // Extended payment terms from suppliers
      cashChange: 0,
    },
  },
  {
    id: "interest-rate-shock",
    name: "Interest Rate Shock",
    description: "Interest rates double, affecting financing costs",
    parameters: {
      revenueChange: -5,
      cogSChange: 5,
      arChange: 10,
      inventoryChange: 5,
      apChange: 0,
      cashChange: -25000, // Higher financing costs
    },
  },
  {
    id: "optimistic",
    name: "Growth Scenario",
    description: "25% revenue growth, improved efficiency",
    parameters: {
      revenueChange: 25,
      cogSChange: 20, // Economies of scale
      arChange: -5, // Better collection
      inventoryChange: -10, // Better inventory management
      apChange: 5, // Negotiated longer payment terms
      cashChange: 0,
    },
  },
];

// Calculate stress scenario impact
const calculateStressImpact = (basePeriod: FinancialPeriod, baseMetrics: CashFlowMetrics, scenario: Omit<StressScenario, "impact">): StressScenario["impact"] => {
  const { parameters } = scenario;

  // Adjust period values
  const adjustedRevenue = basePeriod.revenue * (1 + parameters.revenueChange / 100);
  const adjustedCOGS = (basePeriod.revenue - basePeriod.grossProfit) * (1 + parameters.cogSChange / 100);
  const adjustedGrossProfit = adjustedRevenue - adjustedCOGS;

  // Adjust working capital components
  const adjustedAR = basePeriod.accountsReceivable * (1 + (parameters.arChange / 100) * (365 / baseMetrics.dso));
  const adjustedInventory = basePeriod.inventory * (1 + (parameters.inventoryChange / 100) * (365 / baseMetrics.dio));
  const adjustedAP = basePeriod.accountsPayable * (1 + (parameters.apChange / 100) * (365 / baseMetrics.dpo));

  // Calculate new metrics
  const newDSO = (adjustedAR / adjustedRevenue) * 365;
  const newDIO = (adjustedInventory / adjustedCOGS) * 365;
  const newDPO = (adjustedAP / adjustedCOGS) * 365;
  const newCCC = newDSO + newDIO - newDPO;

  // Estimate new operating cash flow (simplified)
  const arChange = adjustedAR - basePeriod.accountsReceivable;
  const inventoryChange = adjustedInventory - basePeriod.inventory;
  const apChange = adjustedAP - basePeriod.accountsPayable;

  const adjustedNetProfit = basePeriod.netProfit * (adjustedGrossProfit / basePeriod.grossProfit);
  const newOperatingCashFlow = adjustedNetProfit + basePeriod.depreciation - arChange - inventoryChange + apChange;

  // New liquidity metrics
  const adjustedCash = Math.max(0, basePeriod.cash + parameters.cashChange);
  const newCurrentAssets = basePeriod.totalCurrentAssets - basePeriod.accountsReceivable - basePeriod.inventory - basePeriod.cash + adjustedAR + adjustedInventory + adjustedCash;
  const newCurrentLiabilities = basePeriod.totalCurrentLiabilities - basePeriod.accountsPayable + adjustedAP;
  const newLiquidityRatio = newCurrentAssets / newCurrentLiabilities;

  // New runway calculation
  const newBurnRate = (adjustedRevenue - adjustedRevenue * (basePeriod.operatingProfit / basePeriod.revenue)) / 12;
  const newRunway = adjustedCash / (newBurnRate / 30); // Days

  // Determine severity
  const cashFlowImpactPercent = ((newOperatingCashFlow - baseMetrics.operatingCashFlow) / Math.abs(baseMetrics.operatingCashFlow)) * 100;
  const runwayImpactPercent = ((newRunway - baseMetrics.runway) / baseMetrics.runway) * 100;

  let severity: StressScenario["impact"]["severity"] = "low";
  if (cashFlowImpactPercent < -50 || runwayImpactPercent < -50) severity = "critical";
  else if (cashFlowImpactPercent < -25 || runwayImpactPercent < -25) severity = "high";
  else if (cashFlowImpactPercent < -10 || runwayImpactPercent < -10) severity = "medium";

  return {
    operatingCashFlow: newOperatingCashFlow,
    cashConversionCycle: newCCC,
    liquidityRatio: newLiquidityRatio,
    runway: newRunway,
    severity,
  };
};

// Generate sensitivity analysis
const generateSensitivityAnalysis = (basePeriod: FinancialPeriod, baseMetrics: CashFlowMetrics): SensitivityAnalysis[] => {
  const variables = [
    { name: "Revenue", baseValue: basePeriod.revenue, changes: [-30, -20, -10, -5, 5, 10, 20, 30] },
    { name: "Days Sales Outstanding", baseValue: baseMetrics.dso, changes: [-20, -10, -5, 5, 10, 15, 20, 30] },
    { name: "Days Inventory Outstanding", baseValue: baseMetrics.dio, changes: [-20, -10, -5, 5, 10, 15, 20, 30] },
    { name: "Days Payable Outstanding", baseValue: baseMetrics.dpo, changes: [-15, -10, -5, 5, 10, 15, 20, 25] },
  ];

  return variables.map((variable) => ({
    variable: variable.name,
    baseValue: variable.baseValue,
    scenarios: variable.changes.map((change) => {
      let newValue = variable.baseValue;
      let cashFlowImpact = 0;
      let cccImpact = 0;
      let runwayImpact = 0;

      if (variable.name === "Revenue") {
        newValue = variable.baseValue * (1 + change / 100);
        const revenueImpact = newValue - variable.baseValue;
        cashFlowImpact = revenueImpact * 0.1; // Assume 10% flows to cash
        runwayImpact = (baseMetrics.runway * revenueImpact) / basePeriod.revenue;
      } else if (variable.name === "Days Sales Outstanding") {
        newValue = variable.baseValue + change;
        const arImpact = (basePeriod.revenue / 365) * change;
        cashFlowImpact = -arImpact; // Negative because AR increase reduces cash
        cccImpact = change;
      } else if (variable.name === "Days Inventory Outstanding") {
        newValue = variable.baseValue + change;
        const inventoryImpact = ((basePeriod.revenue - basePeriod.grossProfit) / 365) * change;
        cashFlowImpact = -inventoryImpact;
        cccImpact = change;
      } else if (variable.name === "Days Payable Outstanding") {
        newValue = variable.baseValue + change;
        const apImpact = ((basePeriod.revenue - basePeriod.grossProfit) / 365) * change;
        cashFlowImpact = apImpact; // Positive because AP increase improves cash
        cccImpact = -change;
      }

      return {
        change,
        newValue,
        cashFlowImpact,
        cccImpact,
        runwayImpact,
      };
    }),
  }));
};

export const runStressTests = createAsyncThunk("scenarioStress/runTests", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as {
      cashFlow: { periods: FinancialPeriod[]; currentPeriod: number; metrics: CashFlowMetrics | null };
      scenarioStress: ScenarioStressState;
    };

    const { periods, currentPeriod, metrics } = state.cashFlow;
    const { customScenarios } = state.scenarioStress;

    if (!periods.length || !metrics) {
      throw new Error("Missing financial data or cash flow metrics");
    }

    const currentData = periods[currentPeriod];
    const defaultScenarios = getDefaultStressScenarios();
    const allScenarios = [...defaultScenarios, ...customScenarios];

    const stressScenarios: StressScenario[] = allScenarios.map((scenario) => ({
      ...scenario,
      impact: calculateStressImpact(currentData, metrics, scenario),
    }));

    const sensitivityAnalysis = generateSensitivityAnalysis(currentData, metrics);

    return {
      stressScenarios,
      sensitivityAnalysis,
      baseMetrics: metrics,
    };
  } catch (error) {
    return rejectWithValue("Failed to run stress tests");
  }
});

const scenarioStressSlice = createSlice({
  name: "scenarioStress",
  initialState,
  reducers: {
    selectScenario: (state, action: PayloadAction<string>) => {
      state.selectedScenario = action.payload;
    },
    addCustomScenario: (state, action: PayloadAction<Omit<StressScenario, "impact">>) => {
      // Add a placeholder impact that will be calculated when stress tests are run
      const scenarioWithPlaceholder: StressScenario = {
        ...action.payload,
        impact: {
          operatingCashFlow: 0,
          cashConversionCycle: 0,
          liquidityRatio: 0,
          runway: 0,
          severity: "low",
        },
      };
      state.customScenarios.push(scenarioWithPlaceholder);
    },
    removeCustomScenario: (state, action: PayloadAction<string>) => {
      state.customScenarios = state.customScenarios.filter((scenario) => scenario.id !== action.payload);
    },
    updateCustomScenario: (state, action: PayloadAction<{ id: string; scenario: Partial<Omit<StressScenario, "impact">> }>) => {
      const index = state.customScenarios.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.customScenarios[index] = { ...state.customScenarios[index], ...action.payload.scenario };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetScenarioStress: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(runStressTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(runStressTests.fulfilled, (state, action) => {
        state.loading = false;
        state.stressScenarios = action.payload.stressScenarios;
        state.sensitivityAnalysis = action.payload.sensitivityAnalysis;
        state.baseMetrics = action.payload.baseMetrics;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(runStressTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectScenario, addCustomScenario, removeCustomScenario, updateCustomScenario, clearError, resetScenarioStress } = scenarioStressSlice.actions;

export default scenarioStressSlice.reducer;
