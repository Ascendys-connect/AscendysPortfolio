import { apiService } from './api.service';
import type { BlogCategory, Tag, BlogPost, BlogFormData } from '@/types/content.types';

// Categories Services
export const blogCategoriesService = {
  getAll: () => apiService.get<BlogCategory[]>('/blog/categories/'),
  getBySlug: (slug: string) => apiService.get<BlogCategory>(`/blog/categories/${slug}/`),
  create: (data: Partial<BlogCategory>) => apiService.post<BlogCategory>('/blog/categories/', data),
  update: (slug: string, data: Partial<BlogCategory>) => apiService.put<BlogCategory>(`/blog/categories/${slug}/`, data),
  delete: (slug: string) => apiService.delete(`/blog/categories/${slug}/`),
};

// Tags Services
export const tagsService = {
  getAll: () => apiService.get<Tag[]>('/blog/tags/'),
  getBySlug: (slug: string) => apiService.get<Tag>(`/blog/tags/${slug}/`),
  create: (data: Partial<Tag>) => apiService.post<Tag>('/blog/tags/', data),
  update: (slug: string, data: Partial<Tag>) => apiService.put<Tag>(`/blog/tags/${slug}/`, data),
  delete: (slug: string) => apiService.delete(`/blog/tags/${slug}/`),
};

// Blog Posts Services
export const blogPostsService = {
  getAll: (params?: Record<string, any>) => apiService.get<BlogPost[]>('/blog/', { params }),
  getBySlug: (slug: string) => apiService.get<BlogPost>(`/blog/${slug}/`),
  
  create: (data: BlogFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('excerpt', data.excerpt);
    formData.append('content', data.content);
    if (data.category) formData.append('category', data.category.toString());
    if (data.cover_image) formData.append('cover_image', data.cover_image);
    if (data.video) formData.append('video', data.video);
    formData.append('status', data.status);
    formData.append('is_featured', data.is_featured.toString());
    
    // Tags
    data.tags_ids.forEach(id => formData.append('tags_ids', id.toString()));
    
    // Don't set Content-Type header for FormData - browser will set it with boundary
    return apiService.post<BlogPost>('/blog/', formData);
  },
  
  update: (slug: string, data: BlogFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('excerpt', data.excerpt);
    formData.append('content', data.content);
    if (data.category) formData.append('category', data.category.toString());
    if (data.cover_image) formData.append('cover_image', data.cover_image);
    if (data.video) formData.append('video', data.video);
    formData.append('status', data.status);
    formData.append('is_featured', data.is_featured.toString());
    
    // Tags
    data.tags_ids.forEach(id => formData.append('tags_ids', id.toString()));
    
    return apiService.put<BlogPost>(`/blog/${slug}/`, formData);
  },
  
  delete: (slug: string) => apiService.delete(`/blog/${slug}/`),
  publish: (slug: string) => apiService.post<BlogPost>(`/blog/${slug}/publish/`),
  setToDraft: (slug: string) => apiService.post<BlogPost>(`/blog/${slug}/set-to-draft/`),
  archive: (slug: string) => apiService.post<BlogPost>(`/blog/${slug}/archive/`),
  getFeatured: () => apiService.get<BlogPost[]>('/blog/featured/'),
};
