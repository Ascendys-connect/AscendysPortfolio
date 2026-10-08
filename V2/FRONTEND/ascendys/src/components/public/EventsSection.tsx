import { useState, useEffect } from "react";
import { Link } from "react-router";
import { apiService } from "@/services/api.service";
import type { Event } from "@/types/content.types";

export default function EventsSection() {
  const [data, setData] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiService.get<Event[]>(
          "/events/?status=PUBLISHED&page_size=6"
        );

        // Handle ApiResponse<Event[]> which has structure { success, message, data: Event[] }
        if (response && response.data) {
          setData(Array.isArray(response.data) ? response.data : []);
        } else {
          setData([]);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Helper for media URL
  const getMediaUrl = (path: string | null | undefined, fallback: string) => {
    if (!path) return fallback;
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `http://127.0.0.1:8000${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // Helper to format datetime
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="border-t border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-950 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            📅 Événements à Venir
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Participez à nos prochains événements et webinaires
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="aspect-[16/9] animate-pulse bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-4 p-6">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="py-12 text-center">
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Impossible de charger les événements
            </p>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && !error && data.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((event) => (
              <article
                key={event.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl dark:border-gray-800 dark:bg-gray-950"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <img
                    src={getMediaUrl(
                      event.image,
                      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop"
                    )}
                    alt={event.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Event Type */}
                  <div className="mb-3">
                    <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
                      {event.type_display || event.event_type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                    <Link to={`/events/${event.slug}`}>{event.title}</Link>
                  </h3>

                  {/* Location */}
                  <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="size-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="line-clamp-1">{event.location}</span>
                  </div>

                  {/* Dates */}
                  <div className="mb-3 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <svg
                        className="size-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        Début: {formatDateTime(event.start_datetime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="size-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Fin: {formatDateTime(event.end_datetime)}</span>
                    </div>
                  </div>

                  {/* Capacity */}
                  {event.capacity > 0 && (
                    <div className="mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <svg
                        className="size-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>Places: {event.capacity}</span>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
                    <Link
                      to={`/events/${event.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      En savoir plus
                      <svg
                        className="size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && data.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Aucun événement prévu pour le moment
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
