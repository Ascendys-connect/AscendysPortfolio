/**
 * Service pour gérer les notifications administrateur
 */

import { apiService } from './api.service';
import type {
  NotificationItem,
  NotificationFilter,
} from '@/types/notification.types';

class NotificationsService {
  private baseURL = '/notifications';

  /**
   * Récupérer la liste des notifications avec pagination et filtres
   */
  async getNotifications(params?: NotificationFilter & { page?: number; page_size?: number }): Promise<{
    results: NotificationItem[];
    count: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params?.type && params.type !== 'ALL') {
      queryParams.append('type', params.type);
    }
    if (params?.is_read !== undefined) {
      queryParams.append('is_read', String(params.is_read));
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.page) {
      queryParams.append('page', String(params.page));
    }
    if (params?.page_size) {
      queryParams.append('page_size', String(params.page_size));
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${this.baseURL}/?${queryString}` : `${this.baseURL}/`;

    const response: any = await apiService.get<any>(url);

    // DRF Paginated response format
    if (response?.results) {
      return {
        results: response.results,
        count: response.count || response.results.length,
      };
    }

    // Custom format or plain array
    const data = response?.data || response;
    if (Array.isArray(data)) {
      return {
        results: data,
        count: data.length,
      };
    }

    return {
      results: [],
      count: 0,
    };
  }

  /**
   * Récupérer le nombre de notifications non lues
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response: any = await apiService.get<any>(`${this.baseURL}/unread-count/`);
      return response?.unread_count ?? response?.data?.unread_count ?? 0;
    } catch (err) {
      console.error('Erreur récupération unread-count:', err);
      return 0;
    }
  }

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(id: string): Promise<NotificationItem> {
    const response: any = await apiService.post<any>(`${this.baseURL}/${id}/mark-read/`);
    return response?.data || response;
  }

  /**
   * Marquer une notification comme non lue
   */
  async markAsUnread(id: string): Promise<NotificationItem> {
    const response: any = await apiService.post<any>(`${this.baseURL}/${id}/mark-unread/`);
    return response?.data || response;
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(): Promise<number> {
    const response: any = await apiService.post<any>(`${this.baseURL}/mark-all-read/`);
    return response?.updated_count ?? 0;
  }

  /**
   * Supprimer une notification
   */
  async deleteNotification(id: string): Promise<void> {
    await apiService.delete(`${this.baseURL}/${id}/`);
  }

  /**
   * Supprimer toutes les notifications déjà lues
   */
  async clearAllRead(): Promise<number> {
    const response: any = await apiService.delete<any>(`${this.baseURL}/clear-all-read/`);
    return response?.deleted_count ?? 0;
  }

  /**
   * Diffuser un message de masse aux utilisateurs ciblés
   */
  async sendBroadcast(payload: import('@/types/notification.types').BroadcastPayload): Promise<import('@/types/notification.types').BroadcastResponse> {
    const response: any = await apiService.post<any>(`${this.baseURL}/broadcast/`, payload);
    return response;
  }
}

export const notificationsService = new NotificationsService();
