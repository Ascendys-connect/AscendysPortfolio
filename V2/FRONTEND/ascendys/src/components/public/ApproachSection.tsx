import { CheckCircle, Target, FileText, Users, UserCheck } from "lucide-react";

export default function ApproachSection() {
  const steps = [
    {
      number: 1,
      icon: <Target size={24} />,
      title: "Analyse réelle des besoins métiers",
      description: "Nous partons toujours de vos enjeux concrets, pas d'une liste de technologies.",
    },
    {
      number: 2,
      icon: <CheckCircle size={24} />,
      title: "Solutions pragmatiques et mesurables",
      description: "Chaque livrable est défini, documenté et évaluable. Pas de promesses vagues.",
    },
    {
      number: 3,
      icon: <FileText size={24} />,
      title: "Offres packagées et lisibles",
      description: "Des offres claires, sans jargon, pour que vous sachiez exactement ce que vous achetez.",
    },
    {
      number: 4,
      icon: <Users size={24} />,
      title: "Accompagnement structuré et documenté",
      description: "Chaque mission suit un processus précis avec livrables, jalons et comptes-rendus.",
    },
    {
      number: 5,
      icon: <UserCheck size={24} />,
      title: "Un interlocuteur unique",
      description: "Un seul point de contact pour toute votre relation avec ASCENDYS CONNECT.",
    },
  ];

  return (
    <section className="bg-white py-16 dark:bg-gray-950 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
            Notre approche
          </span>
          <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Méthode, <span className="text-brand-600 dark:text-brand-400">pas improvisation</span>
          </h2>
          <div className="mx-auto mb-8 h-1 w-12 rounded bg-[#FFC000]"></div>
          <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Notre approche repose sur 5 piliers fondamentaux qui garantissent des résultats
            concrets et mesurables pour votre organisation.
          </p>

          {/* Quote */}
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-brand-50 to-purple-50 p-8 dark:from-brand-950/20 dark:to-purple-950/20">
            <blockquote className="text-xl font-semibold italic text-gray-900 dark:text-white">
              « Nous ne vendons pas de technologies.
              <br />
              Nous livrons des solutions exploitables. »
            </blockquote>
          </div>
        </div>

        {/* Steps Timeline - Desktop */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-0 right-0 top-20 mx-auto h-1 w-[85%] bg-gradient-to-r from-brand-200 via-brand-600 to-brand-200 dark:from-brand-900 dark:via-brand-600 dark:to-brand-900"></div>

            {/* Steps */}
            <div className="relative grid grid-cols-5 gap-4">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Circle with Icon */}
                  <div className="relative z-10 mb-6">
                    <div className="flex size-40 flex-col items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-brand-600 to-purple-600 shadow-xl transition-transform hover:scale-110 dark:border-gray-950">
                      <div className="mb-2 text-white">{step.icon}</div>
                      <div className="flex size-12 items-center justify-center rounded-full bg-white text-xl font-bold text-brand-600">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Steps Timeline - Mobile/Tablet (Vertical) */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Vertical Connecting Line */}
            <div className="absolute left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-200 via-brand-600 to-brand-200 dark:from-brand-900 dark:via-brand-600 dark:to-brand-900"></div>

            {/* Steps */}
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="relative flex items-start gap-6">
                  {/* Circle with Icon */}
                  <div className="relative z-10 shrink-0">
                    <div className="flex size-20 flex-col items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-brand-600 to-purple-600 shadow-xl dark:border-gray-950">
                      <div className="text-white">{step.icon}</div>
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full bg-[#FFC000] text-sm font-bold text-gray-900">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom highlight */}
        <div className="mt-8 text-center">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 p-8 text-white shadow-xl">
            <h3 className="mb-4 text-2xl font-bold">
              Une approche qui fait la différence
            </h3>
            <p className="text-lg text-white/90">
              Chaque pilier est conçu pour vous apporter transparence, efficacité et résultats
              mesurables. Pas de promesses vagues, uniquement des engagements concrets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
