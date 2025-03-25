import FeedMainContent from "../../components/feed/FeedMainContent";
import UserInformation from "../../components/userInformation/UserInformation";

export default function FeedPage() {
  return (
    <div className="flex">
      <FeedMainContent />
      <UserInformation />
    </div>
  );
}
