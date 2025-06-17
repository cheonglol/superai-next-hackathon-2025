import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { ReviewsAnalytics, ReviewsFilters } from "@/types/reviews";
import { reviewsService } from "@/services/reviewsService";
import { mockDataService } from "@/services/mockDataService";

export interface ReviewsState {
  data: ReviewsAnalytics | null;
  filters: ReviewsFilters;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: ReviewsState = {
  data: null,
  filters: {
    selectedPeriod: "12months",
    comparisonPeriod: "previous12months",
  },
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const fetchReviewsAnalytics = createAsyncThunk("reviews/fetchAnalytics", async (filters: ReviewsFilters, { rejectWithValue }) => {
  try {
    // In production, this would call the real API
    if (import.meta.env.PROD) {
      // TODO: Replace with real API call
      // return await reviewsService.getAnalytics(filters);
    }

    // Use mock data for development
    const analytics = await mockDataService.getAnalytics();
    return analytics;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
          (error as { message?: string })?.message ||
          "Failed to fetch analytics";
    return rejectWithValue(errorMessage);
  }
});

export const exportReviewsReport = createAsyncThunk("reviews/exportReport", async (filters: ReviewsFilters, { rejectWithValue }) => {
  try {
    const blob = await reviewsService.exportReport(filters);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reviews-report-${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return "Report exported successfully";
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
          (error as { message?: string })?.message ||
          "Failed to export report";
    return rejectWithValue(errorMessage);
  }
});

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ReviewsFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    resetReviewsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch analytics
      .addCase(fetchReviewsAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchReviewsAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Export report
      .addCase(exportReviewsReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(exportReviewsReport.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportReviewsReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearError, resetReviewsState } = reviewsSlice.actions;
export default reviewsSlice.reducer;