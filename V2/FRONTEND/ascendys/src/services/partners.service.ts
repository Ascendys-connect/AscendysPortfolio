/**
 * Partners Service
 * API calls for partners management
 */

import { apiService } from './api.service';
import type { Partner, PartnerFormData } from '@/types/content.types';

const buildFormData = (data: PartnerFormData): FormData => {
  const fd = new FormData();
  fd.append('name', data.name);
  if (data.logo instanceof File) fd.append('logo', data.logo);
  if (data.website !== undefined) fd.append('website', data.website);
  if (data.description !== undefined) fd.append('description', data.description);
  fd.append('is_featured', String(data.is_featured ?? false));
  fd.append('is_active', String(data.is_active ?? true));
  fd.append('order', String(data.order ?? 0));
  return fd;
};

class PartnersService {
  private readonly basePath = '/partners';

  async getAll(): Promise<any> {
    return apiService.get<Partner[]>(`${this.basePath}/`);
  }

  async getById(id: string | number): Promise<any> {
    return apiService.get<Partner>(`${this.basePath}/${id}/`);
  }

  async create(data: PartnerFormData): Promise<any> {
    return apiService.post<Partner>(`${this.basePath}/`, buildFormData(data));
  }

  async update(id: string | number, data: PartnerFormData): Promise<any> {
    return apiService.patch<Partner>(`${this.basePath}/${id}/`, buildFormData(data));
  }

  async delete(id: string | number): Promise<void> {
    await apiService.delete(`${this.basePath}/${id}/`);
  }
}

export const partnersService = new PartnersService();
