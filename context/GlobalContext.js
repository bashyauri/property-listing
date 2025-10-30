"use client";
import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

// Create provider
export function GlobalProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

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
