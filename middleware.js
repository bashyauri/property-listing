import NextAuth from "next-auth/middleware";

export default NextAuth();

export const config = {
  matcher: ["/properties/add", "/profile", "/properties/saved", "/messages"],
};
