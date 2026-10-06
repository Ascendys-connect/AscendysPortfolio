/**
 * Carte de formation avec bouton d'inscription
 */

import { useNavigate } from 'react-router';

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
}

interface TrainingCardProps {
  training: Training;
  showEnrollButton?: boolean;
}

export default function TrainingCard({ training, showEnrollButton = true }: TrainingCardProps) {
  const navigate = useNavigate();

  const handleEnroll = () => {
    navigate(`/enroll?training=${training.slug}`);
  };

  const handleViewDetails = () => {
    navigate(`/formations/${training.slug}`);
  };

  return (
    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
        {training.image ? (
          <img
            src={training.image}
            alt={training.title}
            className="size-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-gray-400">
            <svg className="size-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}
        
        {/* Badge catégorie */}
        {training.category_name && (
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
              {training.category_name}
            </span>
          </div>
        )}
        
        {/* Badge niveau */}
        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm dark:bg-gray-800/90 dark:text-white">
            {training.level_display}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        {/* Titre */}
        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">
          {training.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {training.short_description}
        </p>

        {/* Métadonnées */}
        <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{training.duration}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{new Date(training.start_date).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        {/* Prix */}
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
            {parseFloat(training.price).toLocaleString('fr-FR')}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {training.currency}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {showEnrollButton && (
            <button
              onClick={handleEnroll}
              className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              S'inscrire
            </button>
          )}
          
          <button
            onClick={handleViewDetails}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Détails
          </button>
        </div>
      </div>
    </div>
  );
}
