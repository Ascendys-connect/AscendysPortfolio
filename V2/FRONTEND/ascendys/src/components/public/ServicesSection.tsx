import { useApi } from "@/hooks/useApi";
import type { Service } from "@/services/services.service";
import { getMediaUrl } from "@/utils/media";

export default function ServicesSection() {
  // Fetch services from API
  const { data: services, isLoading, error, refetch } = useApi<Service[]>(
    "/services/?is_active=true&page_size=6",
    { defaultValue: [] }
  );

  // Default icon SVG (book icon from original)
  const defaultIcon = (
    <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );

  return (
    <section id="services" className="bg-gray-50 py-20 dark:bg-gray-900 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
            Nos Services
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Des solutions adaptées à{" "}
            <span className="text-brand-600 dark:text-brand-400">vos besoins</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Que vous soyez un particulier ou une entreprise, nous avons la
            solution de formation qui vous convient.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="mb-4 inline-flex size-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-3">
                  <div className="h-6 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Impossible de charger les services
            </p>
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Services Grid */}
        {!isLoading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service, index) => {
              const iconUrl = getMediaUrl(service.icon);
              const iconElement = iconUrl ? (
                <img src={iconUrl} className="size-8 rounded-lg" alt="" />
              ) : defaultIcon;

              return (
                <div
                  key={index}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-950 dark:hover:border-brand-700"
                >
                  {/* Icon */}
                  <div className="mb-4 inline-flex rounded-xl bg-transparent p-2.5 text-gray-900 dark:text-white">
                    {iconElement}
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className=" text-justify mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {service.short_description || service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2">
                    {(service.features || []).map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300"
                      >
                        <svg
                          className="size-4 shrink-0 text-gold-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Learn More Link */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <a
                      href="/services"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      En savoir plus
                      <svg
                        className="size-3 transition-transform group-hover:translate-x-1"
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
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        {!isLoading && !error && services.length > 0 && (
          <div className="mt-12 text-center">
            <a
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-600 px-8 py-3 font-semibold text-brand-600 transition-all hover:bg-brand-600 hover:text-white dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-400 dark:hover:text-white"
            >
              Voir tous nos services
              <svg
                className="size-5"
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
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
