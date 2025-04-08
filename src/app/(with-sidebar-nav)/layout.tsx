import FeedSidebar from "../components/other/FollowSideBar";
import SidebarNav from "../components/navigation/SidebarNav";

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarNav />
      <main className="flex-1 p-6">{children}</main>
      <FeedSidebar />
    </div>
  );
}
