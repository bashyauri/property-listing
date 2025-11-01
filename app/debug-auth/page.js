// app/debug-auth/page.js
"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function DebugAuth() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
  }, [session, status]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Auth Debug Page</h1>
      <p>Status: {status}</p>
      <p>Has session: {session ? "Yes" : "No"}</p>
      <p>User email: {session?.user?.email}</p>
      <p>User ID: {session?.user?.id}</p>

      {!session ? (
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      ) : (
        <button onClick={() => signOut()}>Sign out</button>
      )}
    </div>
  );
}
