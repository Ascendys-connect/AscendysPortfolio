/**
 * Service pour gérer les inscriptions aux formations
 */

import { apiService } from './api.service';
import type { 
  Enrollment, 
  EnrollmentFormData, 
  PaymentResponse 
} from '@/types/enrollment.types';
import type { ApiResponse } from '@/types/api.types';

class EnrollmentsService {
  private baseURL = '/trainings/enrollments';

  /**
   * Créer une inscription (status = PENDING)
   */
  async create(data: EnrollmentFormData): Promise<Enrollment> {
    const response: any = await apiService.post<Enrollment>(
      `${this.baseURL}/`,
      data
    );
    // Handle both wrapped and unwrapped responses
    return response?.data || response;
  }

  /**
   * Récupérer une inscription par ID
   */
  async get(id: string): Promise<Enrollment> {
    const response: any = await apiService.get<Enrollment>(
      `${this.baseURL}/${id}/`
    );
    // Handle both wrapped and unwrapped responses
    return response?.data || response;
  }

  /**
   * Initier le paiement FedaPay
   */
  async initiatePayment(id: string): Promise<PaymentResponse> {
    const response: any = await apiService.post<PaymentResponse>(
      `${this.baseURL}/${id}/initiate-payment/`
    );
    // Handle both wrapped and unwrapped responses
    return response?.data || response;
  }

  /**
   * Réessayer le paiement
   */
  async retryPayment(id: string): Promise<PaymentResponse> {
    const response: any = await apiService.post<PaymentResponse>(
      `${this.baseURL}/${id}/retry-payment/`
    );
    // Handle both wrapped and unwrapped responses
    return response?.data || response;
  }

  /**
   * Lister les inscriptions avec filtres (training, status, search, etc.)
   */
  async list(params?: Record<string, any>): Promise<Enrollment[]> {
    const response: any = await apiService.get<Enrollment[]>(
      `${this.baseURL}/`,
      params
    );
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.results)) return response.results;
    if (Array.isArray(response?.data?.results)) return response.data.results;
    return [];
  }

  /**
   * Envoyer manuellement un email de relance
   */
  async sendReminder(id: string, stage: string = 'manual'): Promise<any> {
    const response: any = await apiService.post(
      `${this.baseURL}/${id}/send-reminder/`,
      { stage }
    );
    return response?.data || response;
  }

  /**
   * Exécuter le scan automatique des relances (1h, 24h, 7j)
   */
  async processReminders(): Promise<any> {
    const response: any = await apiService.post(
      `${this.baseURL}/process-reminders/`
    );
    return response?.data || response;
  }
}

export const enrollmentsService = new EnrollmentsService();
export default enrollmentsService;
