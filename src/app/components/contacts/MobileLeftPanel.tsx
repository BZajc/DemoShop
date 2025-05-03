"use client";

import { useEffect } from "react";
import LeftPanel from "@/app/components/contacts/LeftPanel";
import { X } from "lucide-react";
import { useContactContext } from "@/app/context/ContactContext";

export default function MobileLeftPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { selectedUserId } = useContactContext();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-white transition-transform duration-300 transform md:hidden shadow-xl overflow-y-auto ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="relative w-full h-full flex flex-col">
        {/* X button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-sky-900 hover:text-sky-500"
            aria-label="Close panel"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contacts*/}
        <div className="flex-1">
          <LeftPanel />
        </div>

        {/* Return to chat */}
        {selectedUserId && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-sky-500 text-white py-2 rounded-full font-medium hover:bg-sky-600 transition"
            >
              Return to chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
