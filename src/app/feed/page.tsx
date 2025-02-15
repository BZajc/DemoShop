import FeedMainContent from "../components/feed/FeedMainContent";
import SidebarNav from "../components/navigation/SidebarNav";
import FeedSidebar from "../components/feed/FeedSidebar";
import FirstTimeData from "../components/feed/FirstTimeData";

export default function FeedPage() {
  return (
    <div className="flex">
      <SidebarNav />
      <FeedMainContent />
      <FeedSidebar />
      <FirstTimeData />
    </div>
  );
}
