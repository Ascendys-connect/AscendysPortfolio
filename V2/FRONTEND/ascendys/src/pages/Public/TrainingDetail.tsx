import { useParams, Link, Navigate } from "react-router";
import PageMeta from "@/components/common/PageMeta";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  ArrowRight,
  ArrowLeft,
  Star,
  AlertCircle,
  CreditCard,
  Zap,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import type { Training } from "@/types/content.types";

const levelLabels: Record<string, string> = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
};

const categoryColors: Record<string, string> = {
  "IT & Digital": "#9800BF",
  "Conseil & Transformation": "#4208A1",
  "Transversales & Innovation": "#6b21a8",
};

export default function TrainingDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: training, isLoading, error } = useApi<Training | null>(
    `/trainings/${slug}/`,
    { defaultValue: null }
  );

  if (isLoading) {
    return (
      <>
        <PublicNavbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block size-12 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>
        </div>
      </>
    );
  }

  if (!training || error) {
    return <Navigate to="/trainings" replace />;
  }

  const color = categoryColors[training.category_name] ?? "#9800BF";

  return (
    <>
      <PageMeta
        title={`${training.title} - Ascendys Connect`}
        description={training.description}
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicNavbar />

        <main className="pt-20">
          {/* Hero */}
          <section
            className="relative overflow-hidden py-16 lg:py-20"
            style={{
              background: `linear-gradient(135deg, #0d0025 0%, #1a0050 40%, ${color} 100%)`,
            }}
          >
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Link
                to="/trainings"
                className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
              >
                <ArrowLeft size={15} />
                Retour au catalogue
              </Link>

              {/* Category + level */}
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  {training.category_name}
                </span>
                <span
                  className="rounded-full px-4 py-1.5 text-xs font-semibold"
                  style={{
                    background: "rgba(255,192,0,0.15)",
                    color: "#FFC000",
                    border: "1px solid rgba(255,192,0,0.3)",
                  }}
                >
                  {levelLabels[training.level]}
                </span>
              </div>

              <h1 className="mb-8 max-w-3xl text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl">
                {training.title}
              </h1>

              {/* Meta row */}
              <div className="mb-10 flex flex-wrap items-center gap-6 text-sm text-white/65">
                <span className="flex items-center gap-2">
                  <Clock size={15} style={{ color: "#FFC000" }} />
                  {training.duration}
                </span>
                {training.max_participants && (
                  <span className="flex items-center gap-2">
                    <Users size={15} style={{ color: "#FFC000" }} />
                    {training.max_participants} places maximum
                  </span>
                )}
                {training.training_mode && (
                  <span className="flex items-center gap-2">
                    <Zap size={15} style={{ color: "#FFC000" }} />
                    {training.mode_display || training.training_mode}
                  </span>
                )}
              </div>

              {/* Price + CTA */}
              <div className="mt-4 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-wide text-white/50">
                    Investissement
                  </div>
                  <div className="text-3xl font-extrabold" style={{ color: "#FFC000" }}>
                    {training.price}
                  </div>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#FFC000] px-8 py-4 font-semibold text-gray-900 transition-all hover:bg-[#ffcc33] hover:shadow-xl hover:-translate-y-0.5"
                >
                  S'inscrire maintenant <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>

          {/* Sticky mini CTA on scroll — visible on desktop */}
          <div className="sticky top-20 z-30 hidden border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 lg:block">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <span className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {training.title}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold" style={{ color }}>
                  {training.price}
                </span>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-700"
                >
                  S'inscrire <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="bg-white py-16 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Left column: main content */}
                <div className="flex flex-col gap-12 lg:col-span-2">
                  {/* Description */}
                  <div>
                    <h2
                      className="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
                      style={{ borderBottom: `3px solid #FFC000`, paddingBottom: "8px", width: "fit-content" }}
                    >
                      À propos de cette formation
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                      {training.description}
                    </p>
                  </div>

                  {/* Objectifs */}
                  {training.objectives && training.objectives.length > 0 && (
                    <div>
                      <h2
                        className="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
                        style={{ borderBottom: `3px solid #FFC000`, paddingBottom: "8px", width: "fit-content" }}
                      >
                        Objectifs pédagogiques
                      </h2>
                      <ul className="mt-6 flex flex-col gap-3">
                        {training.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-900 dark:text-white">
                            <CheckCircle size={18} className="mt-0.5 shrink-0" style={{ color }} />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cette formation est pour vous si… */}
                  {training.for_who && training.for_who.length > 0 && (
                    <div>
                      <h2
                        className="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
                        style={{ borderBottom: `3px solid #FFC000`, paddingBottom: "8px", width: "fit-content" }}
                      >
                        Cette formation est pour vous si…
                      </h2>
                      <ul className="mt-6 flex flex-col gap-3">
                        {training.for_who.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-900 dark:text-white">
                            <CheckCircle size={18} className="mt-0.5 shrink-0" style={{ color: "#9800BF" }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prérequis d'accès */}
                  {training.access_prerequisites && training.access_prerequisites.length > 0 && (
                    <div
                      className="rounded-xl border-l-4 bg-purple-50 p-8 dark:bg-purple-950/20"
                      style={{ borderColor: color }}
                    >
                      <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                        <AlertCircle size={16} style={{ color }} />
                        Prérequis d'accès
                      </h3>
                      <ul className="mt-4 flex flex-col gap-2">
                        {training.access_prerequisites.map((prereq, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span
                              className="mt-2 size-1.5 shrink-0 rounded-full"
                              style={{ background: color }}
                            />
                            {prereq}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Keep legacy prerequisites for backwards compatibility */}
                  {training.prerequisites && training.prerequisites.length > 0 && !(training.access_prerequisites && training.access_prerequisites.length > 0) && (
                    <div
                      className="rounded-xl border-l-4 bg-purple-50 p-8 dark:bg-purple-950/20"
                      style={{ borderColor: color }}
                    >
                      <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                        <AlertCircle size={16} style={{ color }} />
                        Prérequis
                      </h3>
                      <ul className="mt-4 flex flex-col gap-2">
                        {training.prerequisites.map((prereq, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span
                              className="mt-2 size-1.5 shrink-0 rounded-full"
                              style={{ background: color }}
                            />
                            {prereq}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Le problème que vous rencontrez */}
                  {training.problems_solved && training.problems_solved.length > 0 && (
                    <div>
                      <h2
                        className="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
                        style={{ borderBottom: `3px solid #FFC000`, paddingBottom: "8px", width: "fit-content" }}
                      >
                        Le problème que vous rencontrez
                      </h2>
                      <ul className="mt-6 flex flex-col gap-3">
                        {training.problems_solved.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-900 dark:text-white">
                            <XCircle size={18} className="mt-0.5 shrink-0" style={{ color: "#9800BF" }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Ce que vous obtiendrez */}
                  {((training.deliverables && training.deliverables.length > 0) ||
                    (training.skills_acquired && training.skills_acquired.length > 0) ||
                    training.transformation_before ||
                    training.transformation_after) && (
                    <div>
                      <h2
                        className="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
                        style={{ borderBottom: `3px solid #FFC000`, paddingBottom: "8px", width: "fit-content" }}
                      >
                        Ce que vous obtiendrez
                      </h2>
                      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Vos livrables professionnels */}
                        {training.deliverables && training.deliverables.length > 0 && (
                          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                              <Star size={18} style={{ color: "#FFC000" }} />
                              Vos livrables professionnels
                            </h3>
                            <ul className="flex flex-col gap-2">
                              {training.deliverables.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                  <Star size={14} className="mt-0.5 shrink-0" style={{ color: "#FFC000" }} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Vos nouvelles compétences */}
                        {training.skills_acquired && training.skills_acquired.length > 0 && (
                          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                              <CheckCircle size={18} style={{ color: "#9800BF" }} />
                              Vos nouvelles compétences
                            </h3>
                            <ul className="flex flex-col gap-2">
                              {training.skills_acquired.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                  <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#9800BF" }} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Votre transformation */}
                        {(training.transformation_before || training.transformation_after) && (
                          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 md:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                              {training.transformation_before && (
                                <div className="bg-gray-100 p-6 dark:bg-gray-800">
                                  <h3 className="mb-3 font-bold text-gray-900 dark:text-white">
                                    Avant
                                  </h3>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {training.transformation_before}
                                  </p>
                                </div>
                              )}
                              {training.transformation_after && (
                                <div className="p-6" style={{ background: "linear-gradient(135deg, #9800BF, #6b21a8)" }}>
                                  <h3 className="mb-3 font-bold text-white">
                                    Après
                                  </h3>
                                  <p className="text-sm text-white/90">
                                    {training.transformation_after}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ce qui est inclus */}
                  {training.included_items && training.included_items.length > 0 && (
                    <div>
                      <h2
                        className="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
                        style={{ borderBottom: `3px solid #FFC000`, paddingBottom: "8px", width: "fit-content" }}
                      >
                        Ce qui est inclus
                      </h2>
                      {/* Sessions info pill */}
                      {(training.sessions_count || training.session_duration || training.frequency) && (
                        <div className="mb-4 inline-block rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-900 dark:bg-purple-950/30 dark:text-purple-300">
                          {training.sessions_count && `${training.sessions_count} sessions`}
                          {training.session_duration && ` de ${training.session_duration}`}
                          {training.frequency && ` (${training.frequency})`}
                          {training.training_mode && ` — ${training.mode_display || training.training_mode}`}
                        </div>
                      )}
                      <ul className="mt-6 flex flex-col gap-3">
                        {training.included_items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-900 dark:text-white">
                            <CheckCircle size={18} className="mt-0.5 shrink-0" style={{ color: "#9800BF" }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Ce qui n'est PAS inclus */}
                  {training.not_included_items && training.not_included_items.length > 0 && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-950/20">
                      <h3 className="mb-4 font-bold text-gray-900 dark:text-white">
                        Ce qui n'est PAS inclus
                      </h3>
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        Par souci de transparence :
                      </p>
                      <ul className="flex flex-col gap-2">
                        {training.not_included_items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <XCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#ef4444" }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Positionnement stratégique */}
                  {training.strategic_positioning && (
                    <div
                      className="rounded-xl p-8 text-white"
                      style={{ background: "linear-gradient(135deg, #9800BF, #6b21a8, #4208A1)" }}
                    >
                      <h3 className="mb-4 text-xl font-bold">
                        Positionnement stratégique
                      </h3>
                      {training.strategic_positioning.split('\n').map((line, i) => (
                        <p key={i} className="mb-2 text-white/90">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Options Premium */}
                  {training.premium_options && training.premium_options.length > 0 && (
                    <div>
                      <h2
                        className="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
                        style={{ borderBottom: `3px solid #FFC000`, paddingBottom: "8px", width: "fit-content" }}
                      >
                        Options Premium
                      </h2>
                      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {training.premium_options.map((option, i) => (
                          <div
                            key={i}
                            className="rounded-xl border-2 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 dark:from-yellow-950/20 dark:to-orange-950/20"
                            style={{ borderColor: "#FFC000" }}
                          >
                            <div className="mb-3 flex items-center gap-2">
                              <Star size={18} style={{ color: "#FFC000" }} />
                              <h3 className="font-bold text-gray-900 dark:text-white">
                                Option Premium
                              </h3>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {option}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Programme (placeholder) */}
                  <div>
                    <h2
                      className="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
                      style={{ borderBottom: `3px solid #FFC000`, paddingBottom: "8px", width: "fit-content" }}
                    >
                      Programme détaillé
                    </h2>
                    <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-900">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Le programme détaillé sera communiqué lors de l'inscription. Il comprend
                        {' '}{training.duration} de formation intensive avec alternance
                        théorie/pratique et projets concrets.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-32 flex flex-col gap-6">
                    {/* Pricing card */}
                    <div
                      className="overflow-hidden rounded-2xl border-2"
                      style={{ borderColor: color }}
                    >
                      <div
                        className="p-8"
                        style={{
                          background: `linear-gradient(135deg, #1a0050, ${color})`,
                        }}
                      >
                        <div className="mb-1 text-xs uppercase tracking-wider text-white/60">
                          Investissement
                        </div>
                        <div className="mb-1 text-3xl font-extrabold text-white">
                          {training.price}
                        </div>
                        <div className="text-xs text-white/50">
                          {training.duration}
                          {training.max_participants && ` · ${training.max_participants} places max`}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 bg-white p-8 dark:bg-gray-950">
                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                          <CreditCard size={13} /> Modalités de paiement
                        </div>
                        {training.payment_terms ? (
                          training.payment_terms.split('\n').map((term, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color }} />
                              {term}
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color }} />
                              Paiement en plusieurs fois possible
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color }} />
                              Mobile Money accepté
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color }} />
                              Virement bancaire
                            </div>
                          </>
                        )}
                        {training.max_participants && (
                          <div className="mt-2 border-t border-gray-200 pt-4 dark:border-gray-800">
                            <div
                              className="mb-1 flex items-center gap-2 text-sm font-semibold"
                              style={{ color: "#9800BF" }}
                            >
                              <AlertCircle size={14} />
                              Places limitées
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {training.max_participants} places maximum · Prochaines dates à annoncer
                            </p>
                          </div>
                        )}
                        <Link
                          to="/contact"
                          className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition-all hover:bg-brand-700"
                        >
                          S'inscrire <ArrowRight size={16} />
                        </Link>
                        <Link
                          to="/contact"
                          className="text-center text-xs text-gray-500 transition-colors hover:text-brand-600 dark:text-gray-500 dark:hover:text-brand-400"
                        >
                          Des questions ? Nous contacter
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <section
            className="py-16"
            style={{
              background: "linear-gradient(135deg, #1a0050 0%, #4208A1 50%, #9800BF 100%)",
            }}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center text-center">
                <h2 className="mb-4 text-2xl font-extrabold text-white md:text-3xl">
                  Prêt à commencer ?
                </h2>
                <p className="mb-8 max-w-lg text-sm text-white/65">
                  {training.max_participants && `Places limitées à ${training.max_participants} participants. `}
                  Inscrivez-vous maintenant pour réserver votre place.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#FFC000] px-8 py-4 font-semibold text-gray-900 transition-all hover:bg-[#ffcc33] hover:shadow-xl"
                  >
                    S'inscrire maintenant <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/trainings"
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    Voir toutes les formations
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <PublicFooter />
        <WhatsAppButton />
      </div>
    </>
  );
}
