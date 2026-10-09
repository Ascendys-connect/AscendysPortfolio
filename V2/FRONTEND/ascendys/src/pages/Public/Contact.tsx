import { useState, useMemo } from "react";
import PageMeta from "@/components/common/PageMeta";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { useCompany } from "@/context/CompanyContext";
import SocialIcon from "@/components/common/SocialIcon";
import api from "@/services/api.service";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import type { E164Number } from 'libphonenumber-js/core';

export default function Contact() {
  const { company, email, phones, fullAddress, socialLinks, whatsappUrl } = useCompany();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "" as E164Number | "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setStatusMessage("");

    try {
      const nameParts = formData.name.trim().split(" ");
      const first_name = nameParts[0] || "Client";
      const last_name = nameParts.slice(1).join(" ") || "Inconnu";

      await api.post("/contact/messages/", {
        first_name,
        last_name,
        email: formData.email.trim(),
        phone: formData.phone ? String(formData.phone).trim() : "",
        subject: formData.subject || "information",
        message: formData.message.trim(),
        consent_privacy: true,
      });

      setIsSubmitting(false);
      setSubmitStatus("success");
      setStatusMessage("Message envoyé avec succès ! Notre équipe vous répondra sous 24h.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 6000);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitStatus("error");
      const errDetail =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        (typeof err?.response?.data === "object" ? JSON.stringify(err.response.data) : null) ||
        err?.message ||
        "Une erreur est survenue lors de l'envoi de votre message.";
      setStatusMessage(errDetail);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = useMemo(() => {
    // Format business hours if configured in DB
    const hours = company?.business_hours;
    let hoursDetails = ["Lun - Ven: 8h - 18h", "Sam: 9h - 13h"];
    if (hours && typeof hours === "object" && Object.keys(hours).length > 0) {
      hoursDetails = Object.entries(hours).map(([day, val]) => `${day}: ${val}`);
    }

    return [
      {
        icon: <Phone className="size-6" />,
        title: "Téléphone",
        details: phones.length > 0 ? phones : ["+228 96 49 82 82"],
        link: phones[0] ? `tel:${phones[0].replace(/\s+/g, "")}` : "#",
      },
      {
        icon: <Mail className="size-6" />,
        title: "Email",
        details: [email || "contact@ascendys-group.com"],
        link: `mailto:${email || "contact@ascendys-group.com"}`,
      },
      {
        icon: <MapPin className="size-6" />,
        title: "Adresse",
        details: [company?.address || "Kpota colas", `${company?.city || "Lomé"}, ${company?.country || "Togo"}`],
        link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
      },
      {
        icon: <Clock className="size-6" />,
        title: "Horaires",
        details: hoursDetails,
        link: "#",
      },
    ];
  }, [company, email, phones, fullAddress]);

  const faqs = [
    {
      question: "Comment puis-je m'inscrire à une formation ?",
      answer:
        "Vous pouvez vous inscrire en remplissant le formulaire ci-dessus ou en nous contactant directement par téléphone ou email. Notre équipe vous guidera dans le processus d'inscription.",
    },
    {
      question: "Les formations sont-elles certifiées ?",
      answer:
        "Oui, toutes nos formations sont certifiées et reconnues avec des parcours alignés sur les standards de l'industrie et des certifications reconnues.",
    },
    {
      question: "Proposez-vous des facilités de paiement ?",
      answer:
        "Oui, nous proposons plusieurs options d'échelonnement. Contactez-nous pour discuter d'un plan adapté à vos besoins.",
    },
    {
      question: "Les formations sont-elles disponibles en ligne ?",
      answer:
        "Oui, nous proposons des formations en présentiel, 100% à distance et en formule hybride selon vos disponibilités.",
    },
  ];

  return (
    <>
      <PageMeta
        title={`Contact - ${company?.name || "Ascendys Connect"}`}
        description="Contactez-nous pour toute question sur nos formations professionnelles et nos services digitaux."
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicNavbar />

        <main className="pt-20">
          {/* Header with Background Image */}
          <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 py-16 text-white lg:py-20">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url(/contact-nous.jpg)",
                opacity: 0.2,
              }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                Parlons de votre projet
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-brand-100">
                Premier échange offert. Décrivez votre situation et nous vous répondrons dans les meilleurs délais.
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
                    target={info.link.startsWith("http") ? "_blank" : undefined}
                    rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
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

              {/* Social Networks Section on Contact Page */}
              {socialLinks.length > 0 && (
                <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50/70 p-6 dark:border-gray-800 dark:bg-gray-900/40">
                  <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Retrouvez-nous sur les réseaux sociaux
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Suivez nos actualités, masterclasses, offres de formation et conseils IT au quotidien.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {socialLinks.map((social) => (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-brand-400 dark:hover:bg-gray-700"
                          title={social.name}
                        >
                          <SocialIcon platform={social.platform} className="size-4" />
                          <span>{social.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
                    <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="size-5 shrink-0" />
                        <span className="font-medium">{statusMessage}</span>
                      </div>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="size-5 shrink-0" />
                        <span className="font-medium">{statusMessage}</span>
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
                        <PhoneInput
                          international
                          defaultCountry="TG"
                          value={formData.phone}
                          onChange={(value) => setFormData({ ...formData, phone: value || "" })}
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
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
                        placeholder="Décrivez votre demande avec au moins 10 caractères..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-4 font-semibold text-white transition-all hover:bg-brand-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send className="size-4" />
                      <span>{isSubmitting ? "Envoi en cours..." : "Envoyer le message"}</span>
                    </button>
                  </form>
                </div>

                {/* Map & Info */}
                <div className="space-y-8">
                  {/* Google Maps */}
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.066583274589!2d1.2729222!3d6.1680143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e308e926bc7d%3A0x44ff1244cd4eed5!2sMA%20Coworking%20Space!5e0!3m2!1sfr!2stg!4v1234567890123!5m2!1sfr!2stg"
                      width="100%"
                      height="384"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Localisation ${company?.name || "Ascendys Connect"}`}
                      className="h-96"
                    />
                  </div>

                  {/* Additional Info */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-950">
                    <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                      Informations pratiques
                    </h3>
                    <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold-500" />
                        <span>Réponse sous 24h ouvrées</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold-500" />
                        <span>Conseiller dédié pour vous accompagner</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold-500" />
                        <span>Devis gratuit et sans engagement</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold-500" />
                        <span>Visite de nos locaux sur rendez-vous à {company?.city || "Lomé"}</span>
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
        <WhatsAppButton />
      </div>
    </>
  );
}
