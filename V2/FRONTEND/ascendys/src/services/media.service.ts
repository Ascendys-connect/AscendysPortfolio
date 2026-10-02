import api from './api.service';
import type { MediaFile } from '@/types/content.types';

export const mediaService = {
  getAll: async (): Promise<MediaFile[]> => {
    const response = await api.get('/media/files/');
    return response.data;
  },

  getById: async (id: string): Promise<MediaFile> => {
    const response = await api.get(`/media/files/${id}/`);
    return response.data;
  },

  upload: async (data: FormData): Promise<MediaFile> => {
    const response = await api.post('/media/files/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: Partial<MediaFile>): Promise<MediaFile> => {
    const response = await api.patch(`/media/files/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/media/files/${id}/`);
  },
};
