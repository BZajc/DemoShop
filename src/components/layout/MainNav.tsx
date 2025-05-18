"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  ShoppingCart,
  Heart,
  LogOut,
  Loader2,
  Hammer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "./ThemeToggleButton";
import { gql, useQuery } from "@apollo/client";

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      username
    }
  }
`;

export default function MainNav() {
  const pathname = usePathname();
  const isSignPage = pathname === "/sign";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { data, loading } = useQuery(ME_QUERY, { ssr: false });
  const user = data?.me;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0 || pathname !== "/home");
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  if (isSignPage) return null;

  const iconClasses = `p-2 rounded-full transition border cursor-pointer
    ${
      scrolled
        ? "bg-white text-brown-700 border-brown-700 hover:bg-gray-100"
        : "bg-transparent text-white border-white hover:bg-white/20"
    }
    dark:hover:bg-zinc-700`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/60 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 shrink-0">
          <Image
            src="/DemoShopLogoTransparent.png"
            alt="DemoShop logo"
            width={48}
            height={48}
            className="object-contain"
          />
          <span
            className={`text-xl font-bold transition-colors duration-300 ${
              scrolled ? "text-brown-700" : "text-white dark:text-white"
            }`}
          >
            DemoShop
          </span>
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Navigation menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className={iconClasses}
              aria-label="Navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            {menuOpen && (
              <ul className="absolute right-0 mt-2 w-48 max-h-60 overflow-y-auto rounded-md shadow-lg bg-white dark:bg-zinc-900 text-sm text-gray-800 dark:text-white z-50 border dark:border-zinc-700">
                <li>
                  <Link
                    href="#home"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#products"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="#about"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Search */}
          <Link href="/search" aria-label="Search">
            <div className={iconClasses}>
              <Search className="w-5 h-5" />
            </div>
          </Link>

          {/* Theme toggle */}
          <ThemeToggleButton />

          {/* User info / auth */}
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
          ) : user ? (
            <>
              <div
                className={`h-6 w-[1px] mx-2 transition-colors ${
                  scrolled ? "bg-brown-700" : "bg-white"
                }`}
              />

              <span
                className={`text-sm max-w-[140px] truncate transition-colors duration-300 ${
                  scrolled ? "text-brown-700" : "text-white"
                } dark:text-gray-300`}
                title={user.username}
              >
                Hi, {user.username}
              </span>

              <Link href="/admin" aria-label="Edit shop">
                <div className={iconClasses}>
                  <Hammer className="w-5 h-5" />
                </div>
              </Link>

              <Link href="/cart" aria-label="Cart">
                <div className={iconClasses}>
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </Link>

              <Link href="/favorites" aria-label="Favorites">
                <div className={iconClasses}>
                  <Heart className="w-5 h-5" />
                </div>
              </Link>

              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  aria-label="Sign out"
                  className={iconClasses}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <Link href="/sign">
              <Button variant="demoshop">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
