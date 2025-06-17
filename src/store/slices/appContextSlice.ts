import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppContextState {
  // Global app state
  isInitialized: boolean;
  lastActivity: string | null;
  
  // Example counter you requested
  count: number;
  
  // Global loading states
  globalLoading: boolean;
  
  // App-wide settings
  settings: {
    autoRefresh: boolean;
    refreshInterval: number; // in seconds
    theme: "light" | "dark";
    language: "en" | "es" | "fr";
  };
  
  // Connection status
  connectionStatus: "online" | "offline" | "connecting";
  
  // Global error state
  globalError: string | null;
}

const initialState: AppContextState = {
  isInitialized: false,
  lastActivity: null,
  count: 0,
  globalLoading: false,
  settings: {
    autoRefresh: true,
    refreshInterval: 30,
    theme: "light",
    language: "en",
  },
  connectionStatus: "online",
  globalError: null,
};

const appContextSlice = createSlice({
  name: "appContext",
  initialState,
  reducers: {
    // App initialization
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    
    // Activity tracking
    updateLastActivity: (state) => {
      state.lastActivity = new Date().toISOString();
    },
    
    // Counter functionality
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    resetCount: (state) => {
      state.count = 0;
    },
    
    // Global loading
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    
    // Settings management
    updateSettings: (state, action: PayloadAction<Partial<AppContextState["settings"]>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    // Connection status
    setConnectionStatus: (state, action: PayloadAction<AppContextState["connectionStatus"]>) => {
      state.connectionStatus = action.payload;
    },
    
    // Global error handling
    setGlobalError: (state, action: PayloadAction<string | null>) => {
      state.globalError = action.payload;
    },
    clearGlobalError: (state) => {
      state.globalError = null;
    },
    
    // Reset entire app context
    resetAppContext: () => initialState,
  },
});

export const {
  setInitialized,
  updateLastActivity,
  increment,
  decrement,
  setCount,
  resetCount,
  setGlobalLoading,
  updateSettings,
  setConnectionStatus,
  setGlobalError,
  clearGlobalError,
  resetAppContext,
} = appContextSlice.actions;

export default appContextSlice.reducer;