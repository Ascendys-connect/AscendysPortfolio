import { useState } from "react";

export default function TrainingsSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "Toutes les formations" },
    { id: "digital", name: "Digital & Tech" },
    { id: "management", name: "Management" },
    { id: "marketing", name: "Marketing" },
    { id: "finance", name: "Finance & Gestion" },
  ];

  const trainings = [
    {
      category: "digital",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop",
      title: "Développement Web Full Stack",
      description: "Maîtrisez les technologies modernes du web",
      duration: "6 mois",
      level: "Débutant",
      price: "500 000 FCFA",
      features: ["HTML/CSS/JS", "React & Node.js", "Projets réels", "Certification"],
    },
    {
      category: "digital",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop",
      title: "Data Science & Analytics",
      description: "Analyse de données et intelligence artificielle",
      duration: "4 mois",
      level: "Intermédiaire",
      price: "600 000 FCFA",
      features: ["Python & R", "Machine Learning", "Visualisation", "Projets"],
    },
    {
      category: "marketing",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
      title: "Marketing Digital",
      description: "Stratégies marketing pour le digital",
      duration: "3 mois",
      level: "Débutant",
      price: "350 000 FCFA",
      features: ["SEO/SEA", "Réseaux sociaux", "Email marketing", "Analytics"],
    },
    {
      category: "management",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop",
      title: "Leadership & Management",
      description: "Développez vos compétences managériales",
      duration: "2 mois",
      level: "Tous niveaux",
      price: "400 000 FCFA",
      features: ["Leadership", "Gestion d'équipe", "Communication", "Stratégie"],
    },
    {
      category: "finance",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop",
      title: "Comptabilité & Gestion",
      description: "Maîtrisez la gestion financière",
      duration: "5 mois",
      level: "Débutant",
      price: "450 000 FCFA",
      features: ["Comptabilité", "Finance", "Logiciels", "Certification"],
    },
    {
      category: "digital",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
      title: "Design UX/UI",
      description: "Créez des expériences utilisateur exceptionnelles",
      duration: "4 mois",
      level: "Débutant",
      price: "400 000 FCFA",
      features: ["Figma/Adobe XD", "User Research", "Prototypage", "Portfolio"],
    },
  ];

  const filteredTrainings =
    activeCategory === "all"
      ? trainings
      : trainings.filter((t) => t.category === activeCategory);

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

        {/* Trainings Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrainings.map((training, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-2xl dark:border-gray-800 dark:bg-gray-950"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                <img
                  src={training.image}
                  alt={training.title}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 top-4 flex justify-between px-4">
                  <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                    {training.level}
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
                  {training.description}
                </p>

                {/* Features */}
                <ul className="mb-6 space-y-2">
                  {training.features.map((feature, idx) => (
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
                <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      À partir de
                    </div>
                    <div className="text-xl font-bold text-brand-600 dark:text-brand-400">
                      {training.price}
                    </div>
                  </div>
                  <a
                    href="/contact"
                    className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700 hover:shadow-lg"
                  >
                    S'inscrire
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <a
            href="#contact"
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
