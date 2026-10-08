/**
 * Page de détail d'un événement
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { eventsService } from '@/services/events.service';
import type { Event } from '@/types/content.types';
import PublicNavbar from '@/components/public/PublicNavbar';
import PageMeta from '@/components/common/PageMeta';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowLeft, 
  ExternalLink,
  Clock
} from 'lucide-react';

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      navigate('/blog');
      return;
    }
    
    loadEvent();
  }, [slug]);

  const loadEvent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data: any = await eventsService.getBySlug(slug!);
      // Handle both wrapped and unwrapped responses
      const event = data?.data || data;
      setEvent(event);
    } catch (err: any) {
      console.error('Erreur chargement événement:', err);
      setError('Événement introuvable');
      setTimeout(() => navigate('/blog'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      CONFERENCE: 'bg-blue-500',
      WORKSHOP: 'bg-green-500',
      WEBINAR: 'bg-purple-500',
      TRAINING: 'bg-orange-500',
      SALON: 'bg-pink-500',
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

  if (error || !event) {
    return (
      <>
        <PublicNavbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {error || 'Événement introuvable'}
            </h1>
            <button
              onClick={() => navigate('/blog')}
              className="mt-4 text-[#9800BF] hover:text-[#7a0099]"
            >
              Retour aux événements
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`${event.title} | Événements Ascendys Connect`}
        description={event.description.substring(0, 160)}
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
              Événements
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {event.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section with Image Overlay */}
      <div className="relative h-[400px] w-full overflow-hidden bg-gradient-to-br from-[#9800BF] to-[#7a0099]">
        {event.image && (
          <>
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <span className={`inline-block rounded-full ${getEventTypeColor(event.event_type)} px-4 py-1 text-sm font-semibold text-white`}>
              {event.type_display || event.event_type}
            </span>
            <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
              {/* Main Content */}
              <div>
                {/* Event Details Card */}
                <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-1 size-5 flex-shrink-0 text-[#9800BF]" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Date et heure</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Début : {formatDateTime(event.start_datetime)}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Fin : {formatDateTime(event.end_datetime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 size-5 flex-shrink-0 text-[#9800BF]" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Lieu</p>
                        <p className="text-gray-600 dark:text-gray-400">{event.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="mt-1 size-5 flex-shrink-0 text-[#9800BF]" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Capacité</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {event.capacity} participants maximum
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <h2 className="mb-4 text-2xl font-bold text-[#9800BF]">
                    À propos de l'événement
                  </h2>
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-[#9800BF] prose-a:text-[#9800BF]"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                </div>

                {/* Back Button */}
                <div className="mt-8">
                  <button
                    onClick={() => navigate('/blog')}
                    className="flex items-center gap-2 text-[#9800BF] hover:text-[#7a0099]"
                  >
                    <ArrowLeft className="size-4" />
                    Retour aux événements
                  </button>
                </div>
              </div>

              {/* Sidebar - Registration CTA */}
              <div className="lg:sticky lg:top-4 lg:h-fit">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Inscription
                  </h3>

                  {/* Event Status */}
                  <div className="mb-6 space-y-2">
                    {event.is_upcoming && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Clock className="size-4" />
                        <span className="text-sm font-medium">Événement à venir</span>
                      </div>
                    )}
                    {event.is_ongoing && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Clock className="size-4" />
                        <span className="text-sm font-medium">Événement en cours</span>
                      </div>
                    )}
                  </div>

                  {/* Registration Button or Capacity Info */}
                  {event.registration_url ? (
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#9800BF] px-6 py-3 font-medium text-white transition hover:bg-[#7a0099]"
                    >
                      S'inscrire
                      <ExternalLink className="size-4" />
                    </a>
                  ) : (
                    <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
                      <Users className="mx-auto mb-2 size-8 text-[#9800BF]" />
                      <p className="font-medium text-gray-900 dark:text-white">
                        Places limitées
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event.capacity} participants max
                      </p>
                    </div>
                  )}

                  {/* Event Info */}
                  <div className="mt-6 space-y-3 border-t border-gray-200 pt-6 text-sm dark:border-gray-800">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {event.type_display || event.event_type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Date</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDate(event.start_datetime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Statut</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {event.status_display || event.status}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-6 rounded-lg bg-[#FFC000]/10 p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Besoin de plus d'informations ?
                    </p>
                    <Link
                      to="/contact"
                      className="mt-2 inline-block text-sm font-medium text-[#9800BF] hover:underline"
                    >
                      Contactez-nous
                    </Link>
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
