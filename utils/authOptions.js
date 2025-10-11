import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/database";
import User from "@/models/User";

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
    //   Invoked on successful signin
    async signIn({ profile }) {
      // connect to database
      await connectDB();
      //   Check if user exists
      const userExists = await User.findOne({ email: profile.email });
      //   if not,create user
      if (!userExists) {
        // trucate user if too long
        await User.create({
          email: profile.email,
          username: profile.name.slice(0, 20).toLowerCase(),
          image: profile.picture,
        });
      }
      // return true to allow sign in
      return true;
    },
    //   Session callback function that modifies the session object
    async session({ session }) {
      //    get user from database
      const user = await User.findOne({ email: session.user.email });
      // Assign user id from the session
      session.user.id = user._id.toString();
      // Return session
      return session;
    },
  },
};
