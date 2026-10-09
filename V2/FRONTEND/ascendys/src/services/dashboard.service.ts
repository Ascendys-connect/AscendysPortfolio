/**
 * Dashboard Service
 * Handles dashboard statistics API calls
 */

import { apiService } from './api.service';

export interface EditorStats {
  draft_count: number;
  pending_count: number;
  published_count: number;
  total_count: number;
}

export interface EditorStatsResponse {
  success: boolean;
  message: string;
  data: EditorStats;
}

class DashboardService {
  private basePath = '/dashboard';

  /**
   * Get editor-specific statistics
   */
  async getEditorStats(): Promise<EditorStats> {
    const response = await apiService.get<EditorStatsResponse>(`${this.basePath}/editor-stats/`);
    return response.data;
  }
}

export const dashboardService = new DashboardService();
