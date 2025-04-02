import { ContactProvider } from "@/app/context/ContactContext";
import LeftPanel from "@/app/components/contacts/LeftPanel";
import { House } from "lucide-react";
import Link from "next/link";

export default function ContactsPage() {
  return (
    <ContactProvider>
      <div className="h-screen max-h-screen flex flex-col">
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

        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
            <LeftPanel />
          </div>
          <div className="w-2/3 flex items-center justify-center text-sky-900">
            Select a conversation to start chatting
          </div>
        </div>
      </div>
    </ContactProvider>
  );
}
