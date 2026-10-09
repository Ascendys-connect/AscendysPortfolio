import { useState, useEffect } from "react";
import { X, Mail, Sparkles, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import api from "@/services/api.service";

const STORAGE_KEY = "newsletter_popup_seen";
const SUBSCRIBED_KEY = "newsletter_subscribed";
const DELAY_MS = 90_000; // 90 secondes

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Ne pas afficher si déjà fermé cette session ou déjà abonné
    if (sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(SUBSCRIBED_KEY)) {
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setStatus("error");
      setErrorMessage("Veuillez saisir une adresse email valide.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      await api.post("/contact/newsletter/", { email: cleanEmail });
      setStatus("success");
      localStorage.setItem(SUBSCRIBED_KEY, "1");
      sessionStorage.setItem(STORAGE_KEY, "1");

      // Fermeture automatique après 3 secondes en cas de succès
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err: any) {
      setStatus("error");
      const msg =
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.message ||
        err?.message ||
        "Une erreur est survenue lors de l'inscription.";
      setErrorMessage(msg);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-opacity duration-350 ${
          animateIn ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] p-4 transition-all duration-350 ease-out sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:p-0 ${
          animateIn
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
        }`}
      >
        <div className="relative overflow-hidden rounded-3xl border border-purple-100 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          {/* Decorative glowing gradient elements */}
          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-purple-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-amber-500/15 blur-3xl" />

          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Fermer"
            className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="size-5" />
          </button>

          {status === "success" ? (
            /* État Succès */
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle2 className="size-9" />
              </div>
              <h3 className="mb-2 text-2xl font-black text-gray-900 dark:text-white">
                Félicitations !
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Vous êtes désormais abonné(e) à notre newsletter. Vous recevrez nos meilleures opportunités et actualités en avant-première.
              </p>
            </div>
          ) : (
            /* Formulaire d'abonnement */
            <>
              {/* Header Badge & Icon */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#9800BF] to-purple-600 text-white shadow-lg shadow-purple-500/25">
                  <Mail className="size-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                  <Sparkles className="size-3.5 fill-current" />
                  Actualités & Offres
                </span>
              </div>

              {/* Title & Description */}
              <div className="mb-6">
                <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                  Restez toujours informé(e) !
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  Abonnez-vous à la newsletter d’<strong className="text-[#9800BF] dark:text-purple-400">Ascendys Connect</strong> pour recevoir en avant-première nos nouvelles formations, webinaires et conseils d’experts.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder="votre.email@exemple.com"
                    disabled={status === "loading"}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-[#9800BF] focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-purple-400"
                  />
                </div>

                {/* Error message */}
                {status === "error" && errorMessage && (
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                    {errorMessage}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#9800BF] to-purple-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:opacity-95 hover:shadow-purple-600/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Inscription en cours...
                    </>
                  ) : (
                    <>
                      S'abonner maintenant
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer info */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Zéro spam. Désabonnement en 1 clic.</span>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="font-medium hover:underline text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Plus tard
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
