import apiService from './api.service';
import type { Event, EventFormData } from '@/types/content.types';
import type { ApiResponse } from '@/types/api.types';

const basePath = '/events';

export const eventsService = {
  /**
   * Get all events
   */
  async getAll(): Promise<ApiResponse<Event[]>> {
    return apiService.get<Event[]>(`${basePath}/`);
  },

  /**
   * Get a single event by slug
   */
  async getBySlug(slug: string): Promise<ApiResponse<Event>> {
    return apiService.get<Event>(`${basePath}/${slug}/`);
  },

  /**
   * Create a new event
   */
  async create(data: EventFormData): Promise<ApiResponse<Event>> {
    const formData = new FormData();
    
    // Add all fields to FormData
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('location', data.location);
    formData.append('event_type', data.event_type);
    formData.append('start_datetime', data.start_datetime);
    formData.append('end_datetime', data.end_datetime);
    formData.append('capacity', data.capacity.toString());
    
    if (data.registration_url) {
      formData.append('registration_url', data.registration_url);
    }
    
    if (data.status) {
      formData.append('status', data.status);
    }
    
    formData.append('is_featured', data.is_featured ? 'true' : 'false');
    
    // Handle image upload
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
    }
    
    return apiService.post<Event>(`${basePath}/`, formData);
  },

  /**
   * Update an event
   */
  async update(slug: string, data: EventFormData): Promise<ApiResponse<Event>> {
    const formData = new FormData();
    
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('location', data.location);
    formData.append('event_type', data.event_type);
    formData.append('start_datetime', data.start_datetime);
    formData.append('end_datetime', data.end_datetime);
    formData.append('capacity', data.capacity.toString());
    
    if (data.registration_url) {
      formData.append('registration_url', data.registration_url);
    }
    
    if (data.status) {
      formData.append('status', data.status);
    }
    
    formData.append('is_featured', data.is_featured ? 'true' : 'false');
    
    // Handle image upload
    if (data.image && data.image instanceof File) {
      formData.append('image', data.image);
    }
    
    return apiService.put<Event>(`${basePath}/${slug}/`, formData);
  },

  /**
   * Delete an event (soft delete)
   */
  async delete(slug: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${basePath}/${slug}/`);
  },

  /**
   * Publish an event
   */
  async publish(slug: string): Promise<ApiResponse<Event>> {
    return apiService.post<Event>(`${basePath}/${slug}/publish/`, {});
  },

  /**
   * Set event to draft
   */
  async setToDraft(slug: string): Promise<ApiResponse<Event>> {
    return apiService.post<Event>(`${basePath}/${slug}/set_to_draft/`, {});
  },

  /**
   * Archive an event
   */
  async archive(slug: string): Promise<ApiResponse<Event>> {
    return apiService.post<Event>(`${basePath}/${slug}/archive/`, {});
  },

  /**
   * Get upcoming events
   */
  async getUpcoming(): Promise<ApiResponse<Event[]>> {
    return apiService.get<Event[]>(`${basePath}/upcoming/`);
  },

  /**
   * Get featured events
   */
  async getFeatured(): Promise<ApiResponse<Event[]>> {
    return apiService.get<Event[]>(`${basePath}/featured/`);
  },
};

export default eventsService;
