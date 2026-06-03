"use client";

import { useEffect } from "react";
import { Sparkles, Eye, Clapperboard } from "lucide-react";

// ─── À PERSONNALISER ──────────────────────────────────────────────────────────
// Ton @ Instagram (sans le @) et les liens de reels à embarquer.
const INSTAGRAM_HANDLE = "artofloryaline";
const REELS: string[] = [
  "https://www.instagram.com/p/DUB5HQHgN0x/",
  "https://www.instagram.com/p/DTaLtbGDaOH/",
  "https://www.instagram.com/p/DK2GCm1t3br/",
  "https://www.instagram.com/p/DKSJ0kctT1H/",
];
// ───────────────────────────────────────────────────────────────────────────────

const ENGAGEMENTS = [
  {
    icon: Sparkles,
    title: "Zéro IA générative",
    desc: "Chaque œuvre livrée est entièrement peinte à la main. Aucune image générée par intelligence artificielle dans le produit fini et délivré — uniquement mon travail, mon trait, mes choix.",
  },
  {
    icon: Eye,
    title: "Work in progress partagés",
    desc: "Tu suis l'avancée de ton projet à chaque étape clé : esquisse, valeurs, couleurs, finitions. Tu valides au fur et à mesure, jamais de mauvaise surprise à la livraison.",
    note: "Hors option de livraison rapide.",
  },
  {
    icon: Clapperboard,
    title: "Timelapses de réalisation",
    desc: "Sur demande, mes processus sont filmés et partagés. La preuve, en vidéo, que tout est créé de A à Z, pinceau numérique en main.",
    note: "Sur demande · hors projets confidentiels.",
  },
];

export default function Engagements() {
  // Charge le script d'embed Instagram si des reels sont fournis
  useEffect(() => {
    if (!REELS.length) return;
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://www.instagram.com/embed.js"]');
    if (existing) {
      // @ts-expect-error API Instagram injectée par le script
      window.instgrm?.Embeds?.process?.();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-12">
        <p className="text-sm tracking-[0.4em] uppercase text-[#c9a84c] mb-3">Mes engagements</p>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-[#e8e0d0]">Un travail 100% humain</h2>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="w-16 h-px bg-[#c9a84c]/30" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a84c]/60" />
          <div className="w-16 h-px bg-[#c9a84c]/30" />
        </div>
      </div>

      {/* Les 3 engagements */}
      <div className="grid md:grid-cols-3 gap-6 mb-14">
        {ENGAGEMENTS.map(({ icon: Icon, title, desc, note }) => (
          <div key={title} className="border border-[#1a1a1a] p-8 hover:border-[#c9a84c]/30 transition-colors duration-300 flex flex-col">
            <Icon size={26} className="text-[#c9a84c] mb-5" strokeWidth={1.4} />
            <p className="font-serif text-2xl text-[#e8e0d0] mb-3">{title}</p>
            <p className="text-[#8a8070] text-sm leading-relaxed">{desc}</p>
            {note && (
              <p className="text-xs text-[#5a5040] italic mt-auto pt-4">{note}</p>
            )}
          </div>
        ))}
      </div>

      {/* Reels embarqués — pleine largeur pour tenir 4 sur une ligne en grand écran */}
      {REELS.length > 0 && (
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen px-6 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 max-w-[1500px] mx-auto justify-items-center">
            {REELS.map((url) => (
              <blockquote
                key={url}
                className="instagram-media"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{ background: "#0f0f0f", border: 0, margin: 0, width: "100%", minWidth: 0, maxWidth: 340 }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lien profil */}
      <div className="text-center">
        <a
          href={`https://www.instagram.com/${INSTAGRAM_HANDLE}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-3.5 border border-[#c9a84c] text-[#c9a84c] text-sm tracking-widest uppercase hover:bg-[#c9a84c] hover:text-[#080808] transition-all duration-300"
        >
          Voir mes timelapses sur Instagram →
        </a>
      </div>
    </section>
  );
}
