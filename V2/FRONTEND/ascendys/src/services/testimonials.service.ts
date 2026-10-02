/**
 * Testimonials Service
 * API calls for testimonials management
 */

import { apiService } from './api.service';
import type { Testimonial } from '@/types/content.types';

class TestimonialsService {
  private readonly basePath = '/testimonials/testimonials';

  async getAll(): Promise<Testimonial[]> {
    return apiService.get<Testimonial[]>(`${this.basePath}/`);
  }

  async getById(id: string): Promise<Testimonial> {
    return apiService.get<Testimonial>(`${this.basePath}/${id}/`);
  }

  async create(data: FormData | any): Promise<Testimonial> {
    return apiService.post<Testimonial>(`${this.basePath}/`, data);
  }

  async update(id: string, data: FormData | any): Promise<Testimonial> {
    return apiService.put<Testimonial>(`${this.basePath}/${id}/`, data);
  }

  async delete(id: string): Promise<void> {
    return apiService.delete(`${this.basePath}/${id}/`);
  }
}

export const testimonialsService = new TestimonialsService();
