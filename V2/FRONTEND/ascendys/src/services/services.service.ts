/**
 * Services Service
 * API calls for services management
 */

import { apiService } from './api.service';
import type { Service } from '@/types/content.types';

class ServicesService {
  private readonly basePath = '/services/services';

  async getAll(): Promise<Service[]> {
    return apiService.get<Service[]>(`${this.basePath}/`);
  }

  async getById(id: string): Promise<Service> {
    return apiService.get<Service>(`${this.basePath}/${id}/`);
  }

  async create(data: any): Promise<Service> {
    return apiService.post<Service>(`${this.basePath}/`, data);
  }

  async update(id: string, data: any): Promise<Service> {
    return apiService.put<Service>(`${this.basePath}/${id}/`, data);
  }

  async delete(id: string): Promise<void> {
    return apiService.delete(`${this.basePath}/${id}/`);
  }

  /**
   * Publish a draft service
   */
  async publish(slug: string): Promise<Service> {
    return apiService.post<Service>(`${this.basePath}/${slug}/publish/`);
  }

  /**
   * Archive a published service
   */
  async archive(slug: string): Promise<Service> {
    return apiService.post<Service>(`${this.basePath}/${slug}/archive/`);
  }
}

export const servicesService = new ServicesService();
