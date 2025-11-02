// src/middleware.ts   (create this file in the project root)
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// ------------------------------------------------------------------
// 1. List of routes that MUST stay public (no redirect to login)
// ------------------------------------------------------------------
const PUBLIC_PATHS = ["/", "/properties", "/api/auth", "/favicon.ico"];

// ------------------------------------------------------------------
// 2. The matcher you already had – only these need protection
// ------------------------------------------------------------------
const PROTECTED_MATCHER = [
  "/properties/add",
  "/profile",
  "/properties/saved",
  "/messages",
];

// ------------------------------------------------------------------
// 3. Custom middleware that runs *before* next-auth’s withAuth
// ------------------------------------------------------------------
export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ----- Allow static / _next files unconditionally -----
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") // any file with an extension
  ) {
    return NextResponse.next();
  }

  // ----- Public routes – bypass auth completely -----
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ----- Protected routes – run next-auth’s withAuth -----
  if (PROTECTED_MATCHER.some((p) => pathname.startsWith(p))) {
    // `withAuth` will redirect to /api/auth/signin?callbackUrl=…
    return withAuth(req);
  }

  // Anything else (future routes) – just continue
  return NextResponse.next();
}

// ------------------------------------------------------------------
// 4. Matcher – apply to *everything* (we filter inside the function)
// ------------------------------------------------------------------
export const config = {
  matcher: ["/((?!_next/image|_next/static|favicon.ico).*)"],
};
