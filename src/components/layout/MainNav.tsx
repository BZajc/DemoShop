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
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "./ThemeToggleButton";
import { gql, useQuery } from "@apollo/client";
import { createClient } from "@/lib/supabase-client";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload()
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
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
            className={`hidden sm:inline text-xl font-bold transition-colors duration-300 ${
              scrolled
                ? "text-brown-700 dark:text-white"
                : "text-white dark:text-white"
            }`}
          >
            DemoShop
          </span>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Desktop icons */}
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/search" aria-label="Search">
              <div className={iconClasses}>
                <Search className="w-5 h-5" />
              </div>
            </Link>

            <ThemeToggleButton />

            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-500 dark:text-white" />
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
                  } dark:text-white`}
                  title={user.username}
                >
                  Hi, {user.username}
                </span>
                <Link href="/admin">
                  <div className={iconClasses} aria-label="Edit shop">
                    <Hammer className="w-5 h-5" />
                  </div>
                </Link>
                <Link href="/cart">
                  <div className={iconClasses} aria-label="Cart">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                </Link>
                <Link href="/favorites">
                  <div className={iconClasses} aria-label="Favorites">
                    <Heart className="w-5 h-5" />
                  </div>
                </Link>
                <button onClick={handleLogout} className={iconClasses}>
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link href="/sign">
                <Button variant="demoshop">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile only */}
          <div className="flex sm:hidden gap-2 items-center">
            <ThemeToggleButton />
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={iconClasses}
              aria-label="Mobile menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {mobileMenuOpen && (
              <div className="absolute top-16 right-6 flex flex-col gap-2 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-lg z-50 border dark:border-zinc-700 min-w-[180px]">
                {user && (
                  <span className="text-sm text-gray-700 dark:text-white px-1">
                    Hi, {user.username}
                  </span>
                )}
                <Link href="/search">
                  <div className="flex items-center gap-2">
                    <div className={iconClasses}>
                      <Search className="w-5 h-5" />
                    </div>
                    <span className="text-sm text-brown-700 dark:text-white">
                      Shops
                    </span>
                  </div>
                </Link>
                <Link href="/admin">
                  <div className="flex items-center gap-2">
                    <div className={iconClasses}>
                      <Hammer className="w-5 h-5" />
                    </div>
                    <span className="text-sm text-brown-700 dark:text-white">
                      Build
                    </span>
                  </div>
                </Link>
                <Link href="/cart">
                  <div className="flex items-center gap-2">
                    <div className={iconClasses}>
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <span className="text-sm text-brown-700 dark:text-white">
                      Cart
                    </span>
                  </div>
                </Link>
                <Link href="/favorites">
                  <div className="flex items-center gap-2">
                    <div className={iconClasses}>
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="text-sm text-brown-700 dark:text-white">
                      Favorites
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left"
                >
                  <div className={iconClasses}>
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-brown-700 dark:text-white">
                    Log out
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
