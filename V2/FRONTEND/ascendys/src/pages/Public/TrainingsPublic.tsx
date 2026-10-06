/**
 * Page publique listant toutes les formations disponibles
 */

import { useState, useEffect } from 'react';
import TrainingCard from '@/components/trainings/TrainingCard';
import PageMeta from '@/components/common/PageMeta';

interface Training {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  image: string;
  price: string;
  currency: string;
  duration: string;
  level: string;
  level_display: string;
  training_mode: string;
  start_date: string;
  category_name?: string;
  status: string;
}

export default function TrainingsPublic() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/v1/trainings/?status=PUBLISHED');
      const data = await response.json();
      
      setTrainings(data.results || []);
    } catch (err) {
      console.error('Erreur chargement formations:', err);
      setError('Impossible de charger les formations');
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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadTrainings}
            className="mt-4 text-brand-500 hover:text-brand-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Nos Formations | Ascendys Connect"
        description="Découvrez toutes nos formations disponibles"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Nos Formations
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Découvrez toutes nos formations disponibles et inscrivez-vous dès maintenant
            </p>
          </div>
        </div>

        {/* Liste des formations */}
        <div className="mx-auto max-w-7xl px-4 py-12">
          {trainings.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
              <svg
                className="mx-auto size-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Aucune formation disponible
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Revenez bientôt pour découvrir nos nouvelles formations
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trainings.map(training => (
                <TrainingCard
                  key={training.id}
                  training={training}
                  showEnrollButton={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
