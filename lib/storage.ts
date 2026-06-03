// Couche de stockage : Vercel Blob en production, disque local en développement.
// Si BLOB_READ_WRITE_TOKEN est défini (Vercel), on utilise Blob.
// Sinon (PC local sans token), on lit/écrit sur le disque comme avant.

import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const ARTWORKS_KEY = "artworks.json";

// ─── Images ───────────────────────────────────────────────────────────────────

export async function saveImage(filename: string, data: ArrayBuffer): Promise<string> {
  const buffer = Buffer.from(new Uint8Array(data));

  if (useBlob) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`images/${filename}`, buffer, {
      access: "public",
      addRandomSuffix: true,
    });
    return blob.url; // URL absolue
  }

  // Local : écrit dans public/images, renvoie un chemin relatif
  const dir = path.join(process.cwd(), "public", "images");
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/images/${filename}`;
}

// ─── Données galerie (artworks.json) ────────────────────────────────────────────

export async function readArtworks(): Promise<unknown[]> {
  if (useBlob) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: ARTWORKS_KEY });
      const found = blobs.find((b) => b.pathname === ARTWORKS_KEY);
      if (!found) return [];
      const res = await fetch(found.url, { cache: "no-store" });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  // Local
  const dataPath = path.join(process.cwd(), "data", "artworks.json");
  if (!existsSync(dataPath)) return [];
  const raw = await readFile(dataPath, "utf-8");
  return JSON.parse(raw);
}

export async function writeArtworks(data: unknown): Promise<void> {
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    await put(ARTWORKS_KEY, JSON.stringify(data, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  // Local
  const dir = path.join(process.cwd(), "data");
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "artworks.json"), JSON.stringify(data, null, 2));
}
