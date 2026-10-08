import { useParams, Link, Navigate, useNavigate } from 'react-router';
import PageMeta from '@/components/common/PageMeta';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import EnrollmentForm from '@/components/trainings/EnrollmentForm';
import { useApi } from '@/hooks/useApi';
import type { Training } from '@/types/content.types';
import { Tag, Clock, BarChart, Zap, Lock } from 'lucide-react';

export default function EnrollTraining() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: training, isLoading, error } = useApi<Training | null>(
    `/trainings/${slug}/`,
    { defaultValue: null }
  );

  if (isLoading) {
    return (
      <>
        <PublicNavbar />
        <div className="flex min-h-screen items-center justify-center pt-20">
          <div className="text-center">
            <div className="mb-4 inline-block size-12 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>
        </div>
      </>
    );
  }

  if (!training || error) {
    return <Navigate to="/trainings" replace />;
  }

  return (
    <>
      <PageMeta
        title={`Inscription - ${training.title} - Ascendys Connect`}
        description={`Inscrivez-vous à la formation ${training.title}`}
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicNavbar />

        <main className="bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
          {/* Breadcrumb */}
          <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Link to="/" className="hover:text-brand-600 transition-colors">
                  Accueil
                </Link>
                <span>/</span>
                <Link to="/trainings" className="hover:text-brand-600 transition-colors">
                  Formations
                </Link>
                <span>/</span>
                <Link 
                  to={`/trainings/${slug}`} 
                  className="hover:text-brand-600 transition-colors truncate max-w-xs"
                >
                  {training.title}
                </Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">Inscription</span>
              </div>
            </div>
          </div>

          {/* Layout 2 colonnes */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* Colonne gauche - Formulaire (3/5 width) */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Inscription à la formation
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Remplissez vos informations pour vous inscrire
                  </p>
                  
                  <EnrollmentForm 
                    trainingId={training.id}
                    trainingTitle={training.title}
                    onSuccess={(id) => navigate(`/payment/${id}`)}
                  />
                </div>
              </div>
              
              {/* Colonne droite - Résumé (2/5 width) */}
              <div className="lg:col-span-2">
                <div className="sticky top-24">
                  <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    {/* Image */}
                    {training.image && (
                      <img 
                        src={training.image} 
                        alt={training.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    
                    {/* Contenu */}
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {training.title}
                      </h2>
                      
                      {/* Méta info */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Tag className="size-4 text-brand-600 flex-shrink-0" />
                          <span>{training.category_name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="size-4 text-brand-600 flex-shrink-0" />
                          <span>{training.duration}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <BarChart className="size-4 text-brand-600 flex-shrink-0" />
                          <span>{training.level_display || training.level}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Zap className="size-4 text-brand-600 flex-shrink-0" />
                          <span>{training.mode_display || training.training_mode}</span>
                        </div>
                      </div>
                      
                      {/* Prix */}
                      <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Prix total
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          {training.price}
                        </div>
                      </div>
                      
                      {/* Badge sécurité */}
                      <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Lock className="size-4 flex-shrink-0" />
                        <span>Paiement sécurisé via FedaPay</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </main>

        <PublicFooter />
        <WhatsAppButton />
      </div>
    </>
  );
}
