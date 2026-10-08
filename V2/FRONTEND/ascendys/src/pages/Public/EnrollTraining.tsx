import { useParams, Link, Navigate, useNavigate } from 'react-router';
import PageMeta from '@/components/common/PageMeta';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import EnrollmentForm from '@/components/trainings/EnrollmentForm';
import { useApi } from '@/hooks/useApi';
import type { Training } from '@/types/content.types';
import { ArrowLeft } from 'lucide-react';

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

        <main className="pt-20">
          {/* Hero Section */}
          <section
            className="py-16"
            style={{
              background: 'linear-gradient(135deg, #0d0025 0%, #1a0050 40%, #9800BF 100%)',
            }}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Lien retour */}
              <Link
                to={`/trainings/${slug}`}
                className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
              >
                <ArrowLeft size={16} />
                Retour à la formation
              </Link>

              {/* Breadcrumb */}
              <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/60">
                <Link to="/" className="hover:text-white">
                  Accueil
                </Link>
                <span>/</span>
                <Link to="/trainings" className="hover:text-white">
                  Formations
                </Link>
                <span>/</span>
                <Link to={`/trainings/${slug}`} className="hover:text-white">
                  {training.title}
                </Link>
                <span>/</span>
                <span className="text-white">Inscription</span>
              </div>

              {/* Titre */}
              <h1 className="mb-4 text-3xl font-extrabold text-white md:text-4xl">
                Inscription à {training.title}
              </h1>

              {/* Prix */}
              <div className="text-2xl font-bold" style={{ color: '#FFC000' }}>
                {training.price}
              </div>
            </div>
          </section>

          {/* Section Formulaire */}
          <section className="bg-gray-50 py-16 dark:bg-gray-950">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900">
                <EnrollmentForm
                  trainingId={training.id}
                  trainingTitle={training.title}
                  onSuccess={(id) => navigate(`/payment/${id}`)}
                />
              </div>
            </div>
          </section>
        </main>

        <PublicFooter />
        <WhatsAppButton />
      </div>
    </>
  );
}
