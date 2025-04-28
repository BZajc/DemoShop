"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  CircleUserRound,
  Newspaper,
  MessageSquareText,
  Images,
  Settings,
  Github,
  Diamond
} from "lucide-react";

const iconsMap = {
  profile: CircleUserRound,
  feed: Newspaper,
  contacts: MessageSquareText,
  collections: Images,
  settings: Settings,
  github: Github,
  diamond: Diamond
};

interface ActiveLinkProps {
  href: string;
  label: string;
  iconName: keyof typeof iconsMap;
  onClick?: () => void;
}

export default function ActiveLink({ href, label, iconName, onClick }: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const IconComponent = iconsMap[iconName];

  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`relative mb-4 p-4 flex items-center rounded-full transition-all duration-300 transform cursor-pointer w-[90vw]
      ${
        isActive
          ? "bg-white text-sky-400"
          : "text-sky-200 hover:text-white hover:bg-sky-700 hover:scale-105"
      }`}
      >
        <IconComponent className="mr-2" strokeWidth={1.5} />
        <span className="select-none">{label}</span>
      </Link>
    </li>
  );
}
