/**
 * Trainings Service
 * API calls for trainings management
 */

import { apiService } from './api.service';
import type { Training } from '@/types/content.types';

class TrainingsService {
  private readonly basePath = '/trainings';

  async getAll(): Promise<Training[]> {
    return apiService.get<Training[]>(`${this.basePath}/`);
  }

  async getById(id: string): Promise<Training> {
    return apiService.get<Training>(`${this.basePath}/${id}/`);
  }

  async getBySlug(slug: string): Promise<Training> {
    return apiService.get<Training>(`${this.basePath}/${slug}/`);
  }

  async create(data: FormData | any): Promise<Training> {
    return apiService.post<Training>(`${this.basePath}/`, data);
  }

  async update(slug: string, data: FormData | any): Promise<Training> {
    return apiService.put<Training>(`${this.basePath}/${slug}/`, data);
  }

  async delete(id: string): Promise<void> {
    return apiService.delete(`${this.basePath}/${id}/`);
  }

  /**
   * Publish a draft training
   */
  async publish(slug: string): Promise<Training> {
    return apiService.post<Training>(`${this.basePath}/${slug}/publish/`);
  }

  /**
   * Archive a published training
   */
  async archive(slug: string): Promise<Training> {
    return apiService.post<Training>(`${this.basePath}/${slug}/archive/`);
  }

  /**
   * Set training to draft status
   */
  async draft(slug: string): Promise<Training> {
    return apiService.post<Training>(`${this.basePath}/${slug}/draft/`);
  }
}

export const trainingsService = new TrainingsService();
