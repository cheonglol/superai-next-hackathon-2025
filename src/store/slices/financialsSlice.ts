import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { financialsMockApi } from "@/services/mockApi/financialsMockApi";
import type { FinancialData, FinancialsFilters, PeriodData, Branch } from "@/types/financials";

export interface FinancialsState {
  data: FinancialData | null;
  filters: FinancialsFilters;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  saving: boolean;
  selectedBranchId: string | 'consolidated';
}

const initialState: FinancialsState = {
  data: null,
  filters: {
    period: "currentMonth",
  },
  loading: false,
  error: null,
  lastUpdated: null,
  saving: false,
  selectedBranchId: 'consolidated',
};

export const fetchFinancialData = createAsyncThunk(
  "financials/fetchData",
  async (filters: FinancialsFilters, { rejectWithValue }) => {
    try {
      // In production, this would call the real API
      if (import.meta.env.PROD) {
        // TODO: Replace with real API call
        // return await apiService.getFinancialData(filters);
      }

      // Use mock data for development
      return await financialsMockApi.getFinancialData(filters);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load financial data";
      return rejectWithValue(errorMessage);
    }
  }
);

export const saveBranchData = createAsyncThunk(
  "financials/saveBranchData",
  async ({ branchId, periodData }: { branchId: string; periodData: PeriodData[] }, { rejectWithValue }) => {
    try {
      await financialsMockApi.saveBranchData(branchId, periodData);
      return { branchId, periodData };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save branch data";
      return rejectWithValue(errorMessage);
    }
  }
);

export const saveConsolidatedData = createAsyncThunk(
  "financials/saveConsolidatedData",
  async (consolidatedData: PeriodData[], { rejectWithValue }) => {
    try {
      await financialsMockApi.saveConsolidatedData(consolidatedData);
      return consolidatedData;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save consolidated data";
      return rejectWithValue(errorMessage);
    }
  }
);

export const addBranch = createAsyncThunk(
  "financials/addBranch",
  async (branch: Omit<Branch, 'id'>, { rejectWithValue }) => {
    try {
      return await financialsMockApi.addBranch(branch);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add branch";
      return rejectWithValue(errorMessage);
    }
  }
);

const financialsSlice = createSlice({
  name: "financials",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FinancialsFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedBranch: (state, action: PayloadAction<string>) => {
      state.selectedBranchId = action.payload;
    },
    updatePeriodData: (state, action: PayloadAction<{ branchId: string | 'consolidated'; periodId: string; field: string; value: number | string }>) => {
      if (!state.data?.inputData) return;
      
      const { branchId, periodId, field, value } = action.payload;
      
      if (branchId === 'consolidated') {
        const period = state.data.inputData.consolidatedData.periods.find(p => p.periodId === periodId);
        if (period) {
          (period as any)[field] = value;
        }
      } else {
        const branchData = state.data.inputData.branchData.find(b => b.branchId === branchId);
        if (branchData) {
          const period = branchData.periods.find(p => p.periodId === periodId);
          if (period) {
            (period as any)[field] = value;
          }
        }
      }
    },
    setPeriodType: (state, action: PayloadAction<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>) => {
      if (state.data?.inputData) {
        state.data.inputData.selectedPeriodType = action.payload;
      }
    },
    setNumberOfPeriods: (state, action: PayloadAction<number>) => {
      if (state.data?.inputData && action.payload >= 2 && action.payload <= 6) {
        state.data.inputData.numberOfPeriods = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFinancials: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancialData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancialData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchFinancialData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveBranchData.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveBranchData.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(saveBranchData.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })
      .addCase(saveConsolidatedData.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveConsolidatedData.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(saveConsolidatedData.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })
      .addCase(addBranch.fulfilled, (state, action) => {
        if (state.data?.inputData) {
          state.data.inputData.branches.push(action.payload);
        }
      });
  },
});

export const { 
  setFilters, 
  setSelectedBranch, 
  updatePeriodData, 
  setPeriodType, 
  setNumberOfPeriods, 
  clearError, 
  resetFinancials 
} = financialsSlice.actions;
export default financialsSlice.reducer;