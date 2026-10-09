import { useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import SocialIcon from "@/components/common/SocialIcon";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import type { E164Number } from 'libphonenumber-js/core';
import api from "@/services/api.service";
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function CTASection() {
  const { company, email, phones, fullAddress, socialLinks } = useCompany();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "" as E164Number | "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const nameParts = formData.name.trim().split(" ");
      const first_name = nameParts[0] || "Client";
      const last_name = nameParts.slice(1).join(" ") || "Inconnu";

      await api.post("/contact/messages/", {
        first_name,
        last_name,
        email: formData.email.trim(),
        phone: formData.phone ? String(formData.phone).trim() : "",
        subject: "Demande de contact (Landing)",
        message: formData.message.trim(),
        consent_privacy: true,
      });

      setIsSubmitting(false);
      setSubmitStatus("success");
      setStatusMessage("Message envoyé avec succès ! Nous vous recontacterons sous 24h.");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitStatus("error");
      const errDetail =
        err?.response?.data?.message ||
        err?.message ||
        "Une erreur est survenue lors de l'envoi de votre message.";
      setStatusMessage(errDetail);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-white py-20 dark:bg-gray-950 lg:py-28">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239800bf" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Info */}
          <div>
            <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
              Contact
            </span>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Prêt à démarrer votre{" "}
              <span className="text-brand-600 dark:text-brand-400">formation</span> ?
            </h2>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
              Contactez-nous dès aujourd'hui pour en savoir plus sur nos
              programmes de formation ou pour obtenir un accompagnement personnalisé.
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {/* Phone */}
              {phones.length > 0 && (
                <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
                    <Phone className="size-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                      Téléphone
                    </h3>
                    <div className="space-y-1">
                      {phones.map((phone, idx) => (
                        <p key={idx} className="text-gray-600 dark:text-gray-400">
                          <a
                            href={`tel:${phone.replace(/\s+/g, "")}`}
                            className="hover:text-brand-600 dark:hover:text-brand-400"
                          >
                            {phone}
                          </a>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              {email && (
                <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
                    <Mail className="size-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      <a
                        href={`mailto:${email}`}
                        className="hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        {email}
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {/* Address */}
              {fullAddress && (
                <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
                    <MapPin className="size-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                      Adresse
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {company?.address || "Kpota colas"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {company?.city || "Lomé"}, {company?.country || "Togo"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                  Suivez-nous
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-10 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 transition-all hover:border-brand-500 hover:bg-brand-600 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-brand-600"
                      aria-label={social.name}
                      title={social.name}
                    >
                      <SocialIcon platform={social.platform} className="size-5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Form */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-900 lg:p-10">
            <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Envoyez-nous un message
            </h3>

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
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  placeholder="Décrivez votre projet ou vos besoins..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition-all hover:bg-brand-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="size-4" />
                <span>{isSubmitting ? "Envoi en cours..." : "Envoyer le message"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
