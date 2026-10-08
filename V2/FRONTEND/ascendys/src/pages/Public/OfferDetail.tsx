/**
 * Page de détail d'une offre d'emploi
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { offersService } from '@/services/offers.service';
import type { Offer } from '@/services/offers.service';
import PublicNavbar from '@/components/public/PublicNavbar';
import PageMeta from '@/components/common/PageMeta';
import { 
  Calendar, 
  ArrowLeft, 
  Briefcase,
  Clock,
  CheckCircle2,
  Mail
} from 'lucide-react';

export default function OfferDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      navigate('/blog');
      return;
    }
    
    loadOffer();
  }, [slug]);

  const loadOffer = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data: any = await offersService.getBySlug(slug!);
      // Handle both wrapped and unwrapped responses
      const offer = data?.data || data;
      setOffer(offer);
    } catch (err: any) {
      console.error('Erreur chargement offre:', err);
      setError('Offre introuvable');
      setTimeout(() => navigate('/blog'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      JOB: 'bg-blue-500',
      INTERNSHIP: 'bg-green-500',
      TRAINING: 'bg-purple-500',
      PARTNERSHIP: 'bg-orange-500',
      TENDER: 'bg-red-500',
      OTHER: 'bg-gray-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <>
        <PublicNavbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="size-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#9800BF]" />
        </div>
      </>
    );
  }

  if (error || !offer) {
    return (
      <>
        <PublicNavbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {error || 'Offre introuvable'}
            </h1>
            <button
              onClick={() => navigate('/blog')}
              className="mt-4 text-[#9800BF] hover:text-[#7a0099]"
            >
              Retour aux offres
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`${offer.title} | Offres Ascendys Connect`}
        description={offer.short_description}
      />
      
      <PublicNavbar />

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-gray-50 py-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-[#9800BF] dark:text-gray-400">
              Accueil
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/blog" className="text-gray-600 hover:text-[#9800BF] dark:text-gray-400">
              Offres
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {offer.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden bg-gradient-to-br from-[#9800BF] to-[#7a0099]">
        {offer.banner || offer.image ? (
          <>
            <img
              src={offer.banner || offer.image}
              alt={offer.title}
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <span className={`inline-block rounded-full ${getTypeColor(offer.type)} px-4 py-1 text-sm font-semibold text-white`}>
              {offer.type_display}
            </span>
            <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
              {offer.title}
            </h1>
            {offer.is_active && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <CheckCircle2 className="size-5 text-[#FFC000]" />
                <span className="text-[#FFC000] font-medium">Offre active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
              {/* Main Content */}
              <div>
                {/* Short Description */}
                <div className="mb-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
                  <p className="text-lg font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                    {offer.short_description}
                  </p>
                </div>

                {/* Offer Details */}
                <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <Briefcase className="mt-1 size-5 flex-shrink-0 text-[#9800BF]" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Type</p>
                        <p className="text-gray-600 dark:text-gray-400">{offer.type_display}</p>
                      </div>
                    </div>

                    {offer.start_date && (
                      <div className="flex items-start gap-3">
                        <Calendar className="mt-1 size-5 flex-shrink-0 text-[#9800BF]" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Date de début</p>
                          <p className="text-gray-600 dark:text-gray-400">{formatDate(offer.start_date)}</p>
                        </div>
                      </div>
                    )}

                    {offer.end_date && (
                      <div className="flex items-start gap-3">
                        <Clock className="mt-1 size-5 flex-shrink-0 text-[#9800BF]" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Date limite</p>
                          <p className="text-gray-600 dark:text-gray-400">{formatDate(offer.end_date)}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 size-5 flex-shrink-0 text-[#9800BF]" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Statut</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {offer.is_active ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Description */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <h2 className="mb-4 text-2xl font-bold text-[#9800BF]">
                    Description détaillée
                  </h2>
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-[#9800BF] prose-a:text-[#9800BF]"
                    dangerouslySetInnerHTML={{ __html: offer.description }}
                  />
                </div>

                {/* Back Button */}
                <div className="mt-8">
                  <button
                    onClick={() => navigate('/blog')}
                    className="flex items-center gap-2 text-[#9800BF] hover:text-[#7a0099]"
                  >
                    <ArrowLeft className="size-4" />
                    Retour aux offres
                  </button>
                </div>
              </div>

              {/* Sidebar - Application CTA */}
              <div className="lg:sticky lg:top-4 lg:h-fit">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Postuler
                  </h3>

                  {/* Application Button */}
                  <Link
                    to="/contact"
                    state={{ subject: `Candidature: ${offer.title}`, offerTitle: offer.title }}
                    className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#9800BF] px-6 py-3 font-medium text-white transition hover:bg-[#7a0099]"
                  >
                    <Mail className="size-4" />
                    Postuler maintenant
                  </Link>

                  {/* Offer Summary */}
                  <div className="space-y-3 border-t border-gray-200 pt-6 text-sm dark:border-gray-800">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {offer.type_display}
                      </span>
                    </div>
                    
                    {offer.start_date && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Début</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDate(offer.start_date)}
                        </span>
                      </div>
                    )}

                    {offer.end_date && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Date limite</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDate(offer.end_date)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Statut</span>
                      <span className={`font-medium ${offer.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                        {offer.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {offer.created_by_name && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Publié par</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {offer.created_by_name}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Date de publication</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDate(offer.published_at || offer.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {offer.is_featured && (
                    <div className="mt-6 rounded-lg bg-[#FFC000]/10 p-4 text-center">
                      <p className="font-semibold text-[#9800BF]">Offre en vedette</p>
                    </div>
                  )}

                  {/* Help Text */}
                  <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      En postulant, vous serez redirigé vers notre formulaire de contact. 
                      Merci de mentionner le titre de l'offre dans votre message.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
