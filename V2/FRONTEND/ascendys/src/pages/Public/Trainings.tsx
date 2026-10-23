import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import { useApi } from "@/hooks/useApi";
import type { Training } from "@/types/content.types";
import { formatPrice } from "@/utils/media";

export default function Trainings() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: trainings, isLoading } = useApi<Training[]>("/trainings/?status=PUBLISHED", {
    defaultValue: [],
  });

  // Filter published trainings - already filtered by API
  const publishedTrainings = trainings;

  // Get unique categories
  const categories = [
    { id: "all", name: "Toutes les formations" },
    ...Array.from(
      new Set(
        publishedTrainings
          .map((t) => t.category_name)
          .filter((name) => name && name.trim() !== "")
      )
    ).map((name) => ({
      id: name.toLowerCase(),
      name: name,
    })),
  ];

  // Filter trainings
  const filteredTrainings = publishedTrainings.filter((training) => {
    const matchesCategory =
      selectedCategory === "all" || training.category_name?.toLowerCase() === selectedCategory;
    const matchesSearch = training.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLevelLabel = (level: string) => {
    const labels = {
      BEGINNER: "Débutant",
      INTERMEDIATE: "Intermédiaire",
      ADVANCED: "Avancé",
    };
    return labels[level as keyof typeof labels] || level;
  };

  return (
    <>
      <PageMeta
        title="Nos Formations - Ascendys Connect"
        description="Découvrez toutes nos formations professionnelles certifiées"
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicNavbar />

        <main className="pt-20">
          {/* Header */}
          <section className="relative py-16 text-white lg:py-20">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: 'url(/formation.avif)' }}
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />
            
            <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                Nos Formations
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-brand-100">
                Plus de {publishedTrainings.length} formations certifiées pour
                développer vos compétences
              </p>
            </div>
          </section>

          {/* Filters & Search */}
          <section className="border-b border-gray-200 bg-gray-50 py-8 dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Search */}
                <div className="relative flex-1 lg:max-w-md">
                  <svg
                    className="absolute start-4 top-1/2 size-5 -translate-y-1/2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Rechercher une formation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white py-3 pe-4 ps-12 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                        selectedCategory === category.id
                          ? "bg-brand-600 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results count */}
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {filteredTrainings.length} formation(s) trouvée(s)
              </div>
            </div>
          </section>

          {/* Trainings Grid */}
          <section className="py-12 lg:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {isLoading ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
                    >
                      <div className="h-48 bg-gray-200 dark:bg-gray-800" />
                      <div className="p-6 space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredTrainings.length === 0 ? (
                <div className="py-20 text-center">
                  <svg
                    className="mx-auto mb-4 size-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Aucune formation trouvée
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTrainings.map((training) => (
                    <div
                      key={training.id}
                      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-2xl dark:border-gray-800 dark:bg-gray-950"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                        {training.image ? (
                          <img
                            src={training.image}
                            alt={training.title}
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-gray-400">
                            <svg
                              className="size-16"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-x-0 top-4 flex justify-between px-4">
                          <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                            {getLevelLabel(training.level)}
                          </span>
                          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur-sm">
                            {training.duration}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="mb-2 text-xs font-semibold uppercase text-brand-600 dark:text-brand-400">
                          {training.category_name}
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                          {training.title}
                        </h3>
                        <p className="mb-4 line-clamp-2 text-justify text-sm text-gray-600 dark:text-gray-400">
                          {training.short_description || training.description}
                        </p>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              À partir de
                            </div>
                            <div className="text-xl font-bold text-brand-600 dark:text-brand-400">
                              {formatPrice(training.price, training.currency)}
                            </div>
                          </div>
                          <a
                            href={`/trainings/${training.slug}`}
                            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700 hover:shadow-lg"
                          >
                            En savoir plus
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gray-50 py-16 dark:bg-gray-900">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                Vous ne trouvez pas ce que vous cherchez ?
              </h2>
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
                Contactez-nous pour une formation sur-mesure adaptée à vos besoins
              </p>
              <a
                href="/home#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-8 py-4 font-semibold text-white transition-all hover:bg-brand-700 hover:shadow-lg"
              >
                Demander un devis personnalisé
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
          </section>
        </main>

        <PublicFooter />
      </div>
    </>
  );
}
