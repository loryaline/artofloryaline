"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { baseRates, rights, packsRef, directionArtistique, extras } from "@/lib/pricing";

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-6 my-12">
      <div className="flex-1 h-px bg-[#1e1e1e]" />
      <p className="text-[10px] tracking-[0.35em] uppercase text-[#5a5040] whitespace-nowrap">{label}</p>
      <div className="flex-1 h-px bg-[#1e1e1e]" />
    </div>
  );
}

export default function PricingReference() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#1a1a1a]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-8 py-6 text-left hover:bg-[#0f0f0f] transition-colors"
      >
        <div>
          <p className="text-xs tracking-[0.35em] uppercase text-[#c9a84c] mb-1">Référence complète</p>
          <p className="font-serif text-2xl text-[#e8e0d0]">Grille tarifaire détaillée</p>
          <p className="text-sm text-[#8a8070] mt-1">Prix de base, options, droits, direction artistique</p>
        </div>
        <ChevronDown size={24} className={`text-[#c9a84c] shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-8 pb-10 border-t border-[#1a1a1a] pt-8">

          {/* Prix de base */}
          <div className="mb-6">
            <p className="text-sm tracking-[0.35em] uppercase text-[#c9a84c] mb-1">01</p>
            <h3 className="font-serif text-3xl font-light text-[#e8e0d0]">Prix de base</h3>
            <p className="text-[#8a8070] text-base mt-2">Illustration seule, livrée en JPG/PNG HD aplati, 300 dpi.</p>
          </div>
          <div className="space-y-3">
            {baseRates.map((r) => (
              <div key={r.concept} className="border border-[#1a1a1a] hover:border-[#c9a84c]/25 transition-colors duration-300 p-6 group">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-serif text-2xl text-[#e8e0d0] group-hover:text-[#e2c97e] transition-colors">{r.concept}</p>
                    <p className="text-[#8a8070] text-base mt-1 leading-relaxed">{r.desc}</p>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <span className="text-[10px] tracking-widest uppercase text-[#5a5040]">✎ {r.revisions} révision{r.revisions.startsWith("1") ? "" : "s"}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-serif text-2xl text-[#c9a84c]">{r.eur}</p>
                    <p className="text-xs text-[#5a5040] mt-0.5">{r.chf}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Divider label="Options & livrables" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {extras.map((e) => (
              <div key={e.label} className="border border-[#1a1a1a] p-5 hover:border-[#c9a84c]/25 transition-colors duration-300">
                <p className="text-base text-[#e8e0d0] font-medium mb-1">{e.label}</p>
                <p className="text-xs text-[#8a8070] leading-relaxed mb-3">{e.desc}</p>
                <p className="text-[#c9a84c] font-serif text-lg">{e.price}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border border-[#c9a84c]/20 p-6 bg-[#c9a84c]/3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-[#c9a84c] mb-1">Formule complète</p>
                <p className="font-serif text-xl text-[#e8e0d0]">Couverture tout-en-un</p>
                <p className="text-[#8a8070] text-sm mt-1 max-w-md">Illustration + mise en page menées ensemble, direction artistique globale. Calques illustration fournis à la mise en page. ~20–30h.</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-serif text-2xl text-[#c9a84c]">1 200–1 800 €</p>
                <p className="text-xs text-[#5a5040] mt-0.5">1 140–1 710 CHF</p>
              </div>
            </div>
          </div>

          <Divider label="Cession de droits" />

          <div className="space-y-3 mb-8">
            {rights.map((r) => (
              <div key={r.name} className="border border-[#1a1a1a] p-5 hover:border-[#c9a84c]/25 transition-colors duration-300 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <p className="text-base text-[#e8e0d0] font-medium">{r.name}</p>
                  <p className="text-xs text-[#8a8070] mt-1 leading-relaxed">{r.desc}</p>
                </div>
                <p className="font-serif text-xl text-[#c9a84c] shrink-0">{r.rate}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#5a5040] mb-4">Forfaits pré-assemblés</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {packsRef.map((p) => (
              <div key={p.name} className="border border-[#c9a84c]/20 p-6 hover:border-[#c9a84c]/40 transition-colors duration-300">
                <p className="font-serif text-xl text-[#e8e0d0] mb-2">{p.name}</p>
                <p className="text-xs text-[#8a8070] leading-relaxed mb-4">{p.desc}</p>
                <p className="font-serif text-2xl text-[#c9a84c]">{p.rate}</p>
              </div>
            ))}
          </div>
          <div className="border border-[#1a1a1a] p-6">
            <p className="text-[10px] tracking-widest uppercase text-[#c9a84c] mb-5">Paramètres par défaut</p>
            <ul className="space-y-3">
              {[
                ["Étendue", "Limitée aux droits explicitement listés et payés. Tout droit non cédé reste ma propriété."],
                ["Durée", "Illimitée pour les droits cédés."],
                ["Territoire", "Monde entier, sauf restriction négociée."],
                ["Exclusivité", "Exclusive — le client est seul à exploiter l'œuvre dans le cadre cédé. Je conserve le droit de la montrer en portfolio."],
                ["Droit moral", "Incessible. Mon nom doit figurer, l'œuvre ne peut être dénaturée. Non négociable (disposition légale)."],
              ].map(([key, val]) => (
                <li key={key} className="flex gap-4 text-base">
                  <span className="text-[#c9a84c] font-medium shrink-0 w-24">{key}</span>
                  <span className="text-[#8a8070] leading-relaxed">{val}</span>
                </li>
              ))}
            </ul>
          </div>

          <Divider label="Direction artistique" />

          <p className="text-[#8a8070] text-base mb-6 max-w-2xl leading-relaxed">{directionArtistique.desc}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {directionArtistique.inclus.map((item) => (
              <div key={item.label} className="border border-[#1a1a1a] p-5">
                <p className="text-base text-[#e8e0d0] font-medium mb-1">{item.label}</p>
                <p className="text-sm text-[#8a8070] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {directionArtistique.formules.map((f, i) => (
              <div key={f.name} className={`border p-6 transition-colors duration-300 ${i === 1 ? "border-[#c9a84c]/30 bg-[#c9a84c]/3" : "border-[#1a1a1a]"}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    {i === 1 && <p className="text-[10px] tracking-widest uppercase text-[#c9a84c] mb-1">Recommandé</p>}
                    <p className="font-serif text-2xl text-[#e8e0d0]">{f.name}</p>
                    <p className="text-[#8a8070] text-sm mt-1 max-w-lg leading-relaxed">{f.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-serif text-2xl text-[#c9a84c]">{f.eur}</p>
                    {f.chf !== "Sur devis" && <p className="text-xs text-[#5a5040] mt-0.5">{f.chf}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
