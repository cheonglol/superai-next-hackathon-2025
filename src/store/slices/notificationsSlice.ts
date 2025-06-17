import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { notificationsMockApi } from "@/services/mockApi/notificationsMockApi";
import type { Notification, NotificationSettings } from "@/types/notifications";

export interface NotificationsState {
  notifications: Notification[];
  settings: NotificationSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  settings: null,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationsMockApi.getNotifications();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load notifications";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchNotificationSettings = createAsyncThunk(
  "notifications/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationsMockApi.getNotificationSettings();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load notification settings";
      return rejectWithValue(errorMessage);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationsMockApi.markAsRead(notificationId);
      return notificationId;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to mark notification as read";
      return rejectWithValue(errorMessage);
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationsMockApi.markAllAsRead();
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to mark all notifications as read";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  "notifications/updateSettings",
  async (settings: NotificationSettings, { rejectWithValue }) => {
    try {
      return await notificationsMockApi.updateNotificationSettings(settings);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update notification settings";
      return rejectWithValue(errorMessage);
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetNotifications: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch settings
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
        }
      })
      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.read = true;
        });
      })
      // Update settings
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      });
  },
});

export const { clearError, resetNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;