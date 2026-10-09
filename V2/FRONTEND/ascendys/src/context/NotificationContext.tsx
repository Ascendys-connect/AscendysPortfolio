/**
 * Notification Context
 * Manages notification state, unread badge counters, polling and actions
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { notificationsService } from '@/services/notifications.service';
import type { NotificationItem } from '@/types/notification.types';

interface NotificationContextType {
  unreadCount: number;
  recentNotifications: NotificationItem[];
  isLoading: boolean;
  refreshUnreadCount: () => Promise<void>;
  refreshRecentNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [recentNotifications, setRecentNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isEligible = Boolean(isAuthenticated && user);

  const refreshUnreadCount = useCallback(async () => {
    if (!isEligible) {
      setUnreadCount(0);
      return;
    }
    try {
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Error refreshing unread count:', err);
    }
  }, [isEligible]);

  const refreshRecentNotifications = useCallback(async () => {
    if (!isEligible) {
      setRecentNotifications([]);
      return;
    }
    try {
      setIsLoading(true);
      const res = await notificationsService.getNotifications({ page_size: 5 });
      setRecentNotifications(res.results || []);
    } catch (err) {
      console.error('Error refreshing recent notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isEligible]);

  // Initial fetch and 30-second interval polling
  useEffect(() => {
    if (!isEligible) {
      setUnreadCount(0);
      setRecentNotifications([]);
      return;
    }

    refreshUnreadCount();
    refreshRecentNotifications();

    const interval = setInterval(() => {
      refreshUnreadCount();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isEligible, refreshUnreadCount, refreshRecentNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setRecentNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      await notificationsService.markAsUnread(id);
      setUnreadCount((prev) => prev + 1);
      setRecentNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false, read_at: null } : n))
      );
    } catch (err) {
      console.error('Error marking as unread:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setUnreadCount(0);
      setRecentNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const target = recentNotifications.find((n) => n.id === id);
      await notificationsService.deleteNotification(id);
      if (target && !target.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setRecentNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const clearAllRead = async () => {
    try {
      await notificationsService.clearAllRead();
      setRecentNotifications((prev) => prev.filter((n) => !n.is_read));
    } catch (err) {
      console.error('Error clearing read notifications:', err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        recentNotifications,
        isLoading,
        refreshUnreadCount,
        refreshRecentNotifications,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        clearAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
