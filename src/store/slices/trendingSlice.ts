import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { trendingContentLoader } from "@/loaders/trendingContentLoader";
import type { TrendingHashtag, TrendingTopic, ViralContent, TrendingFilters } from "@/types/trending";

export interface TrendingState {
  hashtags: TrendingHashtag[];
  topics: TrendingTopic[];
  viralContent: ViralContent[];
  selectedCategory: string;
  selectedTimeframe: string;
  loading: boolean;
  error: string | null;
}

const initialState: TrendingState = {
  hashtags: [],
  topics: [],
  viralContent: [],
  selectedCategory: "all",
  selectedTimeframe: "24hours",
  loading: false,
  error: null,
};

export const fetchTrendingData = createAsyncThunk("trending/fetchData", async ({ category, timeframe }: { category: string; timeframe: string }, { rejectWithValue }) => {
  try {
    const filters: TrendingFilters = { category, timeframe };
    return await trendingContentLoader(filters);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
          (error as { message?: string })?.message ||
          "Failed to fetch trending data";
    return rejectWithValue(errorMessage);
  }
});

const trendingSlice = createSlice({
  name: "trending",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setTimeframe: (state, action: PayloadAction<string>) => {
      state.selectedTimeframe = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingData.fulfilled, (state, action) => {
        state.loading = false;
        state.hashtags = action.payload.hashtags;
        state.topics = action.payload.topics;
        state.viralContent = action.payload.viralContent;
      })
      .addCase(fetchTrendingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCategory, setTimeframe, clearError } = trendingSlice.actions;
export default trendingSlice.reducer;
