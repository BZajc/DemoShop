"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Home, ShoppingCart, Info, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchModal from "./SearchModal";

export default function MainNav() {
  const pathname = usePathname();
  const isSignPage = pathname === "/sign";

  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [inputVisible, setInputVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!inputRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setInputVisible(entry.contentRect.width >= 150);
    });
    observer.observe(inputRef.current);
    return () => observer.disconnect();
  }, []);

  if (isSignPage) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/60 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
        {/* Logo + title */}
        <Link href="/home" className="flex items-center gap-2 shrink-0">
          <Image
            src="/DemoShopLogoTransparent.png"
            alt="DemoShop logo"
            width={48}
            height={48}
            className="object-contain"
          />
          <span
            className={`text-xl font-bold hidden lg:inline transition-colors duration-300 ${
              scrolled ? "text-brown-700" : "text-white dark:text-white"
            }`}
          >
            DemoShop
          </span>
        </Link>

        {/* Navigation links */}
        <ul
          className={`hidden md:flex gap-6 text-sm font-medium transition-colors duration-200 ${
            scrolled ? "text-brown-800 dark:text-brown-300" : "text-white"
          }`}
        >
          <li>
            <Link
              href="#home"
              className="flex items-center gap-1 hover:text-blue-400 transition-all duration-300 hover:scale-[1.2] px-2 py-2"
            >
              <Home size={16} />
              Home
            </Link>
          </li>
          <li>
            <Link
              href="#products"
              className="flex items-center gap-1 hover:text-blue-400 transition-all duration-300 hover:scale-[1.2] px-2 py-2"
            >
              <ShoppingCart size={16} />
              Products
            </Link>
          </li>
          <li>
            <Link
              href="#about"
              className="flex items-center gap-1 hover:text-blue-400 transition-all duration-300 hover:scale-[1.2] px-2 py-2"
            >
              <Info size={16} />
              About
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className="flex items-center gap-1 hover:text-blue-400 transition-all duration-300 hover:scale-[1.2] px-2 py-2"
            >
              <Mail size={16} />
              Contact
            </Link>
          </li>
        </ul>

        <div className="flex-1" />

        {/* Search input + Sign In */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Input ≥640px */}
          <div ref={inputRef} className="hidden sm:block w-48 sm:w-64 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search shops..."
              className="w-full pl-10 pr-3 py-2 text-sm rounded-full border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Ikona na małych ekranach */}
          <div className="block sm:hidden ml-auto">
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 rounded-full border border-gray-300 dark:border-zinc-600 bg-white/90 dark:bg-zinc-800 text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Sign In */}
          <Link href="/sign">
            <Button variant="demoshop">Sign In</Button>
          </Link>
        </div>
      </div>

      {/* Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
    </nav>
  );
}
