/**
 * Types for the notification system
 */

export type NotificationType = 'PAYMENT' | 'CONTACT' | 'NEWSLETTER' | 'SYSTEM' | 'BROADCAST';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  type_display?: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  read_at?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface NotificationFilter {
  type?: NotificationType | 'ALL';
  is_read?: boolean;
  search?: string;
}

export interface UnreadCountResponse {
  success: boolean;
  unread_count: number;
}

export interface BroadcastPayload {
  target_type: 'ALL' | 'ROLE' | 'CUSTOM';
  roles?: string[];
  user_ids?: string[];
  title: string;
  message: string;
  link?: string;
  priority?: 'NORMAL' | 'HIGH';
}

export interface BroadcastResponse {
  success: boolean;
  message: string;
  recipients_count: number;
}
