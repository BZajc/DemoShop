"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { label: "Privacy", href: "/settings/privacy" },
  { label: "Community", href: "/settings/community" },
  { label: "Posts", href: "/settings/posts" },
];

export default function SettingsTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-4 mb-6 border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "pb-2 border-b-2 text-sm font-medium",
              isActive
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-gray-500 hover:text-sky-600"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
