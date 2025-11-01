// authOptions.js
import connectDB from "@/config/database";
import User from "@/models/User";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      try {
        console.log("Attempting to connect to database...");
        await connectDB();
        console.log("Database connected successfully");

        const userExists = await User.findOne({ email: profile.email });
        console.log("User exists:", !!userExists);

        if (!userExists) {
          const username = profile.name.slice(0, 20);
          await User.create({
            email: profile.email,
            username,
            image: profile.picture,
          });
          console.log("New user created");
        }

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        // Allow login even if DB fails in production
        return true;
      }
    },

    async session({ session }) {
      try {
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          session.user.id = user._id.toString();
        }
        return session;
      } catch (error) {
        console.error("Session error:", error);
        // Return session even without DB lookup
        return session;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug logs
};
