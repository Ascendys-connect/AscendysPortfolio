export default function ServicesSection() {
  const services = [
    {
      icon: (
        <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      title: "Formations Certifiantes",
      description:
        "Des programmes complets avec certifications reconnues par l'État et les entreprises partenaires.",
      features: [
        "Certifications professionnelles",
        "Diplômes reconnus",
        "Attestations de formation",
      ],
    },
    {
      icon: (
        <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Formation en Ligne",
      description:
        "Accédez à nos formations depuis n'importe où avec notre plateforme e-learning moderne.",
      features: [
        "Cours vidéo HD",
        "Support en direct",
        "Accès illimité 24/7",
      ],
    },
    {
      icon: (
        <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Formation en Entreprise",
      description:
        "Solutions sur-mesure pour développer les compétences de vos équipes en intra-entreprise.",
      features: [
        "Programmes personnalisés",
        "Formation sur site",
        "Suivi post-formation",
      ],
    },
    {
      icon: (
        <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Coaching Individuel",
      description:
        "Accompagnement personnalisé pour atteindre vos objectifs professionnels rapidement.",
      features: [
        "Sessions one-to-one",
        "Plan d'action personnalisé",
        "Mentor dédié",
      ],
    },
  ];

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

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-brand-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-950 dark:hover:border-brand-700"
            >
              {/* Icon */}
              <div className="mb-6 inline-flex rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 p-3 text-white shadow-lg transition-transform group-hover:scale-110">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                {service.title}
              </h3>

              {/* Description */}
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                {service.description}
              </p>

              {/* Features List */}
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      className="size-5 shrink-0 text-gold-500"
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
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  En savoir plus
                  <svg
                    className="size-4 transition-transform group-hover:translate-x-1"
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
          ))}
        </div>
      </div>
    </section>
  );
}
