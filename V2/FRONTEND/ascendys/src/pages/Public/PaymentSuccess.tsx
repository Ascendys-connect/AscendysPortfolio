/**
 * Page de confirmation de paiement réussi
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { enrollmentsService } from '@/services/enrollments.service';
import type { Enrollment } from '@/types/enrollment.types';
import PageMeta from '@/components/common/PageMeta';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const enrollmentId = searchParams.get('id');
  
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500" />
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Paiement réussi | Ascendys Connect"
        description="Votre inscription a été confirmée avec succès"
      />

      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <div className="w-full max-w-md text-center">
          {/* Icône de succès */}
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="size-10 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Titre */}
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Paiement réussi !
          </h1>

          {/* Message */}
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Votre inscription a été confirmée avec succès.
            {enrollment && (
              <>
                <br />
                <span className="mt-2 inline-block font-semibold text-brand-600 dark:text-brand-400">
                  {enrollment.training_title}
                </span>
              </>
            )}
          </p>

          {/* Détails */}
          {enrollment && (
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 text-left dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Récapitulatif
              </h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Nom</span>
                  <span className="font-medium text-gray-900 dark:text-white">{enrollment.full_name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email</span>
                  <span className="font-medium text-gray-900 dark:text-white">{enrollment.email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Montant payé</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {parseFloat(enrollment.amount).toLocaleString('fr-FR')} {enrollment.currency}
                  </span>
                </div>
                
                {enrollment.payment_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
                    <span className="truncate font-mono text-xs text-gray-900 dark:text-white">
                      {enrollment.payment_id}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Prochaines étapes */}
          <div className="mb-8 rounded-lg bg-blue-50 p-4 text-left dark:bg-blue-900/30">
            <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
              📧 Prochaines étapes
            </h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
              <li>• Vous recevrez un email de confirmation</li>
              <li>• Les détails d'accès à la formation vous seront envoyés prochainement</li>
              <li>• Consultez votre boîte de réception ({enrollment?.email})</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Retour à l'accueil
            </button>
            
            <button
              onClick={() => navigate('/formations')}
              className="w-full rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Découvrir d'autres formations
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
