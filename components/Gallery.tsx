"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { isVideo } from "@/lib/pricing";
import Lightbox from "./Lightbox";

export interface Artwork {
  id: number;
  src: string;
  title: string;
  category: "Portraits" | "Environnements" | "Cartes" | "Autres";
  year?: string;
  tall?: boolean;
  usage?: "gallery" | "examples" | "both";
}

interface GalleryProps {
  artworks: Artwork[];
}

const FILTERS = ["Tout", "Portraits", "Environnements", "Cartes", "Autres"] as const;

export default function Gallery({ artworks }: GalleryProps) {
  const [filter, setFilter] = useState<string>("Tout");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = filter === "Tout" ? artworks : artworks.filter((a) => a.category === filter);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevArtwork = () => setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const nextArtwork = () => setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null));

  return (
    <section className="max-w-7xl mx-auto px-6 pb-24">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 text-sm tracking-widest uppercase border transition-all duration-300 ${
              filter === f
                ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                : "border-[#2a2a2a] text-[#8a8070] hover:border-[#c9a84c]/40 hover:text-[#e8e0d0]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((artwork, index) => (
          <div
            key={artwork.id}
            className="break-inside-avoid group relative cursor-pointer overflow-hidden"
            onClick={() => openLightbox(index)}
          >
            <div className="relative overflow-hidden">
              {isVideo(artwork.src) ? (
                <video
                  src={artwork.src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <Image
                  src={artwork.src}
                  alt={artwork.title}
                  width={600}
                  height={artwork.tall ? 900 : 600}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              {/* Badge vidéo */}
              {isVideo(artwork.src) && (
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1">
                  <Play size={11} className="text-[#c9a84c] fill-[#c9a84c]" />
                  <span className="text-[10px] tracking-widest uppercase text-[#e8e0d0]">Vidéo</span>
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-6">
                <p className="font-serif text-2xl text-[#e8e0d0] translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
                  {artwork.title}
                </p>
                <p className="text-sm tracking-widest uppercase text-[#c9a84c] mt-1.5 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  {artwork.category}
                </p>
              </div>
              {/* Gold corner accent */}
              <div className="absolute top-0 right-0 w-8 h-px bg-[#c9a84c] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 right-0 w-px h-8 bg-[#c9a84c] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          artwork={filtered[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={prevArtwork}
          onNext={nextArtwork}
        />
      )}
    </section>
  );
}
