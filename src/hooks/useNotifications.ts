import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { 
  fetchNotifications, 
  fetchNotificationSettings, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  updateNotificationSettings 
} from "@/store/slices/notificationsSlice";
import type { NotificationSettings } from "@/types/notifications";

export function useNotifications() {
  const dispatch = useAppDispatch();
  const { notifications, settings, loading, error } = useAppSelector((state) => state.notifications);

  const markAsRead = (notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const markAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const updateSettings = (newSettings: NotificationSettings) => {
    dispatch(updateNotificationSettings(newSettings));
  };

  const refetch = () => {
    dispatch(fetchNotifications());
    dispatch(fetchNotificationSettings());
  };

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchNotificationSettings());
  }, [dispatch]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    settings,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    updateSettings,
    refetch,
  };
}