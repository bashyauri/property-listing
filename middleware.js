// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/** Public routes – must stay accessible without login */
const PUBLIC_PATHS = ["/", "/properties", "/api/auth", "/favicon.ico"];

/** Protected routes – only these need authentication */
const PROTECTED_PATHS = [
  "/properties/add",
  "/profile",
  "/properties/saved",
  "/messages",
];

/** Middleware entry point */
export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 1. Skip all static assets, images, _next files, and files with extensions
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Allow public routes (home, /properties, etc.)
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (isPublic) {
    return NextResponse.next();
  }

  // 3. Protect only the defined routes
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (isProtected) {
    // `withAuth` will redirect to login if no session
    return withAuth(req);
  }

  // 4. All other routes – allow (future-proof)
  return NextResponse.next();
}

// Apply middleware to every page except static files
export const config = {
  matcher: [
    // Match all paths except static assets, images, and files with extensions
    "/((?!_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
