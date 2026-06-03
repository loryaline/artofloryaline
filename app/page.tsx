import Gallery, { type Artwork } from "@/components/Gallery";
import Engagements from "@/components/Engagements";
import { readArtworks } from "@/lib/storage";

export const dynamic = "force-dynamic";

async function getArtworks(): Promise<Artwork[]> {
  const all = (await readArtworks()) as (Artwork & { usage?: string })[];
  // N'afficher dans la galerie que les œuvres avec fichier, marquées "gallery" ou "both"
  return all.filter((a) => a.src && (a.usage ?? "both") !== "examples");
}

export default async function HomePage() {
  const artworks = await getArtworks();
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/environment-1.jpg')",
            filter: "brightness(0.3)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/40 via-transparent to-[#080808]" />

        <div className="relative text-center px-6 fade-in-up">
          <p className="text-sm tracking-[0.4em] uppercase text-[#c9a84c] mb-6">
            Portraits · Fantasy · Aventure
          </p>
          <h1 className="font-serif text-7xl md:text-9xl font-light leading-none text-[#e8e0d0] mb-8">
            Nées de<br />
            <span className="italic text-[#c9a84c]">l&apos;obscurité</span>
          </h1>
          <p className="text-[#8a8070] text-lg tracking-wider max-w-sm mx-auto leading-relaxed">
            Portraits semi-réalistes claroscuro & univers fantasy médiéval
          </p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#8a8070]">Découvrir</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#c9a84c] to-transparent" />
        </div>
      </section>

      {/* Gallery section */}
      <div className="text-center pt-24 pb-16 px-6">
        <p className="text-sm tracking-[0.4em] uppercase text-[#c9a84c] mb-3">Collections</p>
        <h2 className="font-serif text-5xl md:text-6xl font-light text-[#e8e0d0]">
          Galerie
        </h2>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="w-16 h-px bg-[#c9a84c]/30" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a84c]/60" />
          <div className="w-16 h-px bg-[#c9a84c]/30" />
        </div>
      </div>

      <Gallery artworks={artworks} />

      {/* Engagements */}
      <div className="mt-32">
        <Engagements />
      </div>
    </main>
  );
}
