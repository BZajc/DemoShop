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
    <div className="flex h-screen bg-gray-100">
      {/* Desktop nav */}
      <div className="hidden md:block fixed top-0 left-0 h-screen z-40">
        <SidebarNav />
      </div>

      {/* Mobile nav */}
      <div className="md:hidden fixed top-0 left-0 z-50">
        <MobileNav profilePath={profilePath} />
      </div>

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-[250px] overflow-y-auto p-0 md:p-6">
        {children}
      </main>

      {/* Right sidebar (Followed) */}
      <div className="hidden lg:block">
        <FeedSidebar />
      </div>
    </div>
  );
}

