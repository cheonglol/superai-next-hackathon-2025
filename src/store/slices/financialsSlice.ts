import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { financialsMockApi } from "@/services/mockApi/financialsMockApi";
import type { FinancialData, FinancialsFilters } from "@/types/financials";

export interface FinancialsState {
  data: FinancialData | null;
  filters: FinancialsFilters;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: FinancialsState = {
  data: null,
  filters: {
    period: "currentMonth",
  },
  loading: false,
  error: null,
  lastUpdated: null,
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

const financialsSlice = createSlice({
  name: "financials",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FinancialsFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
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
      });
  },
});

export const { setFilters, clearError, resetFinancials } = financialsSlice.actions;
export default financialsSlice.reducer;