import Image from "next/image";
import LogoutButton from "./LogoutButton";
import ActiveLink from "./ActiveLink";
import { auth } from "@/lib/auth";

export default async function SidebarNav() {
  const session = await auth();

  const profilePath = `/profile/${session?.user.name}/${session?.user.hashtag}`;

  return (
    <nav className="w-1/6 min-w-[180px] max-w-[250px] bg-sky-900 h-screen p-4 rounded-r-lg flex flex-col justify-between sticky left-0 top-0">
      {/* Top part of nav */}
      <div>
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/images/picbookLogo.png"
            alt="picbook logo"
            width={40}
            height={40}
          />
        </div>

        {/* Navigation */}
        <ul>
          <ActiveLink href={profilePath} label="Profile" iconName="profile" />
          <ActiveLink href="/feed" label="Feed" iconName="feed" />
          <ActiveLink href="/contacts" label="Contacts" iconName="contacts" />
          <ActiveLink
            href="/collections"
            label="Collections"
            iconName="collections"
          />
          <ActiveLink href="/follows" label="Follows" iconName="diamond" />
          <ActiveLink
            href="/settings/privacy"
            label="Settings"
            iconName="settings"
          />
          <ActiveLink href="/123" label="Github Docs" iconName="github" />
        </ul>
      </div>

      <div className="mb-4">
        <LogoutButton />
      </div>
    </nav>
  );
}
