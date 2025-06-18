import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { insightsMockApi } from "@/services/mockApi/insightsMockApi";
import type { InsightsData } from "@/types/insights";

export interface InsightsState {
  data: InsightsData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: InsightsState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

export const fetchInsights = createAsyncThunk(
  "insights/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      return await insightsMockApi.getInsights();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load insights";
      return rejectWithValue(errorMessage);
    }
  }
);

const insightsSlice = createSlice({
  name: "insights",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetInsights: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetInsights } = insightsSlice.actions;
export default insightsSlice.reducer;