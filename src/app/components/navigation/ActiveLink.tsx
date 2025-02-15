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
} from "lucide-react";

const iconsMap = {
  profile: CircleUserRound,
  feed: Newspaper,
  contacts: MessageSquareText,
  collections: Images,
  settings: Settings,
  github: Github,
};

interface ActiveLinkProps {
  href: string;
  label: string;
  iconName: keyof typeof iconsMap;
}

export default function ActiveLink({ href, label, iconName }: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const IconComponent = iconsMap[iconName];

  return (
    <li
      className={`relative mb-4 p-4 flex items-center rounded-full transition-all duration-300 transform cursor-pointer
      ${
        isActive
          ? "bg-white text-sky-400"
          : "text-sky-200 hover:text-white hover:bg-sky-700 hover:scale-105"
      }`}
    >
      <Link href={href} className="absolute inset-0 w-full h-full" />
      <IconComponent className="mr-2 z-10" strokeWidth={1.5} />
      <span className="z-10 select-none">{label}</span>
    </li>
  );
}
