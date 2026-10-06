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
  private baseURL = '/enrollments';

  /**
   * Créer une inscription (status = PENDING)
   */
  async create(data: EnrollmentFormData): Promise<Enrollment> {
    const response = await apiService.post<ApiResponse<Enrollment>>(
      `${this.baseURL}/`,
      data
    );
    return response.data!;
  }

  /**
   * Récupérer une inscription par ID
   */
  async get(id: string): Promise<Enrollment> {
    const response = await apiService.get<ApiResponse<Enrollment>>(
      `${this.baseURL}/${id}/`
    );
    return response.data!;
  }

  /**
   * Initier le paiement FedaPay
   */
  async initiatePayment(id: string): Promise<PaymentResponse> {
    const response = await apiService.post<ApiResponse<PaymentResponse>>(
      `${this.baseURL}/${id}/initiate-payment/`
    );
    return response.data!;
  }

  /**
   * Réessayer le paiement
   */
  async retryPayment(id: string): Promise<PaymentResponse> {
    const response = await apiService.post<ApiResponse<PaymentResponse>>(
      `${this.baseURL}/${id}/retry-payment/`
    );
    return response.data!;
  }
}

export const enrollmentsService = new EnrollmentsService();
export default enrollmentsService;
