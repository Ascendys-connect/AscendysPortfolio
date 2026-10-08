import { useState, useMemo } from "react";
import { useApi } from "@/hooks/useApi";
import type { Training } from "@/types/content.types";

export default function TrainingsSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  // Fetch trainings from API
  const { data: trainings, isLoading, error, refetch } = useApi<Training[]>(
    "/trainings/?status=PUBLISHED&page_size=6",
    { defaultValue: [] }
  );

  // Extract unique categories from loaded trainings
  const categories = useMemo(() => {
    const categorySet = new Set(
      trainings
        .map((t) => t.category_name)
        .filter((name) => name && name.trim() !== "")
    );
    
    const dynamicCategories = Array.from(categorySet).map((name) => ({
      id: name.toLowerCase(),
      name: name,
    }));

    return [
      { id: "all", name: "Toutes les formations" },
      ...dynamicCategories,
    ];
  }, [trainings]);

  const filteredTrainings =
    activeCategory === "all"
      ? trainings
      : trainings.filter((t) => t.category_name?.toLowerCase() === activeCategory);

  // Helper for level translation
  const getLevelLabel = (level: string) => {
    const levels: Record<string, string> = {
      BEGINNER: "Débutant",
      INTERMEDIATE: "Intermédiaire",
      ADVANCED: "Avancé",
    };
    return levels[level] || level;
  };

  // Helper for media URL
  const getMediaUrl = (path: string | null | undefined, fallback: string) => {
    if (!path) return fallback;
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `http://127.0.0.1:8000/${path}`;
  };

  return (
    <section id="formations" className="bg-gray-50 py-20 dark:bg-gray-900 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
            Nos Formations
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Choisissez la formation qui{" "}
            <span className="text-brand-600 dark:text-brand-400">vous convient</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Plus de 50 formations certifiantes dans le digital, le management et
            bien plus encore
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                activeCategory === category.id
                  ? "bg-brand-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="h-48 animate-pulse bg-gray-200 dark:bg-gray-700" />
                <div className="p-6 space-y-4">
                  <div className="h-6 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="space-y-2">
                    <div className="h-3 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
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
              Impossible de charger les formations
            </p>
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Trainings Grid */}
        {!isLoading && !error && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrainings.map((training, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-2xl dark:border-gray-800 dark:bg-gray-950"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                <img
                  src={getMediaUrl(training.image, "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop")}
                  alt={training.title}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 top-4 flex justify-between px-4">
                  <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                    {training.level_display || getLevelLabel(training.level)}
                  </span>
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur-sm">
                    {training.duration}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  {training.title}
                </h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  {training.short_description}
                </p>

                {/* Features */}
                <ul className="mb-6 space-y-2">
                  {(training.objectives?.slice(0, 4) || training.syllabus?.slice(0, 4) || []).map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      À partir de
                    </div>
                    <div className="text-xl font-bold text-brand-600 dark:text-brand-400">
                      {training.price && training.price !== "0" && training.price !== "" 
                        ? `${training.price} ${training.currency}` 
                        : "Nous contacter"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`/trainings/${training.slug}`}
                      className="flex-1 rounded-lg border-2 border-brand-600 bg-white px-4 py-2.5 text-center text-sm font-semibold text-brand-600 transition-all hover:bg-brand-50 dark:border-brand-400 dark:bg-gray-950 dark:text-brand-400 dark:hover:bg-gray-900"
                    >
                      Voir plus
                    </a>
                    <a
                      href="/contact"
                      className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-brand-700 hover:shadow-lg"
                    >
                      S'inscrire
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* View All Button */}
        <div className="mt-12 text-center">
          <a
            href="/trainings"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-600 px-8 py-3 font-semibold text-brand-600 transition-all hover:bg-brand-600 hover:text-white dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-400 dark:hover:text-white"
          >
            Voir toutes les formations
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
      </div>
    </section>
  );
}
