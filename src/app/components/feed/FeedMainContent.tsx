import ActivityPanel from "./ActivityPanel";
import SearchHeader from "../other/SearchHeaderWithPublishButton";
import FeedPost from "./feedpost/FeedPost";
import { getPosts } from "@/app/api/actions/posts/getPosts";
import { FollowProvider } from "@/app/context/FollowContext";

export default async function FeedMainContent() {
  const posts = await getPosts();

  return (
    <FollowProvider>
      <div className="flex-1 overflow-hidden w-[100vw] max-w-[900px] px-2 sm:px-4 mx-auto">
        {/* Search input etc */}
        <SearchHeader />

        {/* Recent visited or online contacts */}
        <ActivityPanel />

        {/* Display list of posts */}
        <div className="p-4">
          {posts.map((post) => (
            <FeedPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </FollowProvider>
  );
}
