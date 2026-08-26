import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// Upload direct navigateur → Vercel Blob (contourne la limite 4,5 Mo des routes serveur).
// Le token n'est délivré qu'aux requêtes authentifiées (Basic Auth de l'admin).

function checkAuth(request: Request): boolean {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return false;
  try {
    const [u, p] = atob(auth.slice(6)).split(":");
    return u === (process.env.ADMIN_USER || "lory") && p === (process.env.ADMIN_PASSWORD || "change-moi");
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!checkAuth(request)) throw new Error("Non autorisé");
        return {
          allowedContentTypes: [
            "image/jpeg", "image/png", "image/webp", "image/gif",
            "video/mp4", "video/webm", "video/quicktime",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 200 * 1024 * 1024, // 200 Mo
        };
      },
      onUploadCompleted: async () => {
        // Rien à faire : les métadonnées sont enregistrées côté admin via /api/artworks.
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
