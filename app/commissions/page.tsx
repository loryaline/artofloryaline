"use client";

import { useState, useEffect } from "react";
import Simulator, { type QuotePrefill } from "@/components/commissions/Simulator";
import PricingReference from "@/components/commissions/PricingReference";
import Engagements from "@/components/Engagements";

const CONTACT_EMAIL = "la@artofloryaline.ch";

function GoldDiamond() {
  return <span className="inline-block w-1.5 h-1.5 rotate-45 bg-[#c9a84c]/60 mx-1 align-middle" />;
}

const SUBNAV = [
  { id: "simuler", label: "Simuler" },
  { id: "grille", label: "Grille détaillée" },
  { id: "demande", label: "Faire une demande" },
];

const CAT_TO_GROUP: Record<string, string> = {
  Portraits: "Portraits",
  Environnements: "Environnements & Scènes",
  Cartes: "Cartes",
};

interface ArtworkLite {
  src: string;
  category: string;
  usage?: "gallery" | "examples" | "both";
  exampleFor?: string;
}

export default function CommissionsPage() {
  const [examples, setExamples] = useState<Record<string, string>>({});

  // Récupère les œuvres marquées "exemples" (ou "les deux") pour illustrer le simulateur
  useEffect(() => {
    fetch("/api/artworks")
      .then((r) => r.json())
      .then((all: ArtworkLite[]) => {
        const map: Record<string, string> = {};
        for (const a of all) {
          if (!a.src) continue;
          if ((a.usage ?? "both") === "gallery") continue;
          // Clé précise par prestation si choisie dans l'admin
          if (a.exampleFor && !map[a.exampleFor]) map[a.exampleFor] = a.src;
          // Repli par groupe de catégorie
          const group = CAT_TO_GROUP[a.category];
          if (group && !map[group]) map[group] = a.src;
        }
        setExamples(map);
      })
      .catch(() => {});
  }, []);

  // Ouvre le client mail avec l'estimation pré-remplie
  const handleRequestQuote = (p: QuotePrefill) => {
    const subject = `Demande de devis — ${p.format}`;
    const body = `${p.summary}\n\n(Décris ici ton projet, l'ambiance souhaitée, tes références…)`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen pb-32">

      {/* Header */}
      <div className="text-center pt-32 pb-12 px-6">
        <p className="text-sm tracking-[0.4em] uppercase text-[#c9a84c] mb-3">Travaillons ensemble</p>
        <h1 className="font-serif text-6xl md:text-7xl font-light text-[#e8e0d0]">Commissions</h1>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="w-16 h-px bg-[#c9a84c]/30" />
          <GoldDiamond />
          <div className="w-16 h-px bg-[#c9a84c]/30" />
        </div>
        <p className="text-[#8a8070] text-lg mt-8 max-w-xl mx-auto leading-relaxed">
          Portraits, illustrations de couverture, cartes et scènes fantasy sur mesure.
          Estime ton budget avec le simulateur, puis envoie ta demande — je réponds sous 48h.
        </p>
        <p className="text-sm text-[#5a5040] tracking-wider mt-3">
          Tarifs en EUR / CHF · Taux indicatif 1 EUR ≈ 0,95 CHF
        </p>
      </div>

      {/* Sous-nav sticky */}
      <div className="sticky top-[112px] z-40 bg-[#080808]/90 backdrop-blur-md border-y border-[#c9a84c]/10 mb-16">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-2 sm:gap-8 py-4">
          {SUBNAV.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="text-xs sm:text-sm tracking-widest uppercase text-[#8a8070] hover:text-[#c9a84c] transition-colors px-2"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Simulateur */}
      <section id="simuler" className="max-w-6xl mx-auto px-6 scroll-mt-[210px]">
        <div className="mb-12">
          <p className="text-sm tracking-[0.35em] uppercase text-[#c9a84c] mb-2">Étape 1</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-[#e8e0d0]">Compose ton projet</h2>
          <p className="text-[#8a8070] text-lg mt-3 max-w-2xl leading-relaxed">
            Sélectionne tes options pour obtenir une fourchette indicative en temps réel.
          </p>
        </div>
        <Simulator onRequestQuote={handleRequestQuote} examples={examples} />
      </section>

      {/* Conditions générales */}
      <section className="max-w-2xl mx-auto px-6 mt-24">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#5a5040] text-center mb-8">Conditions générales</p>
        <div className="space-y-4 text-base text-[#8a8070] leading-relaxed">
          <div className="flex gap-4"><GoldDiamond /><p><span className="text-[#e8e0d0]">Acompte :</span>{" "}40–50% à la signature du devis, solde à la livraison des fichiers finaux.</p></div>
          <div className="flex gap-4"><GoldDiamond /><p><span className="text-[#e8e0d0]">Portfolio :</span>{" "}je conserve le droit de présenter tout travail dans mon portfolio, sauf clause de confidentialité écrite.</p></div>
          <div className="flex gap-4"><GoldDiamond /><p><span className="text-[#e8e0d0]">Devis :</span>{" "}chaque projet fait l'objet d'un devis personnalisé. Les fourchettes affichées sont indicatives.</p></div>
          <div className="flex gap-4"><GoldDiamond /><p><span className="text-[#e8e0d0]">Localisation :</span>{" "}basée en Suisse — régime de droit d'auteur suisse. Les contrats avec éditeurs étrangers peuvent relever d'autres régimes.</p></div>
        </div>
      </section>

      {/* 2. Grille détaillée */}
      <section id="grille" className="max-w-6xl mx-auto px-6 mt-24 scroll-mt-[210px]">
        <PricingReference />
      </section>

      {/* Engagements */}
      <div className="mt-32">
        <Engagements />
      </div>

      {/* 3. Contact */}
      <section id="demande" className="max-w-2xl mx-auto px-6 mt-32 scroll-mt-[210px] text-center">
        <p className="text-sm tracking-[0.35em] uppercase text-[#c9a84c] mb-2">Étape 2</p>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-[#e8e0d0]">Écris-moi</h2>
        <p className="text-[#8a8070] text-lg mt-4 mb-10 leading-relaxed">
          Une idée, un projet, une question ? Contacte-moi directement par email — je réponds sous 48h.
          Si tu as utilisé le simulateur, clique « Demander ce devis » pour pré-remplir ton message.
        </p>

        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Demande de devis — Art of LoryAline")}`}
          className="inline-flex items-center justify-center px-12 py-5 border border-[#c9a84c] text-[#c9a84c] text-base tracking-widest uppercase hover:bg-[#c9a84c] hover:text-[#080808] transition-all duration-300"
        >
          {CONTACT_EMAIL}
        </a>

        <p className="text-sm text-[#5a5040] mt-8">
          Ou retrouve-moi sur{" "}
          <a href="https://www.instagram.com/artofloryaline/" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] hover:text-[#e2c97e] transition-colors">
            Instagram
          </a>.
        </p>
      </section>

    </main>
  );
}
