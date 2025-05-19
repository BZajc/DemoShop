"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  const iconButtonClasses = clsx(
    "p-2 rounded-full transition border cursor-pointer",
    "bg-white text-brown-700 border-brown-700 hover:bg-gray-100",
    "dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-700"
  );

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={iconButtonClasses}
      aria-label="Toggle theme"
    >
      <span className="transition-all duration-300 ease-in-out">
        {isDark ? (
          <Moon className="w-5 h-5 transition-all duration-300" />
        ) : (
          <Sun className="w-5 h-5 transition-all duration-300" />
        )}
      </span>
    </button>
  );
}
