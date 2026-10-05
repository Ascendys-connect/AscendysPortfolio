import { apiService } from './api.service';

export interface Offer {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image?: string;
  banner?: string;
  type: string;
  type_display: string;
  start_date?: string;
  end_date?: string;
  status: string;
  status_display: string;
  is_featured: boolean;
  is_active: boolean;
  created_by?: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface OfferFormData {
  title: string;
  short_description: string;
  description: string;
  image: File | string | null;
  banner: File | string | null;
  type: string;
  start_date: string;
  end_date: string;
  status: string;
  is_featured: boolean;
}

export const offersService = {
  getAll: (params?: Record<string, any>) => apiService.get<{ results: Offer[] }>('/offers/', params),
  getBySlug: (slug: string) => apiService.get<Offer>(`/offers/${slug}/`),
  
  create: (data: OfferFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('short_description', data.short_description);
    formData.append('description', data.description);
    if (data.image) formData.append('image', data.image);
    if (data.banner) formData.append('banner', data.banner);
    formData.append('type', data.type);
    if (data.start_date) formData.append('start_date', data.start_date);
    if (data.end_date) formData.append('end_date', data.end_date);
    formData.append('status', data.status);
    formData.append('is_featured', data.is_featured.toString());
    
    return apiService.post<Offer>('/offers/', formData);
  },
  
  update: (slug: string, data: OfferFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('short_description', data.short_description);
    formData.append('description', data.description);
    if (data.image) formData.append('image', data.image);
    if (data.banner) formData.append('banner', data.banner);
    formData.append('type', data.type);
    if (data.start_date) formData.append('start_date', data.start_date);
    if (data.end_date) formData.append('end_date', data.end_date);
    formData.append('status', data.status);
    formData.append('is_featured', data.is_featured.toString());
    
    return apiService.put<Offer>(`/offers/${slug}/`, formData);
  },
  
  delete: (slug: string) => apiService.delete(`/offers/${slug}/`),
  publish: (slug: string) => apiService.post<Offer>(`/offers/${slug}/publish/`),
  setToDraft: (slug: string) => apiService.post<Offer>(`/offers/${slug}/set-to-draft/`),
  archive: (slug: string) => apiService.post<Offer>(`/offers/${slug}/archive/`),
};
