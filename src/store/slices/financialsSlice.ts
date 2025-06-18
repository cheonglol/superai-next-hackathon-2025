/* eslint-disable @typescript-eslint/no-unused-vars */
import { financialsMockApi } from "@/services/mockApi/financialsMockApi";
import type { Branch, FinancialData, FinancialsFilters, PeriodData } from "@/types/financials";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FinancialsState {
  data: FinancialData | null;
  filters: FinancialsFilters;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  saving: boolean;
  uploading: boolean;
  selectedBranchId: string | "consolidated";
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
  uploading: false,
  selectedBranchId: "consolidated",
};

export const fetchFinancialData = createAsyncThunk("financials/fetchData", async (filters: FinancialsFilters, { rejectWithValue }) => {
  try {
    // In production, this would call the real API
    if (import.meta.env.PROD) {
      // TODO: Replace with real API call
      // return await apiService.getFinancialData(filters);
    }

    // Use mock data for development
    return await financialsMockApi.getFinancialData(filters);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to load financial data";
    return rejectWithValue(errorMessage);
  }
});

export const saveBranchData = createAsyncThunk(
  "financials/saveBranchData",
  async ({ branchId, periodData }: { branchId: string; periodData: PeriodData[] }, { rejectWithValue }) => {
    try {
      await financialsMockApi.saveBranchData(branchId, periodData);
      return { branchId, periodData };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save branch data";
      return rejectWithValue(errorMessage);
    }
  }
);

export const saveConsolidatedData = createAsyncThunk("financials/saveConsolidatedData", async (consolidatedData: PeriodData[], { rejectWithValue }) => {
  try {
    await financialsMockApi.saveConsolidatedData(consolidatedData);
    return consolidatedData;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to save consolidated data";
    return rejectWithValue(errorMessage);
  }
});

export const addBranch = createAsyncThunk("financials/addBranch", async (branch: Omit<Branch, "id">, { rejectWithValue }) => {
  try {
    return await financialsMockApi.addBranch(branch);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to add branch";
    return rejectWithValue(errorMessage);
  }
});

export const uploadFinancialDocument = createAsyncThunk(
  "financials/uploadDocument",
  async ({ branchId, documentType, file }: { branchId: string; documentType: "profitLoss" | "balanceSheet"; file: File }, { rejectWithValue }) => {
    try {
      // Simulate document processing and data extraction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, this would:
      // 1. Upload the file to the server
      // 2. Process the document using OCR/parsing
      // 3. Extract financial data automatically
      // 4. Return structured data to populate the forms

      return { branchId, documentType, extractedData: {} };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload and process document";
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
    updatePeriodData: (state, action: PayloadAction<{ branchId: string | "consolidated"; periodId: string; field: keyof PeriodData; value: number | string }>) => {
      if (!state.data?.inputData) return;

      const { branchId, periodId, field, value } = action.payload;

      if (branchId === "consolidated") {
        const period = state.data.inputData.consolidatedData.periods.find((p) => p.periodId === periodId);
        if (period) {
          (period as Record<keyof PeriodData, number | string>)[field] = value;
        }
      } else {
        const branchData = state.data.inputData.branchData.find((b) => b.branchId === branchId);
        if (branchData) {
          const period = branchData.periods.find((p) => p.periodId === periodId);
          if (period) {
            (period as Record<keyof PeriodData, number | string>)[field] = value;
          }
        }
      }
    },
    setPeriodType: (state, action: PayloadAction<"daily" | "weekly" | "monthly" | "quarterly" | "yearly">) => {
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
      })
      .addCase(uploadFinancialDocument.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadFinancialDocument.fulfilled, (state) => {
        state.uploading = false;
        // In a real implementation, this would update the financial data
        // with the extracted information from the uploaded document
      })
      .addCase(uploadFinancialDocument.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, setSelectedBranch, updatePeriodData, setPeriodType, setNumberOfPeriods, clearError, resetFinancials } = financialsSlice.actions;
export default financialsSlice.reducer;
