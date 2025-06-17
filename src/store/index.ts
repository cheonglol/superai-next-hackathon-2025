import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import reviewsReducer from "./slices/reviewsSlice";
import socialMediaReducer from "./slices/socialMediaSlice";
import trendingReducer from "./slices/trendingSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    reviews: reviewsReducer,
    socialMedia: socialMediaReducer,
    trending: trendingReducer,
    ui: uiReducer,
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
