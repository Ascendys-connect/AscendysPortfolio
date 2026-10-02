import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Replace with actual API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      title: "Téléphone",
      details: ["+225 07 XX XX XX XX", "+225 05 XX XX XX XX"],
      link: "tel:+22507XXXXXXXX",
    },
    {
      icon: (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Email",
      details: ["contact@ascendysconnect.com", "formation@ascendysconnect.com"],
      link: "mailto:contact@ascendysconnect.com",
    },
    {
      icon: (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "Adresse",
      details: ["Quartier des Affaires", "Lomé, Togo"],
      link: "#",
    },
    {
      icon: (
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Horaires",
      details: ["Lun - Ven: 8h - 18h", "Sam: 9h - 13h"],
      link: "#",
    },
  ];

  const faqs = [
    {
      question: "Comment puis-je m'inscrire à une formation ?",
      answer:
        "Vous pouvez vous inscrire en remplissant le formulaire ci-dessus ou en nous contactant directement par téléphone ou email. Notre équipe vous guidera dans le processus d'inscription.",
    },
    {
      question: "Les formations sont-elles certifiées ?",
      answer:
        "Oui, toutes nos formations sont certifiées et reconnues par l'État togolais ainsi que par nos partenaires internationaux comme Microsoft et Google.",
    },
    {
      question: "Proposez-vous des facilités de paiement ?",
      answer:
        "Oui, nous proposons plusieurs options de paiement échelonné. Contactez-nous pour discuter d'un plan de paiement adapté à votre budget.",
    },
    {
      question: "Les formations sont-elles disponibles en ligne ?",
      answer:
        "Oui, nous proposons des formations 100% en ligne, en présentiel, et des formules hybrides. Vous pouvez choisir le format qui vous convient le mieux.",
    },
  ];

  return (
    <>
      <PageMeta
        title="Contact - Ascendys Connect"
        description="Contactez-nous pour toute question sur nos formations professionnelles"
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicNavbar />

        <main className="pt-20">
          {/* Header */}
          <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-16 text-white lg:py-20">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                Contactez-nous
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-brand-100">
                Une question ? Notre équipe est là pour vous répondre
              </p>
            </div>
          </section>

          {/* Contact Info Cards */}
          <section className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    className="group rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-brand-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:hover:border-brand-700"
                  >
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950/30 dark:text-brand-400">
                      {info.icon}
                    </div>
                    <h3 className="mb-3 font-bold text-gray-900 dark:text-white">
                      {info.title}
                    </h3>
                    {info.details.map((detail, idx) => (
                      <p
                        key={idx}
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        {detail}
                      </p>
                    ))}
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Form & Map Section */}
          <section className="bg-gray-50 py-16 dark:bg-gray-900 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                {/* Contact Form */}
                <div>
                  <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                    Envoyez-nous un message
                  </h2>

                  {submitStatus === "success" && (
                    <div className="mb-6 rounded-lg border border-success-200 bg-success-50 p-4 text-success-800 dark:border-success-800 dark:bg-success-950/30 dark:text-success-400">
                      <div className="flex items-center gap-3">
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="font-medium">
                          Message envoyé ! Nous vous répondrons sous 24h.
                        </span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                          placeholder="Votre nom"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                          placeholder="+225 XX XX XX XX XX"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Sujet *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        >
                          <option value="">Sélectionnez un sujet</option>
                          <option value="formation">Inscription formation</option>
                          <option value="information">Demande d'information</option>
                          <option value="devis">Demande de devis</option>
                          <option value="partenariat">Partenariat</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        placeholder="Décrivez votre demande..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-brand-600 px-6 py-4 font-semibold text-white transition-all hover:bg-brand-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                    </button>
                  </form>
                </div>

                {/* Map & Info */}
                <div className="space-y-8">
                  {/* Map Placeholder */}
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex h-96 items-center justify-center text-gray-400">
                      <div className="text-center">
                        <svg
                          className="mx-auto mb-4 size-16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p className="text-sm">Carte Google Maps</p>
                        <p className="text-xs">Cocody, Angré 7ème Tranche</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-950">
                    <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                      Informations pratiques
                    </h3>
                    <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-3">
                        <svg
                          className="mt-0.5 size-5 shrink-0 text-gold-500"
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
                        <span>Réponse sous 24h ouvrées</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg
                          className="mt-0.5 size-5 shrink-0 text-gold-500"
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
                        <span>Conseiller dédié pour vous accompagner</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg
                          className="mt-0.5 size-5 shrink-0 text-gold-500"
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
                        <span>Devis gratuit et sans engagement</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <svg
                          className="mt-0.5 size-5 shrink-0 text-gold-500"
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
                        <span>Visite de nos locaux sur rendez-vous</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 lg:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                  Questions Fréquentes
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Trouvez rapidement les réponses à vos questions
                </p>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950"
                  >
                    <h3 className="mb-3 font-bold text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <PublicFooter />
      </div>
    </>
  );
}
