import { useApi } from "@/hooks/useApi";
import { Testimonial } from "@/types/content.types";

export default function TestimonialsSection() {
  // Fetch testimonials from API
  const { data: testimonials, isLoading, error, refetch } = useApi<Testimonial[]>(
    "/testimonials/?is_published=true&page_size=3",
    { defaultValue: [] }
  );

  // Helper for media URL
  const getMediaUrl = (path: string | null | undefined, fallback: string) => {
    if (!path) return fallback;
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `http://127.0.0.1:8000/${path}`;
  };

  return (
    <section className="bg-white py-20 dark:bg-gray-950 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-gold-100 px-4 py-1.5 text-sm font-semibold text-gold-700 dark:bg-gold-950/30 dark:text-gold-400">
            Témoignages
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Ce que disent nos{" "}
            <span className="text-brand-600 dark:text-brand-400">apprenants</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Découvrez les témoignages de ceux qui ont transformé leur carrière
            avec Ascendys Connect
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="size-5 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
                <div className="flex items-center gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
                  <div className="size-12 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-3 animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Impossible de charger les témoignages
            </p>
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Testimonials Grid */}
        {!isLoading && !error && testimonials.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-gray-200 bg-gray-50 p-8 transition-all hover:border-brand-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-700"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="size-5 text-gold-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <svg
                className="mb-4 size-10 text-brand-600/20 dark:text-brand-400/20"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>

              {/* Content */}
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                {testimonial.content}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
                <img
                  src={getMediaUrl(testimonial.avatar, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop")}
                  alt={testimonial.name}
                  className="size-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-brand-600 dark:text-brand-400">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 gap-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-50 to-gold-50 p-8 md:grid-cols-4 dark:border-gray-800 dark:from-brand-950/30 dark:to-gold-950/30 lg:p-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-600 dark:text-brand-400">
              95%
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Taux de satisfaction
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-600 dark:text-brand-400">
              500+
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Étudiants formés
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-600 dark:text-brand-400">
              4.8/5
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Note moyenne
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-600 dark:text-brand-400">
              85%
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Taux d'insertion
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
