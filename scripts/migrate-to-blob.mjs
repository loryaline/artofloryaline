// Migration unique : pousse les images locales (public/images) + data/artworks.json
// vers Vercel Blob. À lancer une seule fois après avoir connecté le Blob.
//
// Usage (Node 20+) :
//   node --env-file=.env.local scripts/migrate-to-blob.mjs
//
// Pré-requis : BLOB_READ_WRITE_TOKEN doit être présent dans .env.local
// (récupère-le sur Vercel → Storage → ton Blob → onglet ".env.local", ou via `vercel env pull`).

import { put } from "@vercel/blob";
import { readFile } from "fs/promises";
import path from "path";

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("❌ BLOB_READ_WRITE_TOKEN manquant. Ajoute-le dans .env.local puis relance.");
  process.exit(1);
}

const root = process.cwd();
const dataPath = path.join(root, "data", "artworks.json");
const artworks = JSON.parse(await readFile(dataPath, "utf-8"));

let migrated = 0;
for (const art of artworks) {
  if (!art.src || !art.src.startsWith("/images/")) continue;
  const filename = art.src.replace("/images/", "");
  try {
    const buf = await readFile(path.join(root, "public", "images", filename));
    const blob = await put(`images/${filename}`, buf, {
      access: "public",
      addRandomSuffix: true,
      token,
    });
    art.src = blob.url;
    migrated++;
    console.log(`✓ ${filename}`);
  } catch {
    console.warn(`⚠ fichier introuvable, ignoré : ${filename}`);
  }
}

await put("artworks.json", JSON.stringify(artworks, null, 2), {
  access: "public",
  addRandomSuffix: false,
  allowOverwrite: true,
  contentType: "application/json",
  token,
});

console.log(`\n✅ Terminé : ${migrated} image(s) + artworks.json migrés vers le Blob.`);
console.log("Ta galerie en ligne devrait maintenant afficher toutes tes œuvres.");
