import api from './api.service';

export interface ContactMessage {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  subject_display: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  status_display: string;
  admin_notes: string;
  assigned_to: number | null;
  assigned_to_name: string | null;
  resolved_at: string | null;
  consent_privacy: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_verified: boolean;
  interests: string[];
  consent_date: string;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

function extractArray<T>(response: any): T[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.results)) return response.data.results;
  if (response?.data && Array.isArray(response.data)) return response.data;
  return [];
}

export const contactService = {
  // Contact messages
  getMessages: async (params?: Record<string, any>): Promise<ContactMessage[]> => {
    const response = await api.get('/contact/messages/', params);
    return extractArray<ContactMessage>(response);
  },

  getMessageById: async (id: number): Promise<ContactMessage> => {
    const response = await api.get(`/contact/messages/${id}/`);
    return (response as any).data ?? response;
  },

  updateMessageStatus: async (
    id: number,
    statusData: { status?: string; admin_notes?: string }
  ): Promise<ContactMessage> => {
    const response = await api.patch(`/contact/messages/${id}/`, statusData);
    return (response as any).data ?? response;
  },

  markResolved: async (id: number): Promise<ContactMessage> => {
    const response = await api.post(`/contact/messages/${id}/mark_resolved/`);
    return (response as any).data ?? response;
  },

  deleteMessage: async (id: number): Promise<void> => {
    await api.delete(`/contact/messages/${id}/`);
  },

  // Newsletter
  getSubscribers: async (params?: Record<string, any>): Promise<NewsletterSubscriber[]> => {
    const response = await api.get('/contact/newsletter/', params);
    return extractArray<NewsletterSubscriber>(response);
  },

  deleteSubscriber: async (id: number): Promise<void> => {
    await api.delete(`/contact/newsletter/${id}/`);
  },
};
