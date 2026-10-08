import { useApi } from "@/hooks/useApi";
import { Partner } from "@/types/content.types";

export default function PartnersSection() {
  // Fetch partners from API
  const { data: partners, isLoading, error } = useApi<Partner[]>(
    "/partners/?is_active=true&page_size=8",
    { defaultValue: [] }
  );

  // Helper for media URL
  const getMediaUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `http://127.0.0.1:8000/${path}`;
  };

  // If no partners or still loading, check if should hide section
  if (!isLoading && !error && partners.length === 0) {
    return null; // Hide section completely if no partners
  }

  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
            Nos Partenaires
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Ils nous font{" "}
            <span className="text-brand-600 dark:text-brand-400">confiance</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Nous collaborons avec les plus grandes entreprises technologiques
            pour vous offrir des formations certifiées et reconnues
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="h-12 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Impossible de charger les partenaires
            </p>
          </div>
        )}

        {/* Partners Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner, index) => {
              const logoUrl = getMediaUrl(partner.logo);
              const content = logoUrl ? (
                <img
                  src={logoUrl}
                  alt={partner.name}
                  className="max-h-12 w-auto object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                />
              ) : (
                <div className="text-center font-bold text-gray-700 dark:text-gray-300">
                  {partner.name}
                </div>
              );

              const card = (
                <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-brand-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:hover:border-brand-700">
                  {content}
                </div>
              );

              return partner.website ? (
                <a
                  key={index}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {card}
                </a>
              ) : (
                <div key={index}>
                  {card}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
