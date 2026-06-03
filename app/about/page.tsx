import Image from "next/image";
import Link from "next/link";
import { readdirSync } from "fs";
import path from "path";
import ClientCarousel, { type Client } from "@/components/ClientCarousel";
import Engagements from "@/components/Engagements";

// Noms lisibles pour les fichiers connus ; sinon on dérive du nom de fichier
const CLIENT_NAMES: Record<string, string> = {
  "chenereveeditionslogo.png": "Chêne Revé Éditions",
  "litmaginariumlogo.png": "Litmaginarium",
  "logo_hets.svg": "HETS Genève",
  "logoplanlesouates.svg": "Commune de Plan-les-Ouates",
  "Logo-blanc-dates-2026.png": "Festival 2026",
  "Logo_rt.svg": "RT",
};

function getClients(): Client[] {
  try {
    const dir = path.join(process.cwd(), "public", "clients");
    return readdirSync(dir)
      .filter((f) => /\.(png|jpe?g|svg|webp)$/i.test(f))
      .map((f) => ({
        src: `/clients/${f}`,
        name: CLIENT_NAMES[f] ?? f.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "),
      }));
  } catch {
    return [];
  }
}

export const metadata = {
  title: "À propos — Art of LoryAline",
  description: "LoryAline, illustratrice : portraits claroscuro et univers fantasy. Bachelor en Game Art, formée en histoire de l'art.",
};

export default function AboutPage() {
  const clients = getClients();
  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm tracking-[0.4em] uppercase text-[#c9a84c] mb-3">L&apos;Artiste</p>
          <h1 className="font-serif text-6xl md:text-7xl font-light text-[#e8e0d0]">À propos</h1>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="w-16 h-px bg-[#c9a84c]/30" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a84c]/60" />
            <div className="w-16 h-px bg-[#c9a84c]/30" />
          </div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <div className="relative md:sticky md:top-28">
            <div className="relative overflow-hidden">
              <Image
                src="/images/loryaline.jpg"
                alt="LoryAline, illustratrice"
                width={600}
                height={800}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 to-transparent" />
            </div>
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-[#c9a84c]/20 -z-10" />
          </div>

          {/* Text */}
          <div className="space-y-8">
            <div>
              <p className="font-serif text-4xl md:text-5xl font-light text-[#e8e0d0] leading-snug mb-6">
                Capturer la lumière<br />
                <span className="italic text-[#c9a84c]">dans l&apos;obscurité</span>
              </p>
              <p className="text-[#8a8070] leading-relaxed text-base">
                Je suis <span className="text-[#e8e0d0]">LoryAline</span>, illustratrice spécialisée dans le portrait
                semi-réaliste et l&apos;illustration fantasy. Mon travail repose sur le clair-obscur — ce jeu d&apos;ombre
                et de lumière qui donne du poids à chaque scène et fait naître l&apos;émotion sur le visage de mes personnages.
              </p>
            </div>

            <div className="space-y-4 text-base text-[#8a8070] leading-relaxed">
              <p>
                Le clair-obscur de{" "}<span className="text-[#e8e0d0]">Caravage</span>{" "}est une obsession : cette manière de rendre
                chaque scène grave, importante, presque sacrée. C&apos;est ce que je cherche à retrouver dans mes portraits —
                des regards qui parlent, des émotions profondes, des atmosphères denses où la magie affleure sous la surface.
              </p>
              <p>
                Mon univers se nourrit d&apos;un mélange singulier : la culture du <span className="text-[#e8e0d0]">jeu vidéo</span>,
                l&apos;<span className="text-[#e8e0d0]">histoire de l&apos;art</span>{" "}et mon amour de la peinture académique.
                Diplômée d&apos;un <span className="text-[#e8e0d0]">Bachelor of Art en Game Art &amp; animation 3D</span>{" "}à
                Middlesex University, complété par un cursus en histoire de l&apos;art et arts visuels, je mêle la rigueur de la
                composition et de la lumière 3D à la sensibilité de la peinture traditionnelle.
              </p>
              <p>
                Cette double formation me permet aussi une chose rare : être à la fois{" "}
                <span className="text-[#e8e0d0]">illustratrice et graphiste</span>. Je peux mener un projet de bout en bout —
                de l&apos;illustration à la mise en page — et livrer une couverture ou une direction artistique complète, clé en main.
              </p>
              <p>
                Je travaille par ailleurs chez <span className="text-[#e8e0d0]">Adobe</span>, où j&apos;exerce en tant que{" "}
                <span className="text-[#e8e0d0]">product manager</span>. Je maîtrise donc l&apos;ensemble des outils nécessaires
                au bon déroulement d&apos;un projet créatif, et j&apos;apporte un professionnalisme accru dans la{" "}
                <span className="text-[#e8e0d0]">gestion de projet</span>{" : "}briefs clairs, jalons respectés, communication fluide.
                Tu bénéficies d&apos;une artiste, mais aussi d&apos;une cheffe de projet rigoureuse.
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {["Portraits", "Clair-obscur", "Fantasy", "Couvertures", "Direction artistique", "Game Art", "Cartes", "Gestion de projet"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs tracking-widest uppercase border border-[#2a2a2a] text-[#8a8070] px-4 py-2"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/commissions"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-[#c9a84c] text-[#c9a84c] text-sm tracking-widest uppercase hover:bg-[#c9a84c] hover:text-[#080808] transition-all duration-300"
              >
                Commander une illustration
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-[#2a2a2a] text-[#8a8070] text-sm tracking-widest uppercase hover:border-[#c9a84c]/40 hover:text-[#e8e0d0] transition-all duration-300"
              >
                Voir la galerie
              </Link>
            </div>
          </div>
        </div>

        {/* Clients */}
        <div className="mt-32">
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.4em] uppercase text-[#c9a84c] mb-3">Ils m&apos;ont fait confiance</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#e8e0d0]">Quelques collaborations</h2>
            <p className="text-[#8a8070] text-base mt-4 max-w-xl mx-auto leading-relaxed">
              Couvertures de romans, illustrations jeunesse, projets institutionnels et campagnes de financement participatif.
            </p>
          </div>
          <ClientCarousel clients={clients} />
        </div>

        {/* Engagements */}
        <div className="mt-32">
          <Engagements />
        </div>
      </div>
    </main>
  );
}
