export default function PartnersSection() {
  // En production, ces logos viendront de l'API
  const partners = [
    { name: "Microsoft", logo: "https://via.placeholder.com/150x60/9800BF/FFFFFF?text=Microsoft" },
    { name: "Google", logo: "https://via.placeholder.com/150x60/9800BF/FFFFFF?text=Google" },
    { name: "Meta", logo: "https://via.placeholder.com/150x60/9800BF/FFFFFF?text=Meta" },
    { name: "Amazon", logo: "https://via.placeholder.com/150x60/9800BF/FFFFFF?text=Amazon" },
    { name: "IBM", logo: "https://via.placeholder.com/150x60/9800BF/FFFFFF?text=IBM" },
    { name: "Oracle", logo: "https://via.placeholder.com/150x60/9800BF/FFFFFF?text=Oracle" },
  ];

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

        {/* Partners Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-brand-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:hover:border-brand-700"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-12 w-auto object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-950 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Certifications Reconnues
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Toutes nos formations sont certifiées et reconnues par l'État
                et nos partenaires internationaux. Obtenez des diplômes et
                certifications qui boostent votre employabilité.
              </p>
              <ul className="space-y-3">
                {[
                  "Certifications Microsoft",
                  "Google Career Certificates",
                  "Attestations de formation professionnelle",
                  "Diplômes reconnus par l'État",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
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
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 to-gold-500 blur-3xl opacity-20" />
                <div className="relative rounded-2xl border-4 border-brand-600 bg-white p-8 shadow-2xl dark:border-brand-400 dark:bg-gray-900">
                  <div className="text-center">
                    <svg
                      className="mx-auto mb-4 size-20 text-brand-600 dark:text-brand-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      Organisme Certifié
                    </div>
                    <div className="mt-2 text-brand-600 dark:text-brand-400">
                      N° Agrément: 2024-CI-XXX
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
