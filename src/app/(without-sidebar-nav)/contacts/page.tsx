"use client";

import { useState } from "react";
import { ContactProvider } from "@/app/context/ContactContext";
import LeftPanel from "@/app/components/contacts/LeftPanel";
import MobileLeftPanel from "@/app/components/contacts/MobileLeftPanel";
import { House, Menu } from "lucide-react";
import Link from "next/link";

export default function ContactsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ContactProvider>
      <div className="h-screen max-h-screen flex flex-col animate-fade-in">
        {/* (mobile) menu button in top right corner */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden fixed top-4 right-4 z-50 bg-white rounded-full p-2 shadow border border-gray-300 text-sky-900 hover:text-sky-600"
          aria-label="Open contacts"
        >
          <Menu size={24} />
        </button>

        <MobileLeftPanel isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

        <header className="flex items-center p-4 border-b border-gray-200">
          <Link
            href="/feed"
            className="p-3 rounded-full bg-sky-400 text-white border-2 border-sky-400 hover:bg-white hover:text-sky-400 transition-all duration-300"
          >
            <House size={24} />
          </Link>
          <h1 className="ml-4 text-xl font-semibold text-sky-900">Contacts</h1>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block w-1/3 bg-white border-r overflow-y-auto">
            <LeftPanel />
          </div>
          <div className="w-full md:w-2/3 flex flex-col items-center justify-center text-sky-900 gap-4 p-4">
            <p className="text-lg">Select a conversation to start chatting</p>
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden bg-sky-500 text-white px-4 py-2 rounded-full shadow hover:bg-sky-600"
            >
              Open chat list
            </button>
          </div>
        </div>
      </div>
    </ContactProvider>
  );
}
