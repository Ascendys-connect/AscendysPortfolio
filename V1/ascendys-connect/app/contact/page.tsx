"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulated send — replace with actual API/form handler
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("sent");
  };

  return (
    <>
      {/* Header Section */}
      <section className="section-py bg-white">
        <div className="container-xl">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="badge badge-violet mb-5">Contact</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] mb-5 max-w-2xl leading-tight">
              Parlons de votre projet
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-xl leading-relaxed">
              Premier échange offert. Décrivez votre situation et nous vous
              répondons dans les meilleurs délais.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
            {/* Form */}
            <div className="lg:col-span-2">
              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                    style={{ background: "rgba(152,0,191,0.1)" }}
                  >
                    <CheckCircle2 size={32} style={{ color: "#9800BF" }} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">
                    Message envoyé !
                  </h2>
                  <p className="text-[#6B6B6B] max-w-md">
                    Merci pour votre message. Notre équipe reviendra vers vous
                    dans les meilleurs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2 gold-underline">
                    Envoyez-nous un message
                  </h2>

                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div>
                      <label htmlFor="prenom" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                        Prénom *
                      </label>
                      <input
                        id="prenom"
                        name="prenom"
                        type="text"
                        required
                        className="form-input"
                        placeholder="Votre prénom"
                        value={form.prenom}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="nom" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                        Nom *
                      </label>
                      <input
                        id="nom"
                        name="nom"
                        type="text"
                        required
                        className="form-input"
                        placeholder="Votre nom"
                        value={form.nom}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="form-input"
                        placeholder="votre@email.com"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="telephone" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                        Téléphone
                      </label>
                      <input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        className="form-input"
                        placeholder="+228 XX XX XX XX"
                        value={form.telephone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="sujet" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Sujet *
                    </label>
                    <select
                      id="sujet"
                      name="sujet"
                      required
                      className="form-input"
                      value={form.sujet}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option>Demande de service IT</option>
                      <option>Inscription à une formation</option>
                      <option>Demande de devis</option>
                      <option>Audit ou conseil</option>
                      <option>Partenariat</option>
                      <option>Autre</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      className="form-input resize-none"
                      placeholder="Décrivez votre projet, vos besoins ou vos questions..."
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary self-start"
                    disabled={status === "sending"}
                    style={{ marginBottom: "20px"}}
                  >
                    {status === "sending" ? "Envoi en cours…" : "Envoyer le message"}
                    {status !== "sending" && <ArrowRight size={16} />}
                  </button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-6 gold-underline">
                  Nos coordonnées
                </h2>
              </div>

              <div
                className="rounded-2xl"
                style={{ 
                  background: "linear-gradient(135deg, #1a0050, #4208A1)",
                  padding: "32px",
                }}
              >
                <ul className="flex flex-col gap-5">
                  <li>
                    <a
                      href="tel:+22896498282"
                      className="flex items-start gap-3 text-white/70 hover:text-white transition-colors group"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(255,192,0,0.15)" }}
                      >
                        <Phone size={16} style={{ color: "#FFC000" }} />
                      </div>
                      <div>
                        <div className="text-xs text-white/40 mb-1">Bureau</div>
                        <div className="font-medium text-sm">+228 96 49 82 82</div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:contact@ascendys-group.com"
                      className="flex items-start gap-3 text-white/70 hover:text-white transition-colors"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(255,192,0,0.15)" }}
                      >
                        <Mail size={16} style={{ color: "#FFC000" }} />
                      </div>
                      <div>
                        <div className="text-xs text-white/40 mb-1">Email</div>
                        <div className="font-medium text-sm">contact@ascendys-group.com</div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <div className="flex items-start gap-3 text-white/70">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(255,192,0,0.15)" }}
                      >
                        <MapPin size={16} style={{ color: "#FFC000" }} />
                      </div>
                      <div>
                        <div className="text-xs text-white/40 mb-1">Adresse</div>
                        <div className="font-medium text-sm leading-relaxed">
                          Lomé, Kpota colas
                          <br />
                          Collés à la pharmacie MAELYS
                          <br />
                          Togo
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Formation CTA */}
              <div className="rounded-xl bg-[#F9F7FF] border border-[#E8E8E8]" style={{ padding: "32px" }}>
                <h3 className="font-bold text-[#1A1A1A] mb-2 text-sm">
                  Intéressé par une formation ?
                </h3>
                <p className="text-[#6B6B6B] text-xs leading-relaxed mb-4" style={{ marginBottom: "15px" }}>
                  Consultez notre catalogue de 7 formations professionnelles et
                  inscrivez-vous.
                </p>
                <a href="/formations" className="btn-outline-dark text-sm" style={{ padding: "10px 16px", fontSize: "0.8125rem" }}>
                  Voir les formations <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
