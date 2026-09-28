"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-[140px]">

      {/* ── VIDEO BACKGROUND ─────────────────────────────────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/short.mp4" type="video/mp4" />
      </video>

      {/* ── OVERLAYS ─────────────────────────────────────────────────── */}
      {/* Deep dark gradient overlay for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(13,0,37,0.92) 0%, rgba(26,0,80,0.88) 40%, rgba(66,8,161,0.82) 75%, rgba(152,0,191,0.72) 100%)",
          zIndex: 1,
        }}
      />
      {/* Bottom fade to white for section transition */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(13,0,37,0.6))",
          zIndex: 2,
        }}
      />

      {/* ── DECORATIVE ELEMENTS ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {/* Gold accent line — top left */}
        <motion.div
          className="absolute top-32 left-0 h-px w-32 md:w-64"
          style={{ background: "linear-gradient(90deg, #FFC000, transparent)" }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        />
        {/* Floating hex — top right */}
        <motion.div
          className="absolute top-24 right-12 md:right-24 opacity-25"
          animate={{ y: [0, -14, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
            <polygon points="45,5 80,25 80,65 45,85 10,65 10,25" stroke="#FFC000" strokeWidth="1.2" fill="none" />
          </svg>
        </motion.div>
        {/* Floating hex — bottom left */}
        <motion.div
          className="absolute bottom-32 left-12 opacity-15"
          animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <svg width="55" height="55" viewBox="0 0 90 90" fill="none">
            <polygon points="45,5 80,25 80,65 45,85 10,65 10,25" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
          </svg>
        </motion.div>
        {/* Vertical gold line — right edge */}
        <motion.div
          className="absolute top-1/4 right-0 w-px h-40 hidden lg:block"
          style={{ background: "linear-gradient(to bottom, transparent, #FFC000, transparent)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="container-xl relative flex flex-col items-start text-left pb-24" style={{ zIndex: 3 }}>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="h-px w-10 bg-[#FFC000]" />
          <span className="text-[#FFC000] text-xs font-semibold tracking-[0.25em] uppercase">
            Solutions IT &amp; Digitales
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-extrabold text-white leading-[1.05] tracking-tight mb-6 max-w-4xl"
          style={{ textShadow: "0 4px 40px rgba(0,0,0,0.4)" }}
        >
          <span className="text-white">
            Nous transformons
            <br />
            l&apos;IT en levier
            <br />
          </span>
          <span
            style={{
              background: "linear-gradient(90deg, #FFC000 0%, #ffe566 60%, #FFC000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% auto",
            }}
          >
            de croissance.
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{ marginTop: "07px" }}
          className="text-lg md:text-xl text-white/75 max-w-xl mb-6 leading-relaxed whitespace-nowrap"
        >
          Audit · Conseil · Ingénierie · Sécurité · Télécommunications · Formation.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg md:text-xl text-white font-semibold italic max-w-xl mb-16 leading-relaxed"
          style={{ marginTop: "18px" }}
        >
          ASCENDYS CONNECT — Pour plus de Valeur.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          style={{ marginTop: "18px" }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-20"
        >
          <Link href="/contact" className="btn-gold group" style={{ padding: "15px 32px", fontSize: "1rem" }}>
            Discuter de votre projet
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/formations" className="btn-outline group" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            Voir les formations
          </Link>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{ marginTop: "18px" }}
          className="flex flex-wrap items-center gap-x-12 gap-y-5"
        >
          {[
            { val: "5", label: "Domaines d'expertise" },
            { val: "7+", label: "Formations professionnelles" },
            { val: "1", label: "Interlocuteur unique" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="text-2xl font-extrabold"
                style={{ color: "#FFC000" }}
              >
                {stat.val}
              </span>
              <span className="text-white/55 text-sm">{stat.label}</span>
              {i < 2 && (
                <span className="hidden sm:block w-px h-6 bg-white/15 ml-2" />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── SCROLL INDICATOR ─────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ zIndex: 3 }}
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.0 , repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-white/30 text-[10px] tracking-widest uppercase">Défiler</span>
        <ChevronDown size={18} className="text-white/30" />
      </motion.div>
    </section>
  );
}
