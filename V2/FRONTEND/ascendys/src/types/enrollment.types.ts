/**
 * Types pour les inscriptions aux formations
 */

export type EducationLevel = 
  | 'PRIMARY' 
  | 'MIDDLE' 
  | 'HIGH' 
  | 'BACHELOR' 
  | 'MASTER' 
  | 'PHD' 
  | 'OTHER';

export type EnrollmentStatus = 
  | 'PENDING' 
  | 'PROCESSING' 
  | 'PAID' 
  | 'FAILED' 
  | 'CANCELLED' 
  | 'EXPIRED';

export interface Enrollment {
  id: string;
  training: string;
  training_title: string;
  training_slug: string;
  training_price: string;
  full_name: string;
  email: string;
  phone: string;
  education_level: EducationLevel;
  education_level_display: string;
  education_level_other?: string;
  status: EnrollmentStatus;
  status_display: string;
  amount: string;
  currency: string;
  payment_id?: string;
  payment_attempts: number;
  is_expired: boolean;
  can_retry_payment: boolean;
  reminder_1h_sent_at?: string;
  reminder_24h_sent_at?: string;
  reminder_7d_sent_at?: string;
  reminders_count?: number;
  expires_at?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EnrollmentFormData {
  training: string;
  full_name: string;
  email: string;
  phone: string;
  education_level: EducationLevel;
  education_level_other?: string;
}

export interface PaymentResponse {
  checkout_url: string;
  transaction_id: string;
  enrollment_id: string;
}

export const EDUCATION_LEVELS: { value: EducationLevel; label: string }[] = [
  { value: 'PRIMARY', label: 'Primaire' },
  { value: 'MIDDLE', label: 'Collège' },
  { value: 'HIGH', label: 'Lycée' },
  { value: 'BACHELOR', label: 'Licence' },
  { value: 'MASTER', label: 'Master' },
  { value: 'PHD', label: 'Doctorat' },
  { value: 'OTHER', label: 'Autre' },
];

export const ENROLLMENT_STATUS_COLORS: Record<EnrollmentStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  EXPIRED: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};
