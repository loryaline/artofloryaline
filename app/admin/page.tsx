"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Trash2, Upload, Edit2, Check, X, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { BASE_OPTIONS, isVideo } from "@/lib/pricing";

type Usage = "gallery" | "examples" | "both";

interface Artwork {
  id: number;
  src: string;
  title: string;
  category: "Portraits" | "Environnements" | "Cartes" | "Autres";
  year: string;
  tall: boolean;
  usage: Usage;
  exampleFor?: string; // id de la prestation illustrée dans le simulateur
}

const CATEGORIES = ["Portraits", "Environnements", "Cartes", "Autres"] as const;

const USAGES: { value: Usage; label: string }[] = [
  { value: "gallery", label: "Galerie" },
  { value: "examples", label: "Exemples" },
  { value: "both", label: "Les deux" },
];

function ExamplePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  // Regroupe les options par groupe pour un <optgroup>
  const groups = [...new Set(BASE_OPTIONS.map((o) => o.group))];
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#0f0f0f] border border-[#c9a84c]/30 text-[10px] text-[#e8e0d0] py-1.5 px-2 focus:outline-none focus:border-[#c9a84c]/60"
    >
      <option value="">Prestation illustrée… (toutes)</option>
      {groups.map((g) => (
        <optgroup key={g} label={g}>
          {BASE_OPTIONS.filter((o) => o.group === g).map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

function UsagePicker({ value, onChange }: { value: Usage; onChange: (u: Usage) => void }) {
  return (
    <div className="flex border border-[#2a2a2a]">
      {USAGES.map((u) => (
        <button
          key={u.value}
          type="button"
          onClick={() => onChange(u.value)}
          className={`flex-1 py-1.5 text-[10px] tracking-wider uppercase transition-colors ${
            value === u.value ? "bg-[#c9a84c] text-[#080808]" : "text-[#8a8070] hover:text-[#e8e0d0]"
          }`}
        >
          {u.label}
        </button>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Artwork>>({});
  const [pendingFiles, setPendingFiles] = useState<{ file: File; preview: string; title: string; category: Artwork["category"]; year: string; tall: boolean; usage: Usage; exampleFor: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchArtworks = useCallback(async () => {
    const res = await fetch("/api/artworks");
    setArtworks(await res.json());
  }, []);

  useEffect(() => { fetchArtworks(); }, [fetchArtworks]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const year = new Date().getFullYear().toString();
    const newPending = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "),
      category: "Portraits" as Artwork["category"],
      year,
      tall: false,
      usage: "both" as Usage,
      exampleFor: "",
    }));
    setPendingFiles((prev) => [...prev, ...newPending]);
  };

  const uploadAll = async () => {
    if (!pendingFiles.length) return;
    setUploading(true);
    setUploadError(null);
    try {
      for (const item of pendingFiles) {
        const safeName = item.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        // Upload direct navigateur → Blob (pas de limite de taille serveur)
        const blob = await upload(`images/${safeName}`, item.file, {
          access: "public",
          handleUploadUrl: "/api/blob-upload",
          contentType: item.file.type || undefined,
        });
        await fetch("/api/artworks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ src: blob.url, title: item.title, category: item.category, year: item.year, tall: item.tall, usage: item.usage, exampleFor: item.exampleFor }),
        });
      }
      setPendingFiles([]);
      fetchArtworks();
    } catch (e) {
      setUploadError((e as Error).message || "Échec de l'upload. Réessaie.");
    } finally {
      setUploading(false);
    }
  };

  const deleteArtwork = async (id: number) => {
    if (!confirm("Supprimer cette illustration ?")) return;
    await fetch("/api/artworks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchArtworks();
  };

  // Déplace une œuvre dans l'ordre d'affichage (dir = -1 plus tôt, +1 plus tard)
  const moveArtwork = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= artworks.length) return;
    const next = [...artworks];
    [next[index], next[target]] = [next[target], next[index]];
    setArtworks(next); // maj optimiste immédiate
    await fetch("/api/artworks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((a) => a.id) }),
    });
  };

  const startEdit = (artwork: Artwork) => {
    setEditingId(artwork.id);
    setEditForm({ title: artwork.title, category: artwork.category, year: artwork.year, tall: artwork.tall, usage: artwork.usage, exampleFor: artwork.exampleFor ?? "" });
  };

  const saveEdit = async (id: number) => {
    await fetch("/api/artworks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...editForm }),
    });
    setEditingId(null);
    fetchArtworks();
  };

  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-[#c9a84c] mb-2">Administration</p>
            <h1 className="font-serif text-4xl font-light text-[#e8e0d0]">Galerie</h1>
          </div>
          <a href="/" className="text-xs tracking-widest uppercase text-[#8a8070] hover:text-[#c9a84c] transition-colors">
            Voir le site →
          </a>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-none transition-all duration-300 cursor-pointer flex flex-col items-center justify-center py-16 mb-10 ${
            dragOver
              ? "border-[#c9a84c] bg-[#c9a84c]/5"
              : "border-[#2a2a2a] hover:border-[#c9a84c]/40 hover:bg-[#0f0f0f]"
          }`}
        >
          <Upload size={32} className={`mb-4 transition-colors ${dragOver ? "text-[#c9a84c]" : "text-[#3a3028]"}`} />
          <p className="font-serif text-xl text-[#e8e0d0] mb-2">Dépose tes illustrations ici</p>
          <p className="text-xs text-[#8a8070] tracking-wider">ou clique pour sélectionner — JPG, PNG, WEBP, MP4</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Pending uploads */}
        {pendingFiles.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs tracking-widest uppercase text-[#c9a84c]">
                {pendingFiles.length} image{pendingFiles.length > 1 ? "s" : ""} en attente
              </p>
              <button
                onClick={uploadAll}
                disabled={uploading}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#c9a84c] text-[#080808] text-xs tracking-widest uppercase hover:bg-[#e2c97e] transition-colors disabled:opacity-50"
              >
                <Plus size={14} />
                {uploading ? "Upload en cours…" : "Tout publier"}
              </button>
            </div>
            {uploadError && (
              <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/5 px-4 py-2 mb-4">{uploadError}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pendingFiles.map((item, i) => (
                <div key={i} className="border border-[#1e1e1e] p-3 space-y-3">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#0f0f0f]">
                    {item.file.type.startsWith("video/") ? (
                      <video src={item.preview} muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <Image src={item.preview} alt={item.title} fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => setPendingFiles((prev) => prev.map((p, j) => j === i ? { ...p, title: e.target.value } : p))}
                    className="w-full bg-transparent border-b border-[#2a2a2a] text-sm text-[#e8e0d0] py-1 focus:outline-none focus:border-[#c9a84c]/60 placeholder:text-[#3a3028]"
                    placeholder="Titre"
                  />
                  <select
                    value={item.category}
                    onChange={(e) => setPendingFiles((prev) => prev.map((p, j) => j === i ? { ...p, category: e.target.value as Artwork["category"] } : p))}
                    className="w-full bg-[#0f0f0f] border-b border-[#2a2a2a] text-xs text-[#8a8070] py-1 focus:outline-none focus:border-[#c9a84c]/60"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <UsagePicker
                    value={item.usage}
                    onChange={(u) => setPendingFiles((prev) => prev.map((p, j) => j === i ? { ...p, usage: u } : p))}
                  />
                  {item.usage !== "gallery" && (
                    <ExamplePicker
                      value={item.exampleFor}
                      onChange={(id) => setPendingFiles((prev) => prev.map((p, j) => j === i ? { ...p, exampleFor: id } : p))}
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.tall}
                        onChange={(e) => setPendingFiles((prev) => prev.map((p, j) => j === i ? { ...p, tall: e.target.checked } : p))}
                        className="accent-[#c9a84c]"
                      />
                      <span className="text-[10px] text-[#8a8070] tracking-wider">Portrait (tall)</span>
                    </label>
                    <button
                      onClick={() => setPendingFiles((prev) => prev.filter((_, j) => j !== i))}
                      className="text-[#3a3028] hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-6 mb-10">
          <div className="flex-1 h-px bg-[#1e1e1e]" />
          <p className="text-xs tracking-[0.3em] uppercase text-[#5a5040]">
            {artworks.length} illustration{artworks.length !== 1 ? "s" : ""} publiée{artworks.length !== 1 ? "s" : ""}
          </p>
          <div className="flex-1 h-px bg-[#1e1e1e]" />
        </div>

        {/* Published artworks */}
        {artworks.length === 0 ? (
          <p className="text-center text-[#3a3028] text-sm py-16">Aucune illustration publiée.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artworks.map((artwork, index) => (
              <div key={artwork.id} className="border border-[#1e1e1e] p-3 group">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#0f0f0f] mb-3">
                  {!artwork.src ? (
                    <div className="absolute inset-0 flex items-center justify-center text-center px-2">
                      <span className="text-[10px] tracking-widest uppercase text-red-500/70">Fichier manquant</span>
                    </div>
                  ) : isVideo(artwork.src) ? (
                    <video src={artwork.src} muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <Image src={artwork.src} alt={artwork.title} fill className="object-cover" unoptimized />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => moveArtwork(index, -1)}
                      disabled={index === 0}
                      title="Déplacer plus tôt"
                      className="p-2 border border-[#c9a84c]/60 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <button onClick={() => startEdit(artwork)} className="p-2 border border-[#c9a84c]/60 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => deleteArtwork(artwork.id)} className="p-2 border border-red-500/60 text-red-500 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() => moveArtwork(index, 1)}
                      disabled={index === artworks.length - 1}
                      title="Déplacer plus tard"
                      className="p-2 border border-[#c9a84c]/60 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {editingId === artwork.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editForm.title ?? ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full bg-transparent border-b border-[#c9a84c]/40 text-sm text-[#e8e0d0] py-0.5 focus:outline-none"
                    />
                    <select
                      value={editForm.category ?? "Autres"}
                      onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value as Artwork["category"] }))}
                      className="w-full bg-[#0f0f0f] border-b border-[#2a2a2a] text-xs text-[#8a8070] py-0.5 focus:outline-none"
                    >
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <UsagePicker
                      value={editForm.usage ?? "both"}
                      onChange={(u) => setEditForm((f) => ({ ...f, usage: u }))}
                    />
                    {(editForm.usage ?? "both") !== "gallery" && (
                      <ExamplePicker
                        value={editForm.exampleFor ?? ""}
                        onChange={(id) => setEditForm((f) => ({ ...f, exampleFor: id }))}
                      />
                    )}
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => saveEdit(artwork.id)} className="flex-1 py-1 bg-[#c9a84c]/20 text-[#c9a84c] text-xs flex items-center justify-center gap-1 hover:bg-[#c9a84c]/30">
                        <Check size={12} /> Sauver
                      </button>
                      <button onClick={() => setEditingId(null)} className="flex-1 py-1 border border-[#2a2a2a] text-[#8a8070] text-xs flex items-center justify-center gap-1 hover:border-[#5a5040]">
                        <X size={12} /> Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-[#e8e0d0] truncate">{artwork.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] tracking-widest uppercase text-[#c9a84c]">{artwork.category}</span>
                      <span className="text-[10px] tracking-widest uppercase text-[#5a5040]">
                        · {USAGES.find((u) => u.value === (artwork.usage ?? "both"))?.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
