import { getFollowedProfiles } from "@/app/api/actions/getFollowedProfiles";
import FollowFilter from "@/app/components/follows/FollowFilter";

export default async function FollowsPage() {
  const users = await getFollowedProfiles();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-sky-900 mb-4">Users you follow</h1>
      <FollowFilter initialUsers={users} />
    </div>
  );
}
