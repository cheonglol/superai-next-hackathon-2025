import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { socialMediaMockApi } from "@/services/mockApi/socialMediaMockApi";
import type { SocialMediaPlatform, SocialMediaPost, SocialMediaMetrics, SocialMediaFilters } from "@/types/socialMedia";

export interface SocialMediaState {
  platforms: SocialMediaPlatform[];
  topPosts: SocialMediaPost[];
  metrics: SocialMediaMetrics;
  selectedTimeframe: string;
  loading: boolean;
  error: string | null;
}

const initialState: SocialMediaState = {
  platforms: [],
  topPosts: [],
  metrics: {
    totalFollowers: 0,
    totalReach: 0,
    avgEngagement: 0,
    totalPosts: 0,
    growthRate: 0,
    topHashtag: "",
  },
  selectedTimeframe: "30days",
  loading: false,
  error: null,
};

export const fetchSocialMediaData = createAsyncThunk("socialMedia/fetchData", async (timeframe: string, { rejectWithValue }) => {
  try {
    const filters: SocialMediaFilters = { timeframe };
    
    // In production, this would call the real API
    if (import.meta.env.PROD) {
      // TODO: Replace with real API call
      // return await apiService.getSocialMediaAnalytics(filters);
    }

    // Use mock data for development
    return await socialMediaMockApi.getSocialMediaAnalytics(filters);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
          (error as { message?: string })?.message ||
          "Failed to fetch social media data";
    return rejectWithValue(errorMessage);
  }
});

const socialMediaSlice = createSlice({
  name: "socialMedia",
  initialState,
  reducers: {
    setTimeframe: (state, action: PayloadAction<string>) => {
      state.selectedTimeframe = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialMediaData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialMediaData.fulfilled, (state, action) => {
        state.loading = false;
        state.platforms = action.payload.platforms;
        state.topPosts = action.payload.topPosts;
        state.metrics = action.payload.metrics;
      })
      .addCase(fetchSocialMediaData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTimeframe, clearError } = socialMediaSlice.actions;
export default socialMediaSlice.reducer;