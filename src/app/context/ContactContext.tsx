"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ContactContextType {
  selectedUserId: string | null;
  setSelectedUserId: (id: string) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <ContactContext.Provider value={{ selectedUserId, setSelectedUserId }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContactContext() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContactContext must be used within a ContactProvider");
  }
  return context;
}
