import { Link } from "react-router";
import { useApi } from "@/hooks/useApi";
import type { Offer } from "@/services/offers.service";

export default function JobOffersSection() {
  const { data, isLoading, error } = useApi<Offer[]>(
    "/offers/?status=PUBLISHED&page_size=6",
    { defaultValue: [] }
  );

  // Helper for media URL
  const getMediaUrl = (path: string | null | undefined, fallback: string) => {
    if (!path) return fallback;
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `http://127.0.0.1:8000${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="border-t border-gray-200 bg-gray-50 py-16 dark:border-gray-800 dark:bg-gray-900 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            💼 Offres d'Emploi & Stages
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Découvrez nos opportunités professionnelles actuelles
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
              Impossible de charger les offres
            </p>
          </div>
        )}

        {/* Job Offers Grid */}
        {!isLoading && !error && data.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((offer) => (
              <article
                key={offer.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl dark:border-gray-800 dark:bg-gray-950"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <img
                    src={getMediaUrl(
                      offer.image,
                      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop"
                    )}
                    alt={offer.title}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Active Badge */}
                  {offer.is_active && (
                    <div className="absolute right-4 top-4">
                      <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                        Actif
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Type */}
                  <div className="mb-3">
                    <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-600 dark:bg-accent-950/30 dark:text-accent-400">
                      {offer.type_display}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                    <Link to={`/offers/${offer.slug}`}>{offer.title}</Link>
                  </h3>

                  {/* Description */}
                  <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                    {offer.short_description}
                  </p>

                  {/* Dates */}
                  {(offer.start_date || offer.end_date) && (
                    <div className="mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {offer.start_date && formatDate(offer.start_date)}
                        {offer.start_date && offer.end_date && " - "}
                        {offer.end_date && formatDate(offer.end_date)}
                      </span>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
                    <Link
                      to={`/offers/${offer.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      Voir les détails
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
              Aucune offre disponible pour le moment
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
