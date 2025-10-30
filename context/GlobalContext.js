"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import getUnreadMessageCount from "@/app/actions/getUnreadMessageCount";

const GlobalContext = createContext();

// Create provider
export function GlobalProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();
  useEffect(() => {
    if (session && session.user) {
      async function fetchUnreadCount() {
        const result = await getUnreadMessageCount();
        if (result && result.unreadCount !== undefined) {
          setUnreadCount(result.unreadCount);
        }
      }
      fetchUnreadCount();
    }
  }, [getUnreadMessageCount, session]);

  return (
    <GlobalContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </GlobalContext.Provider>
  );
}

// Custom hook to use the GlobalContext
export function useGlobalContext() {
  return useContext(GlobalContext);
}
