import api from './api.service';
import type { Settings } from '@/types/content.types';

export const settingsService = {
  get: async (): Promise<Settings> => {
    const response = await api.get('/core/settings/');
    return response.data;
  },

  update: async (data: Partial<Settings>): Promise<Settings> => {
    const response = await api.patch('/core/settings/', data);
    return response.data;
  },
};
