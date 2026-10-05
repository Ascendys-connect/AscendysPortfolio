import { apiService } from './api.service';

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  icon?: string;
  image?: string;
  features?: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceFormData {
  title: string;
  description: string;
  short_description: string;
  icon: File | string | null;
  image: File | string | null;
  features: string[];
  is_featured: boolean;
  is_active: boolean;
}

export const servicesService = {
  getAll: () => apiService.get<Service[]>('/services/'),
  getBySlug: (slug: string) => apiService.get<Service>(`/services/${slug}/`),
  
  create: (data: ServiceFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('short_description', data.short_description);
    if (data.icon instanceof File) formData.append('icon', data.icon);
    if (data.image instanceof File) formData.append('image', data.image);
    formData.append('features', JSON.stringify(data.features || []));
    formData.append('is_featured', data.is_featured ? 'true' : 'false');
    formData.append('is_active', data.is_active ? 'true' : 'false');
    
    return apiService.post<Service>('/services/', formData);
  },
  
  update: (slug: string, data: ServiceFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('short_description', data.short_description);
    if (data.icon instanceof File) formData.append('icon', data.icon);
    if (data.image instanceof File) formData.append('image', data.image);
    formData.append('features', JSON.stringify(data.features || []));
    formData.append('is_featured', data.is_featured ? 'true' : 'false');
    formData.append('is_active', data.is_active ? 'true' : 'false');
    
    return apiService.put<Service>(`/services/${slug}/`, formData);
  },
  
  delete: (slug: string) => apiService.delete(`/services/${slug}/`),
};
