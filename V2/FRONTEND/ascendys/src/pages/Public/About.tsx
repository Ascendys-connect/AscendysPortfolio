import PageMeta from "@/components/common/PageMeta";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default function About() {
  const team = [
    {
      name: "Dr. Kouadio Michel",
      role: "Directeur Général",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop",
      bio: "Expert en formation professionnelle avec plus de 15 ans d'expérience",
    },
    {
      name: "Aminata Touré",
      role: "Directrice Pédagogique",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop",
      bio: "Spécialiste en ingénierie pédagogique et transformation digitale",
    },
    {
      name: "Jean-Baptiste Yao",
      role: "Responsable Technique",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&auto=format&fit=crop",
      bio: "Ingénieur en développement web et formateur certifié",
    },
  ];

  const milestones = [
    { year: "2014", event: "Création d'Ascendys Connect" },
    { year: "2016", event: "Certification organisme de formation" },
    { year: "2018", event: "Partenariat avec Microsoft et Google" },
    { year: "2020", event: "Lancement plateforme e-learning" },
    { year: "2022", event: "500+ étudiants formés" },
    { year: "2024", event: "Expansion à l'international" },
  ];

  return (
    <>
      <PageMeta
        title="À propos - Ascendys Connect"
        description="Découvrez l'histoire d'Ascendys Connect, organisme de formation professionnelle au Togo"
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicNavbar />

        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-brand-600 to-brand-800 py-20 text-white lg:py-28">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }} />
            
            <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <h1 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
                Notre Histoire
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-brand-100">
                Depuis 2014, nous transformons des vies à travers la formation
                professionnelle de qualité
              </p>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                <div>
                  <div className="mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-brand-100 text-3xl dark:bg-brand-950/30">
                    🎯
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                    Notre Mission
                  </h2>
                  <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
                    Rendre la formation professionnelle accessible à tous au Togo
                    et en Afrique de l'Ouest. Nous croyons que chacun
                    mérite une chance de développer ses compétences et
                    d'atteindre ses objectifs professionnels.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Formations de qualité certifiées",
                      "Accompagnement personnalisé",
                      "Insertion professionnelle garantie",
                      "Innovation pédagogique continue",
                    ].map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                      >
                        <svg
                          className="size-6 shrink-0 text-gold-500"
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
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-gold-100 text-3xl dark:bg-gold-950/30">
                    🌟
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                    Notre Vision
                  </h2>
                  <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
                    Devenir le leader de la formation professionnelle en Afrique
                    de l'Ouest d'ici 2030. Nous aspirons à créer un écosystème
                    où chaque individu peut se former, évoluer et contribuer au
                    développement économique.
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Excellence",
                        description: "Standards internationaux de formation",
                      },
                      {
                        label: "Innovation",
                        description: "Technologies éducatives de pointe",
                      },
                      {
                        label: "Impact",
                        description: "Transformer 10 000 vies d'ici 2030",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900"
                      >
                        <div className="font-semibold text-brand-600 dark:text-brand-400">
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-gray-50 py-20 dark:bg-gray-900 lg:py-28">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  Notre Parcours
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  10 ans d'innovation et d'excellence
                </p>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute inset-y-0 start-8 w-0.5 bg-brand-200 dark:bg-brand-900 lg:start-1/2" />

                <div className="space-y-12">
                  {milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className={`relative flex items-center gap-8 ${
                        index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                      }`}
                    >
                      {/* Year badge */}
                      <div className="relative z-10 flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white shadow-lg lg:absolute lg:start-1/2 lg:-translate-x-1/2">
                        {milestone.year}
                      </div>

                      {/* Content */}
                      <div
                        className={`flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 lg:w-5/12 ${
                          index % 2 === 0 ? "lg:text-end" : "lg:text-start"
                        }`}
                      >
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {milestone.event}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  Notre Équipe
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Des experts passionnés à votre service
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {team.map((member, index) => (
                  <div
                    key={index}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl dark:border-gray-800 dark:bg-gray-950"
                  >
                    <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-800">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="mb-3 text-sm font-semibold text-brand-600 dark:text-brand-400">
                        {member.role}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-20 text-white">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
              <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
                Rejoignez l'aventure Ascendys Connect
              </h2>
              <p className="mb-8 text-xl text-brand-100">
                Ensemble, construisons votre avenir professionnel
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="/home#formations"
                  className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-8 py-4 font-semibold text-gray-900 transition-all hover:bg-gold-400 hover:shadow-xl"
                >
                  Découvrir nos formations
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
                <a
                  href="/home#contact"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-white/10 px-8 py-4 font-semibold backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  Nous contacter
                </a>
              </div>
            </div>
          </section>
        </main>

        <PublicFooter />
      </div>
    </>
  );
}
