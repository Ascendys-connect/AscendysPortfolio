import api from './api.service';
import type { CompanyInfo } from '@/types/content.types';

export const companyService = {
  get: async (): Promise<CompanyInfo> => {
    const response = await api.get('/company/info/');
    return response.data;
  },

  update: async (data: FormData | Partial<CompanyInfo>): Promise<CompanyInfo> => {
    const headers = data instanceof FormData 
      ? { 'Content-Type': 'multipart/form-data' }
      : {};
    
    const response = await api.patch('/company/info/', data, { headers });
    return response.data;
  },
};
