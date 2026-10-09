import { useState, useEffect } from "react";
import { Link } from "react-router";
import { X, Clock, MapPin, Users, Star, ArrowRight, Zap } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import type { Training } from "@/types/content.types";

const STORAGE_KEY = "featured_popup_seen";
const DELAY_MS = 30_000;

export default function FeaturedTrainingPopup() {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const { data: trainings } = useApi<Training[]>(
    "/trainings/?is_featured=true&status=PUBLISHED&page_size=1",
    { defaultValue: [] }
  );

  const training = trainings?.[0] ?? null;

  useEffect(() => {
    // Ne pas montrer si déjà vu cette session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      setVisible(true);
      // Petit délai pour déclencher l'animation CSS
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setAnimateIn(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible || !training) return null;

  const levelLabel: Record<string, string> = {
    BEGINNER: "Débutant",
    INTERMEDIATE: "Intermédiaire",
    ADVANCED: "Avancé",
  };

  const modeLabel: Record<string, string> = {
    ONLINE: "En ligne",
    ONSITE: "Présentiel",
    HYBRID: "Hybride",
  };

  const formattedPrice = training.price
    ? `${parseInt(training.price).toLocaleString("fr-FR")} ${training.currency || "XOF"}`
    : null;

  const startDate = training.start_date
    ? new Date(training.start_date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-opacity duration-350 ${
          animateIn ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] transition-all duration-350 ease-out sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 ${
          animateIn
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
        }`}
      >
        <div className="relative overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-gray-900 sm:rounded-2xl">
          {/* Badge vedette */}
          <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-[#FFC000] px-3 py-1 text-xs font-bold text-gray-900 shadow-md">
            <Star className="size-3 fill-current" />
            Formation en vedette
          </div>

          {/* Bouton fermer */}
          <button
            onClick={handleClose}
            aria-label="Fermer"
            className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/40"
          >
            <X className="size-4" />
          </button>

          {/* Image */}
          <div className="relative h-48 w-full overflow-hidden sm:h-52">
            {training.image ? (
              <img
                src={training.image}
                alt={training.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-purple-600 to-purple-900" />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Category */}
            {training.category_name && (
              <span className="absolute bottom-3 left-4 rounded-full bg-purple-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                {training.category_name}
              </span>
            )}
          </div>

          {/* Contenu */}
          <div className="p-5">
            {/* Titre */}
            <h3 className="mb-1.5 text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
              {training.title}
            </h3>
            {training.short_description && (
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {training.short_description}
              </p>
            )}

            {/* Infos */}
            <div className="mb-4 flex flex-wrap gap-3">
              {training.duration && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="size-4 text-purple-500" />
                  {training.duration}
                </div>
              )}
              {training.training_mode && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="size-4 text-purple-500" />
                  {modeLabel[training.training_mode] ?? training.training_mode}
                </div>
              )}
              {training.level && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="size-4 text-purple-500" />
                  {levelLabel[training.level] ?? training.level}
                </div>
              )}
              {startDate && (
                <div className="flex items-center gap-1.5 text-sm text-[#FFC000] font-medium">
                  <Zap className="size-4" />
                  Début : {startDate}
                </div>
              )}
            </div>

            {/* Prix + CTA */}
            <div className="flex items-center justify-between gap-3">
              {formattedPrice && (
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">À partir de</span>
                  <div className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
                    {formattedPrice}
                  </div>
                </div>
              )}
              <Link
                to={`/trainings/${training.slug}`}
                onClick={handleClose}
                className="flex items-center gap-2 rounded-xl bg-[#9800BF] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition-all hover:bg-[#7a0099] hover:shadow-purple-500/50 active:scale-95 ml-auto"
              >
                Voir la formation
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
