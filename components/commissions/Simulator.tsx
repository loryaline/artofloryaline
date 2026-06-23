"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import {
  BASE_GROUPS, BASE, EXTRAS_LIVRABLES, EXTRAS_DIVERS, DROITS, PACKS,
  fmt, chf, isVideo,
} from "@/lib/pricing";

export interface QuotePrefill {
  format: string;
  summary: string;
}

function toggle(set: Set<string>, id: string): Set<string> {
  const next = new Set(set);
  next.has(id) ? next.delete(id) : next.add(id);
  return next;
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left border transition-all duration-200 p-4 ${
        active ? "border-[#c9a84c] bg-[#c9a84c]/8" : "border-[#1e1e1e] hover:border-[#c9a84c]/30"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">{children}</div>
        {active && <Check size={14} className="text-[#c9a84c] shrink-0 mt-0.5" />}
      </div>
    </button>
  );
}

function SectionTitle({ num, label }: { num: string; label: string }) {
  return (
    <div className="mb-6">
      <span className="text-sm tracking-[0.35em] uppercase text-[#c9a84c]">{num} — </span>
      <span className="font-serif text-2xl text-[#e8e0d0]">{label}</span>
    </div>
  );
}

function Diamond() {
  return <span className="inline-block w-1 h-1 bg-[#c9a84c]/60 rotate-45 shrink-0 mt-1.5" />;
}

// Map catégorie d'œuvre → nom de groupe du simulateur
const groupOfId: Record<string, string> = {};
for (const g of BASE_GROUPS) for (const it of g.items) groupOfId[it.id] = g.group;

export default function Simulator({
  onRequestQuote,
  examples,
}: {
  onRequestQuote: (prefill: QuotePrefill) => void;
  examples?: Record<string, string>;
}) {
  // Résout l'image d'exemple : prestation précise > groupe de catégorie.
  // Aucun fallback : si rien n'est tagué dans l'admin, on n'affiche pas d'image.
  const previewSrc = (item: { id: string }): string | null =>
    examples?.[item.id] ?? examples?.[groupOfId[item.id]] ?? null;

  const [baseId, setBaseId]           = useState<string | null>(null);
  const [livrablesOn, setLivrablesOn] = useState<Set<string>>(new Set());
  const [diversOn, setDiversOn]       = useState<Set<string>>(new Set());
  const [droitsOn, setDroitsOn]       = useState<Set<string>>(new Set());
  const [packId, setPackId]           = useState<string | null>(null);
  const [extraPersos, setExtraPersos] = useState(0);
  const [revSup, setRevSup]           = useState(0);

  const result = useMemo(() => {
    const base = BASE.find((b) => b.id === baseId);
    if (!base) return null;

    const illuMin = base.min + (baseId === "multi" ? extraPersos * 300 : 0);
    const illuMax = base.max + (baseId === "multi" ? extraPersos * 400 : 0);

    let droitsPctMin = 0;
    let droitsPctMax = 0;
    if (packId) {
      const pack = PACKS.find((p) => p.id === packId)!;
      droitsPctMin = pack.pctMin;
      droitsPctMax = pack.pctMax;
    } else {
      for (const d of DROITS) {
        if (droitsOn.has(d.id)) { droitsPctMin += d.pctMin; droitsPctMax += d.pctMax; }
      }
    }

    const droitsMin = illuMin * droitsPctMin;
    const droitsMax = illuMax * droitsPctMax;
    const illuTotalMin = illuMin + droitsMin;
    const illuTotalMax = illuMax + droitsMax;

    const urgMin = diversOn.has("urgence") ? illuTotalMin * 0.25 : 0;
    const urgMax = diversOn.has("urgence") ? illuTotalMax * 0.25 : 0;

    let flatMin = 0, flatMax = 0;
    for (const e of EXTRAS_LIVRABLES) {
      if (livrablesOn.has(e.id)) { flatMin += e.flatMin; flatMax += e.flatMax; }
    }
    flatMin += revSup * 60;
    flatMax += revSup * 90;

    return {
      base, illuMin, illuMax,
      droitsMin, droitsMax, droitsPctMin, droitsPctMax,
      urgMin, urgMax,
      totalMin: illuTotalMin + urgMin + flatMin,
      totalMax: illuTotalMax + urgMax + flatMax,
    };
  }, [baseId, livrablesOn, diversOn, droitsOn, packId, extraPersos, revSup]);

  const isReady = result !== null;
  const selectedPack = packId ? PACKS.find((p) => p.id === packId) : null;
  const selectedDroits = DROITS.filter((d) => droitsOn.has(d.id));

  // Construit le résumé texte pour pré-remplir le formulaire
  function buildPrefill(): QuotePrefill {
    const lines: string[] = ["— Estimation établie via le simulateur —", ""];
    let grandMin = 0, grandMax = 0;

    if (result) {
      lines.push(`Concept : ${result.base.label} (${fmt(result.illuMin)}–${fmt(result.illuMax)} €)`);
      if (baseId === "multi" && extraPersos > 0) lines.push(`Personnages supp. : +${extraPersos}`);
      const livr = EXTRAS_LIVRABLES.filter((e) => livrablesOn.has(e.id)).map((e) => e.label);
      if (livr.length) lines.push(`Livrables : ${livr.join(", ")}`);
      if (selectedPack) lines.push(`Droits : ${selectedPack.label}`);
      else if (selectedDroits.length) lines.push(`Droits : ${selectedDroits.map((d) => d.label).join(", ")}`);
      const divers = EXTRAS_DIVERS.filter((e) => diversOn.has(e.id)).map((e) => e.label);
      if (divers.length) lines.push(`Options : ${divers.join(", ")}`);
      if (revSup > 0) lines.push(`Révisions supp. : ${revSup}`);
      grandMin += result.totalMin; grandMax += result.totalMax;
    }
    lines.push("");
    lines.push(`TOTAL ESTIMÉ : ${fmt(grandMin)}–${fmt(grandMax)} € (≈ ${chf(grandMin)}–${chf(grandMax)} CHF)`);
    lines.push("");
    lines.push("Détails du projet : ");

    const format = result ? result.base.label : "Sur mesure";
    return { format, summary: lines.join("\n") };
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">

      {/* ── Gauche : formulaire ── */}
      <div className="space-y-12">

        {/* 01 Base */}
        <section>
          <SectionTitle num="01" label="Concept de base" />
          <div className="space-y-6">
            {BASE_GROUPS.map((group) => (
              <div key={group.group}>
                <p className="text-xs tracking-widest uppercase text-[#5a5040] mb-2 pl-1">{group.group}</p>
                <div className="space-y-2">
                  {group.items.map((b) => (
                    <Toggle key={b.id} active={baseId === b.id} onClick={() => { setBaseId(b.id === baseId ? null : b.id); setExtraPersos(0); }}>
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="text-base text-[#e8e0d0]">{b.label}</p>
                          <p className="text-sm text-[#8a8070] mt-0.5">{b.desc}</p>
                          <p className="text-xs text-[#5a5040] mt-1 tracking-wider">
                            {b.rev} révision{b.rev > 1 ? "s" : ""} incluse{b.rev > 1 ? "s" : ""}
                          </p>
                        </div>
                        <p className="font-serif text-xl text-[#c9a84c] shrink-0 pt-0.5">{b.min}–{b.max} €</p>
                      </div>
                    </Toggle>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {baseId === "multi" && (
            <div className="mt-4 border border-[#c9a84c]/20 p-5">
              <p className="text-sm text-[#e8e0d0] mb-3">Personnages supplémentaires (au-delà de 3)</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setExtraPersos(Math.max(0, extraPersos - 1))} className="w-9 h-9 border border-[#2a2a2a] text-[#c9a84c] hover:border-[#c9a84c]/40 text-lg flex items-center justify-center">−</button>
                <span className="font-serif text-2xl text-[#e8e0d0] w-6 text-center">{extraPersos}</span>
                <button onClick={() => setExtraPersos(extraPersos + 1)} className="w-9 h-9 border border-[#2a2a2a] text-[#c9a84c] hover:border-[#c9a84c]/40 text-lg flex items-center justify-center">+</button>
                <span className="text-sm text-[#8a8070]">× 300–400 € / perso</span>
              </div>
            </div>
          )}
        </section>

        {/* 02 Livrables */}
        <section>
          <SectionTitle num="02" label="Livrables optionnels" />
          <div className="space-y-2">
            {EXTRAS_LIVRABLES.map((e) => (
              <Toggle key={e.id} active={livrablesOn.has(e.id)} onClick={() => setLivrablesOn(toggle(livrablesOn, e.id))}>
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-base text-[#e8e0d0]">{e.label}</p>
                    <p className="text-sm text-[#8a8070] mt-0.5">{e.desc}</p>
                  </div>
                  <p className="font-serif text-xl text-[#c9a84c] shrink-0 pt-0.5">
                    {e.flatMin === e.flatMax ? `+${e.flatMin} €` : `+${e.flatMin}–${e.flatMax} €`}
                  </p>
                </div>
              </Toggle>
            ))}
          </div>
        </section>

        {/* 03 Droits */}
        <section>
          <SectionTitle num="03" label="Cession de droits" />
          <p className="text-sm text-[#8a8070] mb-4 leading-relaxed">
            Choisis un pack ou des droits à la carte — s&apos;applique sur le prix illustration uniquement.
          </p>
          <p className="text-xs tracking-widest uppercase text-[#5a5040] mb-3">Forfaits</p>
          <div className="space-y-2 mb-6">
            {PACKS.map((p) => (
              <Toggle key={p.id} active={packId === p.id} onClick={() => { setPackId(p.id === packId ? null : p.id); setDroitsOn(new Set()); }}>
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-base text-[#e8e0d0]">{p.label}</p>
                    <p className="text-sm text-[#8a8070] mt-0.5">{p.desc}</p>
                  </div>
                  <p className="font-serif text-xl text-[#c9a84c] shrink-0 pt-0.5">+{Math.round(p.pctMin * 100)}–{Math.round(p.pctMax * 100)}%</p>
                </div>
              </Toggle>
            ))}
          </div>
          <p className="text-xs tracking-widest uppercase text-[#5a5040] mb-3">À la carte</p>
          <div className="space-y-2">
            {DROITS.map((d) => (
              <Toggle key={d.id} active={droitsOn.has(d.id)} onClick={() => { setDroitsOn(toggle(droitsOn, d.id)); setPackId(null); }}>
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-base text-[#e8e0d0]">{d.label}</p>
                    <p className="text-sm text-[#8a8070] mt-0.5">{d.desc}</p>
                  </div>
                  <p className="font-serif text-xl text-[#c9a84c] shrink-0 pt-0.5">+{Math.round(d.pctMin * 100)}–{Math.round(d.pctMax * 100)}%</p>
                </div>
              </Toggle>
            ))}
          </div>
        </section>

        {/* 04 Divers */}
        <section>
          <SectionTitle num="04" label="Options diverses" />
          <div className="space-y-2">
            {EXTRAS_DIVERS.map((e) => (
              <Toggle key={e.id} active={diversOn.has(e.id)} onClick={() => setDiversOn(toggle(diversOn, e.id))}>
                <p className="text-base text-[#e8e0d0]">{e.label}</p>
                <p className="text-sm text-[#8a8070] mt-0.5">{e.desc}</p>
              </Toggle>
            ))}
          </div>
          {diversOn.has("rev_sup") && (
            <div className="mt-3 border border-[#c9a84c]/20 p-5">
              <p className="text-sm text-[#e8e0d0] mb-3">Nombre de révisions supplémentaires</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setRevSup(Math.max(0, revSup - 1))} className="w-9 h-9 border border-[#2a2a2a] text-[#c9a84c] hover:border-[#c9a84c]/40 text-lg flex items-center justify-center">−</button>
                <span className="font-serif text-2xl text-[#e8e0d0] w-6 text-center">{revSup}</span>
                <button onClick={() => setRevSup(revSup + 1)} className="w-9 h-9 border border-[#2a2a2a] text-[#c9a84c] hover:border-[#c9a84c]/40 text-lg flex items-center justify-center">+</button>
                <span className="text-sm text-[#8a8070]">× 60–90 € / révision</span>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ── Droite : estimation ── */}
      <div className="lg:sticky lg:top-[204px]">
        <div className={`border transition-all duration-500 overflow-hidden ${isReady ? "border-[#c9a84c]/40" : "border-[#1e1e1e]"}`}>

          {/* Preview image — image entière, non recadrée, uniquement si taguée */}
          {(() => {
            const src = isReady ? previewSrc(result.base) : null;
            if (!src) return null;
            return (
              <div className="relative w-full">
                {isVideo(src) ? (
                  <video src={src} muted loop autoPlay playsInline className="w-full h-auto block" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={result!.base.label} className="w-full h-auto block" />
                )}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#080808] pointer-events-none" />
                <p className="absolute bottom-3 left-5 text-[10px] tracking-[0.3em] uppercase text-[#c9a84c]">Exemple de réalisation</p>
              </div>
            );
          })()}

          <div className="p-8">
            <p className="text-xs tracking-widest uppercase text-[#5a5040] mb-6">Estimation indicative</p>

            {!isReady ? (
              <div className="text-center py-12">
                <div className="w-8 h-px bg-[#2a2a2a] mx-auto mb-6" />
                <p className="font-serif text-2xl text-[#3a3028]">Sélectionne un concept</p>
                <p className="text-sm text-[#2a2a2a] mt-2">pour voir la fourchette</p>
              </div>
            ) : (
              <div className="space-y-4">
                {result && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline gap-4">
                        <p className="text-sm text-[#8a8070]">{result.base.label}</p>
                        <p className="text-base text-[#e8e0d0] shrink-0">{fmt(result.illuMin)}–{fmt(result.illuMax)} €</p>
                      </div>
                      {baseId === "multi" && extraPersos > 0 && (
                        <div className="flex justify-between items-baseline gap-4">
                          <p className="text-sm text-[#8a8070]">+{extraPersos} perso{extraPersos > 1 ? "s" : ""} supp.</p>
                          <p className="text-base text-[#e8e0d0] shrink-0">+{extraPersos * 300}–{extraPersos * 400} €</p>
                        </div>
                      )}
                      {EXTRAS_LIVRABLES.filter((e) => livrablesOn.has(e.id)).map((e) => (
                        <div key={e.id} className="flex justify-between items-baseline gap-4">
                          <p className="text-sm text-[#8a8070]">{e.label}</p>
                          <p className="text-base text-[#e8e0d0] shrink-0">{e.flatMin === e.flatMax ? `+${e.flatMin} €` : `+${e.flatMin}–${e.flatMax} €`}</p>
                        </div>
                      ))}
                      {(result.droitsMin > 0 || result.droitsMax > 0) && (
                        <div className="flex justify-between items-baseline gap-4">
                          <p className="text-sm text-[#8a8070]">Droits ({Math.round(result.droitsPctMin * 100)}–{Math.round(result.droitsPctMax * 100)}%)</p>
                          <p className="text-base text-[#e8e0d0] shrink-0">+{fmt(result.droitsMin)}–{fmt(result.droitsMax)} €</p>
                        </div>
                      )}
                      {diversOn.has("urgence") && (
                        <div className="flex justify-between items-baseline gap-4">
                          <p className="text-sm text-[#8a8070]">Urgence (+25%)</p>
                          <p className="text-base text-[#e8e0d0] shrink-0">+{fmt(result.urgMin)}–{fmt(result.urgMax)} €</p>
                        </div>
                      )}
                      {revSup > 0 && (
                        <div className="flex justify-between items-baseline gap-4">
                          <p className="text-sm text-[#8a8070]">{revSup} révision{revSup > 1 ? "s" : ""} supp.</p>
                          <p className="text-base text-[#e8e0d0] shrink-0">+{revSup * 60}–{revSup * 90} €</p>
                        </div>
                      )}
                    </div>

                    {/* Contenu de la prestation */}
                    <div className="border border-[#1a1a1a] p-4 space-y-2">
                      <p className="text-xs tracking-widest uppercase text-[#5a5040] mb-3">Contenu de la prestation</p>
                      <div className="flex items-start gap-2"><Diamond /><p className="text-sm text-[#8a8070]">JPG / PNG HD aplati, 300 dpi (print)</p></div>
                      <div className="flex items-start gap-2"><Diamond /><p className="text-sm text-[#8a8070]">
                        {result.base.rev + revSup} révision{(result.base.rev + revSup) > 1 ? "s" : ""} incluse{(result.base.rev + revSup) > 1 ? "s" : ""}
                        {revSup > 0 && <span className="text-[#5a5040]"> (dont {revSup} supp.)</span>}
                      </p></div>
                      {EXTRAS_LIVRABLES.filter((e) => livrablesOn.has(e.id)).map((e) => (
                        <div key={e.id} className="flex items-start gap-2"><Diamond /><p className="text-sm text-[#8a8070]">{e.label}</p></div>
                      ))}
                      {selectedPack && <div className="flex items-start gap-2"><Diamond /><p className="text-sm text-[#8a8070]">{selectedPack.label} — {selectedPack.desc}</p></div>}
                      {!selectedPack && selectedDroits.map((d) => (
                        <div key={d.id} className="flex items-start gap-2"><Diamond /><p className="text-sm text-[#8a8070]">{d.label}</p></div>
                      ))}
                      {diversOn.has("urgence") && <div className="flex items-start gap-2"><Diamond /><p className="text-sm text-[#8a8070]">Livraison express sous 5 jours ouvrés</p></div>}
                      <div className="pt-2 mt-1 border-t border-[#1e1e1e] space-y-1.5">
                        <p className="text-xs tracking-widest uppercase text-[#3a3028] mb-2">Non inclus</p>
                        {!livrablesOn.has("src_illu") && <div className="flex items-start gap-2"><span className="inline-block w-1 h-1 bg-[#2a2a2a] rotate-45 shrink-0 mt-1.5" /><p className="text-xs text-[#3a3028]">Fichiers sources / calques</p></div>}
                        {!livrablesOn.has("mise_page") && <div className="flex items-start gap-2"><span className="inline-block w-1 h-1 bg-[#2a2a2a] rotate-45 shrink-0 mt-1.5" /><p className="text-xs text-[#3a3028]">Mise en page couverture</p></div>}
                        {!selectedPack && droitsOn.size === 0 && <div className="flex items-start gap-2"><span className="inline-block w-1 h-1 bg-[#2a2a2a] rotate-45 shrink-0 mt-1.5" /><p className="text-xs text-[#3a3028]">Cession de droits d&apos;exploitation</p></div>}
                      </div>
                    </div>

                    <div className="h-px bg-[#c9a84c]/20" />
                    <div className="flex justify-between items-baseline gap-4">
                      <p className="text-base text-[#e8e0d0] font-medium">Total estimé</p>
                      <p className="font-serif text-3xl text-[#c9a84c] shrink-0">{fmt(result.totalMin)}–{fmt(result.totalMax)} €</p>
                    </div>
                    <div className="flex justify-between items-baseline gap-4 -mt-2">
                      <p className="text-xs text-[#5a5040]">En CHF (indicatif)</p>
                      <p className="font-serif text-lg text-[#7a6530] shrink-0">{chf(result.totalMin)}–{chf(result.totalMax)} CHF</p>
                    </div>

                    {/* Acompte */}
                    <div className="border border-[#1e1e1e] p-4">
                      <p className="text-xs text-[#5a5040] tracking-wider uppercase mb-1">Acompte (40–50%)</p>
                      <p className="font-serif text-xl text-[#8a8070]">{fmt(result.totalMin * 0.4)}–{fmt(result.totalMax * 0.5)} €</p>
                    </div>
                  </>
                )}

                <p className="text-xs text-[#3a3028] leading-relaxed">
                  Estimation indicative. Le devis final est établi après échange sur ton projet.
                </p>

                <button
                  onClick={() => onRequestQuote(buildPrefill())}
                  className="block w-full text-center py-4 bg-[#c9a84c] text-[#080808] text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all duration-300"
                >
                  Demander ce devis →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
