import { House } from "lucide-react";
import Link from "next/link";
import LeftPanel from "@/app/components/contacts/LeftPanel";
import ChatWindow from "@/app/components/contacts/ChatWindow";
import { ContactProvider } from "@/app/context/ContactContext";

export default function ContactsPage() {
  return (
      <ContactProvider>
        <div className="h-screen max-h-screen flex flex-col">
          {/* Header with home button */}
          <header className="flex items-center p-4 border-b border-gray-200">
            <Link
              href="/feed"
              className="p-3 rounded-full bg-sky-400 text-white border-2 border-sky-400 hover:bg-white hover:text-sky-400 transition-all duration-300"
            >
              <House size={24} />
            </Link>
            <h1 className="ml-4 text-xl font-semibold text-sky-900">
              Contacts
            </h1>
          </header>

          {/* Main layout: left - contacts, right - chat */}
          <div className="flex flex-1 overflow-hidden">
            <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
              <LeftPanel />
            </div>
            <div className="w-2/3 bg-white overflow-y-auto">
              <ChatWindow />
            </div>
          </div>
        </div>
      </ContactProvider>
  );
}
