"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import ActiveLink from "./ActiveLink";
import LogoutButton from "./LogoutButton";

interface MobileNavProps {
  profilePath: string;
}

export default function MobileNav({ profilePath }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Remove scroll on body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Funkcja zamykająca menu przy kliknięciu linka
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Burger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-full bg-white border-2 border-black p-2"
      >
        <Menu size={28} />
      </button>

      {/* Full screen navigation menu */}
      <div
        className={`fixed top-0 left-0 h-[100vh] w-[100vw] bg-sky-900 z-50 p-6 transform overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-white"
        >
          <X size={32} />
        </button>

        {/* Navigation content */}
        <div className="flex flex-col items-center mt-4">
          {/* Logo */}
          <Image
            src="/images/picbookLogo.png"
            alt="picbook logo"
            width={60}
            height={60}
            className="mb-8"
          />

          {/* Links */}
          <ul className="flex flex-col items-center gap-6 text-lg">
            <ActiveLink
              href={profilePath}
              label="Profile"
              iconName="profile"
              onClick={() => setIsOpen(false)}
            />
            <ActiveLink
              href="/feed"
              label="Feed"
              iconName="feed"
              onClick={() => setIsOpen(false)}
            />
            <ActiveLink
              href="/contacts"
              label="Contacts"
              iconName="contacts"
              onClick={() => setIsOpen(false)}
            />
            <ActiveLink
              href="/collections"
              label="Collections"
              iconName="collections"
              onClick={() => setIsOpen(false)}
            />
            <ActiveLink
              href="/follows"
              label="Follows"
              iconName="diamond"
              onClick={() => setIsOpen(false)}
            />
            <ActiveLink
              href="/settings/privacy"
              label="Settings"
              iconName="settings"
              onClick={() => setIsOpen(false)}
            />
            <ActiveLink
              href="/123"
              label="Github Docs"
              iconName="github"
              onClick={() => setIsOpen(false)}
            />
          </ul>

          {/* Logout button */}
          <div className="mt-8">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
