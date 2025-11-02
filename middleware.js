export { default } from "next-auth/middleware";

export const config = {
  // This is a NEGATIVE LOOKAHEAD regex pattern.
  // It applies the middleware to ALL paths (*)
  // EXCEPT for those inside the negative lookahead: (?!...)
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|/|properties|about|register).*)",
  ],
};

/*
Explanation of Exclusions:
1.  api/auth: NextAuth's own API routes (must be public)
2.  _next/static: Static assets (JS, CSS, fonts)
3.  _next/image: Image optimization files
4.  favicon.ico: Browser icon
5.  /: The homepage/root path
6.  properties: An example of a public route you likely want excluded.
7.  about / register: Any other public routes.

*Make sure to include ALL your intended public paths in this exclusion list.*
*/
