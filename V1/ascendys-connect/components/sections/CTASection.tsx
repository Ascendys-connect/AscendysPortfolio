"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail } from "lucide-react";

export default function CTASection() {
  return (
    <section
      className="relative overflow-hidden py-36 md:py-48"
      style={{
        background: "linear-gradient(135deg, #1a0050 0%, #4208A1 50%, #9800BF 100%)",
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FFC000 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #9800BF 0%, transparent 70%)" }}
        />
      </div>

      <div className="container-xl relative z-10 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center max-w-4xl w-full"
        >
          <span className="badge badge-white mb-6 text-base px-6 py-3" style={{ marginTop: "22px" }}>Passons à l&apos;action</span>

          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight w-full" style={{ color: "#FFFFFF", textAlign: "center" }}>
            Votre transformation IT
            <br />
            commence aujourd&apos;hui
          </h2>

          <p className="text-xl md:text-2xl leading-relaxed mb-10 max-w-3xl w-full" style={{ marginBottom: "18px", color: "rgba(255, 255, 255, 0.85)", textAlign: "center" }}>
            Que vous ayez un projet précis ou simplement des questions,
            notre équipe est là pour vous guider. Analyse de vos besoins
            offerte lors du premier échange.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"  style={{ marginBottom: "18px" }}>
            <Link href="/contact" className="btn-gold text-lg px-10 py-5">
              Prendre contact <ArrowRight size={20} />
            </Link>
            <Link href="/formations" className="btn-outline text-lg px-10 py-5">
              Voir les formations
            </Link>
          </div>

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/60 text-base"  style={{ marginBottom: "18px" }}>
            <a
              href="tel:+22896498282"
              className="flex items-center gap-3 hover:text-white transition-colors"
            >
              <Phone size={18} style={{ color: "#FFC000" }} />
              +228 96 49 82 82
            </a>
            <span className="hidden sm:block w-px h-5 bg-white/20" />
            <a
              href="mailto:contact@ascendys-group.com"
              className="flex items-center gap-3 hover:text-white transition-colors"
            >
              <Mail size={18} style={{ color: "#FFC000" }} />
              contact@ascendys-group.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
