import { Award, Users, Lightbulb, MapPin } from "lucide-react";

export default function AboutSection() {
  const values = [
    {
      icon: <Award size={28} />,
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque formation dispensée",
    },
    {
      icon: <Users size={28} />,
      title: "Accompagnement",
      description: "Un suivi personnalisé pour garantir votre réussite",
    },
    {
      icon: <Lightbulb size={28} />,
      title: "Innovation",
      description: "Des méthodes pédagogiques modernes et efficaces",
    },
    {
      icon: <MapPin size={28} />,
      title: "Accessibilité",
      description: "Des formations accessibles à tous, partout au Togo",
    },
  ];

  const achievements = [
    { number: "10+", label: "Ans d'expérience" },
    { number: "500+", label: "Apprenants formés" },
    { number: "50+", label: "Formations disponibles" },
    { number: "20+", label: "Partenaires certifiés" },
  ];

  return (
    <section id="a-propos" className="bg-white py-12 dark:bg-gray-950 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-gold-100 px-4 py-1.5 text-sm font-semibold text-gold-700 dark:bg-gold-950/30 dark:text-gold-400">
            À Propos
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Votre partenaire de{" "}
            <span className="text-brand-600 dark:text-brand-400">confiance</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Ascendys Connect est un organisme de formation professionnelle
            certifié, spécialisé dans le développement des compétences
            numériques et managériales.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="mb-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Story */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Notre Mission
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Depuis plus de 10 ans, nous accompagnons les particuliers et les
              entreprises dans leur transformation digitale et leur montée en
              compétences. Notre mission est de rendre la formation
              professionnelle accessible à tous, avec des programmes de qualité
              reconnus par l'État et nos partenaires.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Nous croyons fermement que l'éducation est la clé du succès
              professionnel. C'est pourquoi nous mettons tout en œuvre pour
              offrir des formations pratiques, orientées vers l'emploi et
              dispensées par des experts reconnus dans leur domaine.
            </p>

            {/* Achievements */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              {achievements.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                    {item.number}
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Values */}
          <div>
            <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Nos Valeurs
            </h3>
            <div className="space-y-4">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-brand-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:hover:border-brand-700"
                >
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 text-white shadow-md transition-transform hover:scale-110">
                    {value.icon}
                  </div>
                  <div>
                    <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                      {value.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Box */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-center text-white shadow-2xl lg:p-12">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />
          <div className="relative">
            <h3 className="mb-4 text-2xl font-bold sm:text-3xl">
              Prêt à transformer votre carrière ?
            </h3>
            <p className="mb-8 text-lg text-brand-100">
              Rejoignez des centaines d'apprenants qui ont déjà fait confiance
              à Ascendys Connect
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/trainings"
                className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-8 py-3 font-semibold text-gray-900 transition-all hover:bg-gold-400 hover:shadow-xl"
              >
                Voir nos formations
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
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-white/10 px-8 py-3 font-semibold backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Contactez-nous
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
