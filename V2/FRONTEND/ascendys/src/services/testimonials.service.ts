/**
 * Testimonials Service
 * API calls for testimonials management
 */

import { apiService } from './api.service';
import type { Testimonial, TestimonialFormData } from '@/types/content.types';

const buildFormData = (data: TestimonialFormData): FormData => {
  const fd = new FormData();
  fd.append('name', data.name);
  fd.append('role', data.role);
  if (data.company) fd.append('company', data.company);
  if (data.avatar instanceof File) fd.append('avatar', data.avatar);
  fd.append('content', data.content);
  fd.append('rating', String(data.rating));
  fd.append('is_featured', String(data.is_featured ?? false));
  fd.append('is_published', String(data.is_published ?? false));
  fd.append('order', String(data.order ?? 0));
  return fd;
};

class TestimonialsService {
  private readonly basePath = '/testimonials';

  async getAll(): Promise<any> {
    return apiService.get<Testimonial[]>(`${this.basePath}/`);
  }

  async getById(id: string | number): Promise<any> {
    return apiService.get<Testimonial>(`${this.basePath}/${id}/`);
  }

  async create(data: TestimonialFormData): Promise<any> {
    return apiService.post<Testimonial>(`${this.basePath}/`, buildFormData(data));
  }

  async update(id: string | number, data: TestimonialFormData): Promise<any> {
    return apiService.patch<Testimonial>(`${this.basePath}/${id}/`, buildFormData(data));
  }

  async delete(id: string | number): Promise<void> {
    await apiService.delete(`${this.basePath}/${id}/`);
  }
}

export const testimonialsService = new TestimonialsService();
