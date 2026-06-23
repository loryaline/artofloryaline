// ─── Données tarifaires partagées (simulateur + grille de référence) ──────────

export const BASE_GROUPS = [
  {
    group: "Portraits",
    items: [
      { id: "buste", label: "Portrait buste",       desc: "1 perso, cadrage serré, fond neutre",     min: 300, max: 480,  time: "5–8h",   rev: 1, preview: "/images/portrait-2.jpg",    previewH: "h-80", previewPos: "object-center" },
      { id: "pied",  label: "Personnage plein pied", desc: "1 perso entier, fond simple ou abstrait", min: 480, max: 600,  time: "8–10h",  rev: 2, preview: "/images/portrait-2.jpg",    previewH: "h-96", previewPos: "object-top"    },
    ],
  },
  {
    group: "Environnements & Scènes",
    items: [
      { id: "envseul", label: "Environnement seul",           desc: "Décor complet sans personnage, travail d'ambiance et de lumière", min: 600, max: 960,  time: "10–16h", rev: 2, preview: "/images/environment-1.jpg", previewH: "h-56", previewPos: "object-center" },
      { id: "env",     label: "Personnage + environnement",   desc: "1 perso sur décor travaillé, ambiance lumineuse",                 min: 840, max: 1080, time: "14–18h", rev: 2, preview: "/images/environment-1.jpg", previewH: "h-56", previewPos: "object-center" },
      { id: "scene",   label: "Scène complète",               desc: "1–2 persos + environnement narratif riche",                       min: 960, max: 1320, time: "16–22h", rev: 3, preview: "/images/environment-1.jpg", previewH: "h-56", previewPos: "object-center" },
      { id: "multi",   label: "Multi-personnages",            desc: "3 persos et plus + décor complet",                                min: 1320, max: 1920, time: "22–32h", rev: 3, preview: "/images/environment-1.jpg", previewH: "h-56", previewPos: "object-center" },
    ],
  },
  // ── Cartes : masquées pour l'instant (à réactiver plus tard) ──
  // {
  //   group: "Cartes",
  //   items: [
  //     { id: "carte_fusain",    label: "Style fusain",    desc: "Trait encré ou crayon, noir & blanc, ambiance manuscrite et ancienne",               min: 250, max: 420, time: "8–12h",  rev: 2, preview: "/images/map-fusain.jpg",    previewH: "h-56", previewPos: "object-center" },
  //     { id: "carte_aqua",     label: "Style aquarelle",  desc: "Lavis de couleurs douces, textures peintes, rendu délicat façon cartes de livre",    min: 380, max: 620, time: "12–18h", rev: 2, preview: "/images/map-aquarelle.jpg", previewH: "h-56", previewPos: "object-center" },
  //     { id: "carte_officiel", label: "Style officielle", desc: "Rendu détaillé, reliefs, icônes, légende complète, rose des vents — style éditorial", min: 500, max: 800, time: "15–22h", rev: 3, preview: "/images/map-officiel.jpg",  previewH: "h-56", previewPos: "object-center" },
  //   ],
  // },
  {
    group: "Couvertures & Mise en page",
    items: [
      { id: "couv_complete", label: "Couverture complète",   desc: "Illustration + mise en page menées ensemble, direction artistique globale, fichier print-ready", min: 1200, max: 1800, time: "20–30h", rev: 3, preview: "/images/environment-1.jpg", previewH: "h-72", previewPos: "object-center" },
      { id: "couv_illu",     label: "Illustration de couverture", desc: "Illustration seule destinée à une couverture (mise en page non incluse). Du line art à l'illustration peinte complète.", min: 240, max: 1320, time: "4–22h", rev: 2, preview: "/images/environment-1.jpg", previewH: "h-72", previewPos: "object-center" },
      { id: "mise_en_page",  label: "Mise en page seule",     desc: "Sur illustration fournie : typo, motifs, masque vernis sélectif, PDF prêt à imprimer",       min: 240, max: 480,  time: "4–8h",   rev: 2, preview: "/images/environment-1.jpg", previewH: "h-56", previewPos: "object-center" },
    ],
  },
  {
    group: "Direction artistique",
    items: [
      { id: "da_essentiel", label: "Essentiel",          desc: "DA + illustration principale + 2 visuels secondaires + bannière campagne",            min: 1500, max: 2400, time: "25–40h", rev: 3, preview: "/images/environment-1.jpg", previewH: "h-72", previewPos: "object-center" },
      { id: "da_campagne",  label: "Campagne complète",   desc: "Essentiel + 3–5 illustrations secondaires + goodies + visuels réseaux sociaux",       min: 3000, max: 4800, time: "50–80h", rev: 4, preview: "/images/environment-1.jpg", previewH: "h-72", previewPos: "object-center" },
    ],
  },
];

// Flat list pour la recherche par id
export const BASE = BASE_GROUPS.flatMap((g) => g.items);


export const EXTRAS_LIVRABLES = [
  { id: "src_illu",  label: "Fichier source illustration", desc: "PSD/Procreate, calques organisés",             flatMin: 120, flatMax: 120 },
  { id: "src_mise",  label: "Fichier source mise en page", desc: "Illustrator / InDesign éditable",              flatMin: 180, flatMax: 180 },
  { id: "mise_page", label: "Add-on mise en page",         desc: "Typo, motifs, masque vernis, PDF print-ready", flatMin: 240, flatMax: 480 },
];

export const EXTRAS_DIVERS = [
  { id: "urgence",  label: "Urgence (livraison rapide)", desc: "+25% sur le total — faisabilité et délai selon les projets" },
  { id: "rev_sup",  label: "Révision supplémentaire",       desc: "+60–90 € par révision" },
];

// Options pour l'admin : chaque concept avec son groupe
export const BASE_OPTIONS = BASE_GROUPS.flatMap((g) =>
  g.items.map((it) => ({ id: it.id, label: it.label, group: g.group }))
);

export const DROITS = [
  { id: "diffusion", label: "Droit de diffusion",          desc: "Couverture papier, ebook, plateformes de vente", pctMin: 0.30, pctMax: 0.45 },
  { id: "promo",     label: "Droit de promotion",          desc: "Réseaux, pub, bannières, goodies promo",          pctMin: 0.10, pctMax: 0.15 },
  { id: "derives",   label: "Droit d'adaptation/dérivés",  desc: "Merch, traductions, déclinaisons",                pctMin: 0.40, pctMax: 0.80 },
];

export const PACKS = [
  { id: "auto",    label: "Pack auto-édition",     desc: "Diffusion + promotion",                      pctMin: 0.40, pctMax: 0.55 },
  { id: "edition", label: "Pack édition complète", desc: "Diffusion + promotion + exploitation édito (distribution large, durée)", pctMin: 0.70, pctMax: 0.95 },
];

export const EUR_TO_CHF = 0.95;

export function isVideo(src: string) {
  return /\.(mp4|webm|mov)$/i.test(src);
}

export function fmt(n: number) {
  return Math.round(n).toLocaleString("fr-FR");
}
export function chf(eur: number) {
  return fmt(eur * EUR_TO_CHF);
}

// ─── Données de la grille de référence (lecture seule, prose) ─────────────────

export const baseRates = [
  { concept: "Portrait buste", desc: "1 personnage, cadrage serré, fond neutre", eur: "300–480 €", chf: "285–455 CHF", time: "~5–8h", revisions: "1" },
  { concept: "Personnage plein pied", desc: "1 personnage entier, fond simple ou abstrait", eur: "480–600 €", chf: "455–570 CHF", time: "~8–10h", revisions: "2" },
  { concept: "Environnement seul", desc: "Décor complet sans personnage, travail d'ambiance et de lumière", eur: "600–960 €", chf: "570–910 CHF", time: "~10–16h", revisions: "2" },
  { concept: "Personnage + environnement", desc: "1 perso sur décor travaillé, ambiance lumineuse", eur: "840–1 080 €", chf: "800–1 025 CHF", time: "~14–18h", revisions: "2" },
  { concept: "Scène complète", desc: "1–2 personnages + environnement narratif riche", eur: "960–1 320 €", chf: "910–1 255 CHF", time: "~16–22h", revisions: "3" },
  { concept: "Multi-personnages", desc: "3 personnages et plus + décor complet", eur: "1 320–1 920 €", chf: "1 255–1 825 CHF", time: "~22–32h", revisions: "3 (+300–400 €/perso supp.)" },
  { concept: "Illustration de couverture", desc: "Illustration seule destinée à une couverture (mise en page non incluse). Du line art à l'illustration peinte complète.", eur: "240–1 320 €", chf: "230–1 255 CHF", time: "~4–22h", revisions: "2" },
  { concept: "Couverture complète", desc: "Illustration + mise en page menées ensemble, direction artistique globale, fichier print-ready", eur: "1 200–1 800 €", chf: "1 140–1 710 CHF", time: "~20–30h", revisions: "3" },
  { concept: "Mise en page seule", desc: "Sur illustration fournie : typo, motifs, masque vernis, PDF prêt à imprimer", eur: "240–480 €", chf: "230–455 CHF", time: "~4–8h", revisions: "2" },
];

export const rights = [
  { name: "Droit de diffusion", desc: "Couverture papier, copies, ebook, liseuse, plateformes de vente, affichage web. Le droit de base de toute couverture.", rate: "+30–45%" },
  { name: "Droit de promotion", desc: "Réseaux sociaux, publicité, bannières, goodies promotionnels non vendus. Limité au cadre promo du livre concerné.", rate: "+10–15%" },
  { name: "Droit d'adaptation / dérivés", desc: "Merchandising vendu, traductions, déclinaisons, adaptations. À négocier selon l'ampleur.", rate: "+40–80%" },
];

export const packsRef = [
  { name: "Pack auto-édition", desc: "Diffusion + promotion. Pour l'auteur qui vend lui-même son livre.", rate: "+40–55%" },
  { name: "Pack édition complète", desc: "Diffusion + promotion, exploitation par une structure éditoriale (distribution large, durée). Dérivés en sus.", rate: "+70–95%" },
];

export const directionArtistique = {
  desc: "Pour les projets crowdfunding (Ulule, KissKissBankBank…) ou toute création nécessitant une vision globale cohérente : identité visuelle du projet, illustrations multiples, visuels de campagne.",
  inclus: [
    { label: "Direction artistique", detail: "Palette, ambiance, charte visuelle du projet" },
    { label: "Illustration principale", detail: "Couverture ou visuel hero, mise en page incluse" },
    { label: "Illustrations secondaires", detail: "Vignettes, séparateurs, illustrations de paliers (2 à 5 selon formule)" },
    { label: "Visuels campagne", detail: "Bannière Ulule/KKBB, visuels réseaux sociaux (formats adaptés)" },
    { label: "Goodies exclusifs", detail: "Ex-libris, marque-pages, carte postale — selon paliers" },
    { label: "Révisions coordonnées", detail: "Retours groupés pour maintenir la cohérence de l'ensemble" },
  ],
  formules: [
    { name: "Essentiel", desc: "DA + illustration principale + 2 visuels secondaires + bannière campagne", eur: "1 500–2 400 €", chf: "1 425–2 280 CHF" },
    { name: "Campagne complète", desc: "Essentiel + 3–5 illustrations secondaires + goodies (2 formats) + réseaux", eur: "3 000–4 800 €", chf: "2 850–4 560 CHF" },
    { name: "Sur mesure", desc: "Projet d'envergure, catalogue d'illustrations, univers complet. Devis après brief.", eur: "Sur devis", chf: "Sur devis" },
  ],
};

export const extras = [
  { label: "Fichier source illustration", desc: "PSD/Procreate, calques organisés", price: "+120 € / +115 CHF" },
  { label: "Fichier source mise en page", desc: "Illustrator / InDesign éditable", price: "+180 € / +170 CHF" },
  { label: "Add-on mise en page", desc: "Typo, motifs, masque vernis, PDF print-ready", price: "+240–480 € / +230–455 CHF" },
  { label: "Urgence", desc: "Livraison rapide — faisabilité et délai selon les projets", price: "+25%" },
  { label: "Révision supplémentaire", desc: "Au-delà du quota inclus", price: "60–90 € / 57–86 CHF" },
];
