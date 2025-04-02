"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ContactContextType {
  selectedUserId: string | null;
  setSelectedUserId: (id: string) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

interface ContactProviderProps {
  children: ReactNode;
  selectedUserId?: string | null;
}

export function ContactProvider({ children, selectedUserId: initialId }: ContactProviderProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialId ?? null);

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