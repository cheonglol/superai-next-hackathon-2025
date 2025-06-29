import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import appContextReducer from "./slices/appContextSlice";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import reviewsReducer from "./slices/reviewsSlice";
import socialMediaReducer from "./slices/socialMediaSlice";
import trendingReducer from "./slices/trendingSlice";
import financialsReducer from "./slices/financialsSlice";
import uiReducer from "./slices/uiSlice";
import insightsReducer from "./slices/insightsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import aiAgentsReducer from "./slices/aiAgentsSlice";

export const store = configureStore({
  reducer: {
    appContext: appContextReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    reviews: reviewsReducer,
    socialMedia: socialMediaReducer,
    trending: trendingReducer,
    financials: financialsReducer,
    ui: uiReducer,
    insights: insightsReducer,
    notifications: notificationsReducer,
    aiAgents: aiAgentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
