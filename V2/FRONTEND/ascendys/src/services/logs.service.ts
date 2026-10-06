import { apiService } from './api.service';
import type { ActivityLog, PaginatedResponse } from '@/types/content.types';

export interface LogsParams {
  page?: number;
  action?: string;
  search?: string;
}

export const logsService = {
  getAll: async (params?: LogsParams): Promise<PaginatedResponse<ActivityLog>> => {
    const response = await apiService.get('/dashboard/activity-logs/', params as Record<string, string | number | boolean>);
    // apiService.get() returns the raw JSON body — DRF paginated: { count, next, previous, results }
    return response as unknown as PaginatedResponse<ActivityLog>;
  },

  getById: async (id: string): Promise<ActivityLog> => {
    const response = await apiService.get(`/dashboard/activity-logs/${id}/`);
    return response as unknown as ActivityLog;
  },

  clearAll: async (): Promise<void> => {
    await apiService.post('/dashboard/activity-logs/clear/');
  },
};
