import { useEffect, useState } from "react";
import { notificationsMockApi } from "@/services/mockApi/notificationsMockApi";
import type { Notification, NotificationSettings } from "@/types/notifications";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const [notificationsData, settingsData] = await Promise.all([notificationsMockApi.getNotifications(), notificationsMockApi.getNotificationSettings()]);
      setNotifications(notificationsData);
      setSettings(settingsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsMockApi.markAsRead(notificationId);
      setNotifications((prev) => prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsMockApi.markAllAsRead();
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark all notifications as read");
    }
  };

  const updateSettings = async (newSettings: NotificationSettings) => {
    try {
      const updatedSettings = await notificationsMockApi.updateNotificationSettings(newSettings);
      setSettings(updatedSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update notification settings");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

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
    refetch: loadNotifications,
  };
}
