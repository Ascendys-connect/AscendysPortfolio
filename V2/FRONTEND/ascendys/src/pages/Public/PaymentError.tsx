/**
 * Page d'erreur de paiement
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { enrollmentsService } from '@/services/enrollments.service';
import type { Enrollment } from '@/types/enrollment.types';
import PageMeta from '@/components/common/PageMeta';

export default function PaymentError() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const enrollmentId = searchParams.get('id');
  const reason = searchParams.get('reason');
  
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!enrollmentId) {
      navigate('/');
      return;
    }
    
    loadEnrollment();
  }, [enrollmentId]);

  const loadEnrollment = async () => {
    try {
      const data = await enrollmentsService.get(enrollmentId!);
      setEnrollment(data);
    } catch (err) {
      console.error('Erreur chargement inscription:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (enrollmentId) {
      navigate(`/payment/${enrollmentId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500" />
      </div>
    );
  }

  const canRetry = enrollment?.can_retry_payment;

  return (
    <>
      <PageMeta
        title="Erreur de paiement | Ascendys Connect"
        description="Une erreur est survenue lors du paiement"
      />

      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <div className="w-full max-w-md text-center">
          {/* Icône d'erreur */}
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <svg
              className="size-10 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          {/* Titre */}
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            {enrollment?.status === 'CANCELLED' ? 'Paiement annulé' : 'Échec du paiement'}
          </h1>

          {/* Message */}
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            {enrollment?.status === 'CANCELLED' 
              ? 'Vous avez annulé le paiement.'
              : 'Une erreur est survenue lors du traitement de votre paiement.'
            }
            {reason && (
              <>
                <br />
                <span className="mt-2 inline-block text-sm text-red-600 dark:text-red-400">
                  Raison: {reason}
                </span>
              </>
            )}
          </p>

          {/* Détails inscription */}
          {enrollment && (
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 text-left dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Détails de l'inscription
              </h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Formation</span>
                  <span className="font-medium text-gray-900 dark:text-white">{enrollment.training_title}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Montant</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {parseFloat(enrollment.amount).toLocaleString('fr-FR')} {enrollment.currency}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Statut</span>
                  <span className="text-red-600 dark:text-red-400">{enrollment.status_display}</span>
                </div>
              </div>
            </div>
          )}

          {/* Aide */}
          <div className="mb-8 rounded-lg bg-yellow-50 p-4 text-left dark:bg-yellow-900/30">
            <h3 className="mb-2 font-semibold text-yellow-900 dark:text-yellow-100">
              💡 Que faire ?
            </h3>
            <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
              {canRetry && <li>• Vous pouvez réessayer le paiement</li>}
              <li>• Vérifiez votre connexion internet</li>
              <li>• Assurez-vous d'avoir suffisamment de fonds</li>
              <li>• Contactez votre banque si le problème persiste</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {canRetry && (
              <button
                onClick={handleRetry}
                className="w-full rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
              >
                Réessayer le paiement
              </button>
            )}
            
            <button
              onClick={() => navigate('/')}
              className="w-full rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Retour à l'accueil
            </button>
          </div>

          {/* Support */}
          <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            <p>Besoin d'aide ?</p>
            <a
              href="mailto:support@ascendysconnect.com"
              className="mt-1 inline-block font-medium text-brand-500 hover:text-brand-600"
            >
              Contactez notre support
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
