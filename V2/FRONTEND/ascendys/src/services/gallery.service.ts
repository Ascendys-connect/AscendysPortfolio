import api from './api.service';
import type { Gallery, GalleryFormData } from '@/types/content.types';

export const galleryService = {
  getAll: async (params?: Record<string, string>): Promise<Gallery[]> => {
    const response = await api.get('/media/galleries/', params);
    const data = (response as any).data ?? response;
    return Array.isArray(data) ? data : [];
  },

  getById: async (id: string): Promise<Gallery> => {
    const response = await api.get(`/media/galleries/${id}/`);
    return (response as any).data ?? response;
  },

  create: async (data: GalleryFormData): Promise<Gallery> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('gallery_type', data.gallery_type);
    formData.append('is_published', String(data.is_published ?? false));

    if (data.gallery_type === 'PHOTOS' && data.photos) {
      data.photos.forEach((photo, index) => {
        formData.append(`photo_${index + 1}`, photo);
      });
    } else if (data.gallery_type === 'VIDEO' && data.video) {
      formData.append('video', data.video);
    }

    if (data.cover_image) {
      formData.append('cover_image', data.cover_image);
    }

    const response = await api.post('/media/galleries/', formData);
    return (response as any).data ?? response;
  },

  update: async (id: string, data: Partial<GalleryFormData> | FormData): Promise<Gallery> => {
    let payload: any;
    if (data instanceof FormData) {
      payload = data;
    } else {
      payload = new FormData();
      if (data.title !== undefined) payload.append('title', data.title);
      if (data.description !== undefined) payload.append('description', data.description);
      if (data.gallery_type !== undefined) payload.append('gallery_type', data.gallery_type);
      if (data.is_published !== undefined) payload.append('is_published', String(data.is_published));
      if (data.photos) {
        data.photos.forEach((photo, index) => {
          if (photo) payload.append(`photo_${index + 1}`, photo);
        });
      }
      if (data.video) payload.append('video', data.video);
      if (data.cover_image) payload.append('cover_image', data.cover_image);
    }
    const response = await api.patch(`/media/galleries/${id}/`, payload);
    return (response as any).data ?? response;
  },

  togglePublish: async (id: string): Promise<{ id: string; is_published: boolean }> => {
    const response = await api.post(`/media/galleries/${id}/toggle_publish/`);
    return (response as any).data ?? response;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/media/galleries/${id}/`);
  },
};
