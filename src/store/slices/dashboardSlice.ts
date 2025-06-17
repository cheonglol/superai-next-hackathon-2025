import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardMockApi } from "@/services/mockApi/dashboardMockApi";
import type { DashboardData } from "@/types/dashboard";

export interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      // In production, this would call the real API
      if (import.meta.env.PROD) {
        // TODO: Replace with real API call
        // return await apiService.getDashboardData();
      }

      // Use mock data for development
      return await dashboardMockApi.getDashboardData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load dashboard data";
      return rejectWithValue(errorMessage);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;