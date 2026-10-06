import api from './api.service';
import type { CompanyInfo } from '@/types/content.types';

export const companyService = {
  get: async (): Promise<CompanyInfo> => {
    const response = await api.get('/company/');
    const data = (response as any).data ?? response;
    return data;
  },

  update: async (data: FormData | Partial<CompanyInfo>): Promise<CompanyInfo> => {
    const response = await api.patch('/company/update/', data);
    const result = (response as any).data ?? response;
    return result;
  },
};
