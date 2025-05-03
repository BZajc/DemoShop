import FeedSidebar from "../components/other/FollowSideBar";
import SidebarNav from "../components/navigation/SidebarNav";
import MobileNav from "../components/navigation/MobileNav";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const profilePath = `/profile/${session?.user.name}/${session?.user.hashtag}`;

  if (!session) {
    redirect("/sign");
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop nav */}
      <div className="hidden md:block">
        <SidebarNav />
      </div>

      {/* Mobile nav (u wouldn't guess) */}
      <div className="md:hidden fixed top-0 left-0 z-50">
        <MobileNav profilePath={profilePath} />
      </div>

      <main className="flex-1 p-0 md:p-6">{children}</main>

      {/* Followed Profiles displayed on the right side of the screen (only desktop view) */}
      <FeedSidebar />
    </div>
  );
}
