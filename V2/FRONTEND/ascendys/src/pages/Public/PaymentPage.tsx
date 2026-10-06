/**
 * Page de paiement avec récapitulatif et intégration FedaPay
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { enrollmentsService } from '@/services/enrollments.service';
import type { Enrollment } from '@/types/enrollment.types';
import { ENROLLMENT_STATUS_COLORS } from '@/types/enrollment.types';
import PageMeta from '@/components/common/PageMeta';

export default function PaymentPage() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const navigate = useNavigate();
  
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enrollmentId) {
      navigate('/');
      return;
    }
    
    loadEnrollment();
  }, [enrollmentId]);

  const loadEnrollment = async () => {
    try {
      setIsLoading(true);
      const data = await enrollmentsService.get(enrollmentId!);
      setEnrollment(data);
      
      // Si déjà payé, rediriger vers la page de succès
      if (data.status === 'PAID') {
        navigate(`/payment/success?id=${enrollmentId}`);
      }
      
    } catch (err: any) {
      console.error('Erreur chargement inscription:', err);
      setError('Impossible de charger les détails de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!enrollment) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      
      // Initier le paiement
      const paymentData = await enrollmentsService.initiatePayment(enrollment.id);
      
      // Rediriger vers FedaPay
      window.location.href = paymentData.checkout_url;
      
    } catch (err: any) {
      console.error('Erreur paiement:', err);
      setError(
        err.response?.data?.message || 
        'Une erreur est survenue lors de l\'initialisation du paiement'
      );
      setIsProcessing(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!enrollment) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      
      // Réessayer le paiement
      const paymentData = await enrollmentsService.retryPayment(enrollment.id);
      
      // Rediriger vers FedaPay
      window.location.href = paymentData.checkout_url;
      
    } catch (err: any) {
      console.error('Erreur réessai paiement:', err);
      setError(
        err.response?.data?.message || 
        'Une erreur est survenue lors du réessai du paiement'
      );
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500" />
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inscription introuvable
          </h1>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-brand-500 hover:text-brand-600"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const isExpired = enrollment.is_expired;
  const canPay = enrollment.can_retry_payment;

  return (
    <>
      <PageMeta
        title={`Paiement - ${enrollment.training_title} | Ascendys Connect`}
        description="Finalisez votre inscription"
      />

      <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-3xl px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Finaliser votre inscription
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Récapitulatif et paiement
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Carte récapitulatif */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {/* Statut */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Statut
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ENROLLMENT_STATUS_COLORS[enrollment.status]}`}>
                {enrollment.status_display}
              </span>
            </div>

            {/* Formation */}
            <div className="mb-6">
              <h2 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Formation
              </h2>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {enrollment.training_title}
              </p>
            </div>

            {/* Informations personnelles */}
            <div className="mb-6 space-y-3 border-t border-gray-200 pt-6 dark:border-gray-800">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                Vos informations
              </h3>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Nom complet</span>
                <span className="font-medium text-gray-900 dark:text-white">{enrollment.full_name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email</span>
                <span className="font-medium text-gray-900 dark:text-white">{enrollment.email}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Téléphone</span>
                <span className="font-medium text-gray-900 dark:text-white">{enrollment.phone}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Niveau d'études</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {enrollment.education_level_display}
                  {enrollment.education_level_other && ` (${enrollment.education_level_other})`}
                </span>
              </div>
            </div>

            {/* Prix */}
            <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Montant à payer
                </span>
                <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                  {parseFloat(enrollment.amount).toLocaleString('fr-FR')} {enrollment.currency}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              {isExpired ? (
                <div className="rounded-lg bg-orange-50 p-4 text-center dark:bg-orange-900/30">
                  <p className="text-sm text-orange-800 dark:text-orange-400">
                    Cette inscription a expiré. Veuillez créer une nouvelle inscription.
                  </p>
                  <button
                    onClick={() => navigate('/formations')}
                    className="mt-3 text-sm font-medium text-brand-500 hover:text-brand-600"
                  >
                    Retour aux formations
                  </button>
                </div>
              ) : enrollment.status === 'FAILED' || enrollment.status === 'PENDING' ? (
                <button
                  onClick={enrollment.status === 'FAILED' ? handleRetryPayment : handlePayment}
                  disabled={isProcessing || !canPay}
                  className="w-full rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Redirection...
                    </span>
                  ) : (
                    enrollment.status === 'FAILED' ? 'Réessayer le paiement' : 'Payer maintenant'
                  )}
                </button>
              ) : enrollment.status === 'PROCESSING' ? (
                <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/30">
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    Paiement en cours... Veuillez finaliser le paiement sur FedaPay.
                  </p>
                </div>
              ) : null}

              <button
                onClick={() => navigate('/')}
                className="w-full rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Retour à l'accueil
              </button>
            </div>

            {/* Infos tentatives */}
            {enrollment.payment_attempts > 0 && (
              <p className="mt-4 text-center text-xs text-gray-500">
                Tentative(s) de paiement : {enrollment.payment_attempts}
              </p>
            )}
          </div>

          {/* Note sécurité */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>🔒 Paiement sécurisé via FedaPay</p>
          </div>
        </div>
      </div>
    </>
  );
}
