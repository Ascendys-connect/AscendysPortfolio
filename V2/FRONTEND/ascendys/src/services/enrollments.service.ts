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
}

export const enrollmentsService = new EnrollmentsService();
export default enrollmentsService;
