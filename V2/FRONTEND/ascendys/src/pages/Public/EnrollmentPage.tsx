/**
 * Page d'inscription à une formation
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import EnrollmentForm from '@/components/trainings/EnrollmentForm';
import PageMeta from '@/components/common/PageMeta';

export default function EnrollmentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const trainingSlug = searchParams.get('training');
  
  const [trainingData, setTrainingData] = useState<{ id: string; title: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (trainingSlug) {
      // Charger les détails de la formation depuis le slug
      loadTraining(trainingSlug);
    } else {
      setIsLoading(false);
    }
  }, [trainingSlug]);

  const loadTraining = async (slug: string) => {
    try {
      // TODO: Appeler l'API pour récupérer la formation par slug
      // Pour l'instant, on simule
      const response = await fetch(`http://localhost:8000/api/v1/trainings/?slug=${slug}`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const training = data.results[0];
        setTrainingData({
          id: training.id,
          title: training.title
        });
      }
    } catch (err) {
      console.error('Erreur chargement formation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = (enrollmentId: string) => {
    navigate(`/payment/${enrollmentId}`);
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
        title={`Inscription ${trainingData ? `- ${trainingData.title}` : ''} | Ascendys Connect`}
        description="Inscrivez-vous à une formation"
      />

      <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-2xl px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Inscription à une formation
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Complétez le formulaire ci-dessous pour vous inscrire
            </p>
          </div>

          {/* Formulaire */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <EnrollmentForm
              trainingId={trainingData?.id}
              trainingTitle={trainingData?.title}
              onSuccess={handleSuccess}
            />
          </div>

          {/* Note sécurité */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>🔒 Vos données sont sécurisées et ne seront pas partagées</p>
          </div>
        </div>
      </div>
    </>
  );
}
