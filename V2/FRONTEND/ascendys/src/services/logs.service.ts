import api from './api.service';
import type { ActivityLog } from '@/types/content.types';

export const logsService = {
  getAll: async (params?: {
    user_id?: string;
    model_name?: string;
    action?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<ActivityLog[]> => {
    const response = await api.get('/dashboard/activity-logs/', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ActivityLog> => {
    const response = await api.get(`/dashboard/activity-logs/${id}/`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/dashboard/activity-logs/${id}/`);
  },

  deleteAll: async (): Promise<void> => {
    await api.post('/dashboard/activity-logs/clear/');
  },
};
