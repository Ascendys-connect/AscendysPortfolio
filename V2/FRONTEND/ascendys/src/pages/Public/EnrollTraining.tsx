import { useParams, Link, Navigate, useNavigate } from 'react-router';
import PageMeta from '@/components/common/PageMeta';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import EnrollmentForm from '@/components/trainings/EnrollmentForm';
import { useApi } from '@/hooks/useApi';
import type { Training } from '@/types/content.types';
import {
  Tag,
  Clock,
  BarChart,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Calendar,
  Users,
} from 'lucide-react';

const levelLabel: Record<string, string> = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
};
const modeLabel: Record<string, string> = {
  ONLINE: 'En ligne',
  ONSITE: 'Présentiel',
  HYBRID: 'Hybride',
};

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
        <div className="flex min-h-screen items-center justify-center pt-20 bg-gray-50 dark:bg-gray-950">
          <div className="text-center">
            <div className="mb-4 inline-block size-12 animate-spin rounded-full border-4 border-solid border-[#9800BF] border-r-transparent" />
            <p className="text-gray-500 dark:text-gray-400">Chargement de la formation...</p>
          </div>
        </div>
      </>
    );
  }

  if (!training || error) {
    return <Navigate to="/trainings" replace />;
  }

  const formattedPrice = training.price
    ? `${parseInt(training.price).toLocaleString('fr-FR')} ${training.currency || 'XOF'}`
    : null;

  const startDate = training.start_date
    ? new Date(training.start_date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <>
      <PageMeta
        title={`Inscription — ${training.title} | Ascendys Connect`}
        description={`Inscrivez-vous à la formation ${training.title} chez Ascendys Connect.`}
      />

      <div className="min-h-screen bg-[#f8f6ff] dark:bg-gray-950">
        <PublicNavbar />

        {/* Hero band */}
        <div
          className="relative overflow-hidden pt-16 md:pt-[72px]"
          style={{
            background: 'linear-gradient(135deg, #1a0033 0%, #2d0057 50%, #9800BF 100%)',
          }}
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 size-48 rounded-full bg-[#FFC000]/10 blur-2xl" />

          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/50">
              <Link to="/" className="hover:text-white/80 transition-colors">Accueil</Link>
              <ChevronRight className="size-3" />
              <Link to="/trainings" className="hover:text-white/80 transition-colors">Formations</Link>
              <ChevronRight className="size-3" />
              <Link to={`/trainings/${slug}`} className="hover:text-white/80 transition-colors truncate max-w-[180px]">
                {training.title}
              </Link>
              <ChevronRight className="size-3" />
              <span className="text-white/80">Inscription</span>
            </nav>

            <div className="flex flex-col gap-2">
              {training.category_name && (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#FFC000]">
                  <Tag className="size-3" />
                  {training.category_name}
                </span>
              )}
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                {training.title}
              </h1>
              {training.short_description && (
                <p className="max-w-2xl text-sm text-white/70 leading-relaxed">
                  {training.short_description}
                </p>
              )}

              {/* Meta pills */}
              <div className="mt-3 flex flex-wrap gap-3">
                {training.duration && (
                  <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    <Clock className="size-3.5 text-[#FFC000]" />
                    {training.duration}
                  </div>
                )}
                {training.training_mode && (
                  <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    <MapPin className="size-3.5 text-[#FFC000]" />
                    {modeLabel[training.training_mode] ?? training.training_mode}
                  </div>
                )}
                {training.level && (
                  <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    <BarChart className="size-3.5 text-[#FFC000]" />
                    {levelLabel[training.level] ?? training.level}
                  </div>
                )}
                {startDate && (
                  <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    <Calendar className="size-3.5 text-[#FFC000]" />
                    Début : {startDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom wave */}
          <svg
            viewBox="0 0 1440 40"
            className="w-full"
            preserveAspectRatio="none"
            style={{ display: 'block', marginBottom: -1 }}
          >
            <path fill="#f8f6ff" d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" />
          </svg>
        </div>

        {/* Main content */}
        <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:-mt-4">

            {/* ── Formulaire (3/5) ── */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-purple-100 bg-white shadow-xl shadow-purple-100/30 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
                {/* Form header */}
                <div className="border-b border-gray-100 px-8 py-6 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#9800BF]/10">
                      <Users className="size-5 text-[#9800BF]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Vos informations
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Remplissez le formulaire pour finaliser votre inscription
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <EnrollmentForm
                    trainingId={training.id}
                    trainingTitle={training.title}
                    onSuccess={(id) => navigate(`/payment/${id}`)}
                  />
                </div>
              </div>
            </div>

            {/* ── Récapitulatif (2/5) ── */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-4">

                {/* Image + info card */}
                <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-xl shadow-purple-100/30 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
                  {training.image && (
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={training.image}
                        alt={training.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      {training.category_name && (
                        <span className="absolute bottom-3 left-3 rounded-full bg-[#9800BF] px-2.5 py-0.5 text-xs font-semibold text-white">
                          {training.category_name}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="mb-4 font-bold text-gray-900 dark:text-white">{training.title}</h3>

                    <div className="space-y-2.5 text-sm">
                      {training.duration && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Clock className="size-4 shrink-0 text-[#9800BF]" />
                          {training.duration}
                        </div>
                      )}
                      {training.training_mode && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="size-4 shrink-0 text-[#9800BF]" />
                          {modeLabel[training.training_mode] ?? training.training_mode}
                        </div>
                      )}
                      {training.level && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <BarChart className="size-4 shrink-0 text-[#9800BF]" />
                          {levelLabel[training.level] ?? training.level}
                        </div>
                      )}
                    </div>

                    {/* Prix */}
                    {formattedPrice && (
                      <div className="mt-5 rounded-xl bg-gradient-to-br from-[#9800BF]/10 to-[#FFC000]/10 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Investissement total
                        </div>
                        <div className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white">
                          {formattedPrice}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sécurité */}
                <div className="rounded-2xl border border-green-100 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-950/20">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="size-5 shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-green-800 dark:text-green-300">
                        Paiement 100% sécurisé
                      </div>
                      <div className="mt-0.5 text-xs text-green-700 dark:text-green-400">
                        Vos données sont protégées via FedaPay, leader du paiement en ligne en Afrique de l'Ouest.
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
