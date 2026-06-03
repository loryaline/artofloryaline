import { NextRequest, NextResponse } from "next/server";

// Identifiants admin (à définir dans les variables d'environnement).
// Valeurs par défaut de secours — À CHANGER via ADMIN_USER / ADMIN_PASSWORD.
const USER = process.env.ADMIN_USER || "lory";
const PASSWORD = process.env.ADMIN_PASSWORD || "change-moi";

function unauthorized() {
  return new NextResponse("Authentification requise.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin Art of LoryAline"' },
  });
}

function isAuthorized(req: NextRequest): boolean {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;
  try {
    const [user, pass] = atob(header.slice(6)).split(":");
    return user === USER && pass === PASSWORD;
  } catch {
    return false;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /api/artworks : seules les modifications sont protégées (GET reste public)
  if (pathname.startsWith("/api/artworks") && req.method === "GET") {
    return NextResponse.next();
  }

  if (!isAuthorized(req)) return unauthorized();
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/upload/:path*", "/api/artworks/:path*"],
};
