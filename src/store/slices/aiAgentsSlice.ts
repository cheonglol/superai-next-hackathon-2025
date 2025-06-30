import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { CashFlowAnalysis } from "@/types/cashflow";
import type { StressTestResult } from "@/types/agents";

export interface AiAgentsState {
  cashFlowDiagnostician: {
    analysis: CashFlowAnalysis | null;
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
  };
  scenarioStressTester: {
    result: StressTestResult | null;
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
  };
  liquidityGuardian: {
    alerts: any[];
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
  };
  receivablesAutopilot: {
    collections: any[];
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
  };
}

const initialState: AiAgentsState = {
  cashFlowDiagnostician: {
    analysis: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  scenarioStressTester: {
    result: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  liquidityGuardian: {
    alerts: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  receivablesAutopilot: {
    collections: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
};

const aiAgentsSlice = createSlice({
  name: "aiAgents",
  initialState,
  reducers: {
    // Add reducers as needed for each agent
    resetAiAgents: () => initialState,
  },
  // Add extraReducers for async thunks if needed
});

export const { resetAiAgents } = aiAgentsSlice.actions;
export default aiAgentsSlice.reducer;
