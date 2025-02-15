import ActivityPanel from "./ActivityPanel";
import FeedHeader from "./FeedHeader";
import FeedPost from "./feedpost/FeedPost";
export default function FeedMainContent() {
  return (
    <div className="flex-1 overflow-hidden max-w-[900px] mx-auto">
      <FeedHeader />
      <ActivityPanel />
      <FeedPost />
    </div>
  );
}
