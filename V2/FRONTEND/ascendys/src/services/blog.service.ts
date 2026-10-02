/**
 * Blog Service
 * API calls for blog posts management
 */

import { apiService } from './api.service';
import type { BlogPost } from '@/types/content.types';

class BlogService {
  private readonly basePath = '/blog/posts';

  async getAll(): Promise<BlogPost[]> {
    return apiService.get<BlogPost[]>(`${this.basePath}/`);
  }

  async getById(id: string): Promise<BlogPost> {
    return apiService.get<BlogPost>(`${this.basePath}/${id}/`);
  }

  async create(data: FormData | any): Promise<BlogPost> {
    return apiService.post<BlogPost>(`${this.basePath}/`, data);
  }

  async update(id: string, data: FormData | any): Promise<BlogPost> {
    return apiService.put<BlogPost>(`${this.basePath}/${id}/`, data);
  }

  async delete(id: string): Promise<void> {
    return apiService.delete(`${this.basePath}/${id}/`);
  }

  /**
   * Publish a draft blog post
   */
  async publish(slug: string): Promise<BlogPost> {
    return apiService.post<BlogPost>(`${this.basePath}/${slug}/publish/`);
  }

  /**
   * Archive a published blog post
   */
  async archive(slug: string): Promise<BlogPost> {
    return apiService.post<BlogPost>(`${this.basePath}/${slug}/archive/`);
  }
}

export const blogService = new BlogService();
