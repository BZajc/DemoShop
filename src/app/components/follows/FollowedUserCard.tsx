import Image from "next/image";
import { User } from "lucide-react";
import Link from "next/link";
import UnfollowButton from "./UnfollowButton";

interface FollowedUserCardProps {
  user: {
    id: string;
    name: string;
    hashtag: string | null;
    realName: string | null;
    avatarPhoto: string | null;
  };
}

export default function FollowedUserCard({ user }: FollowedUserCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl flex items-center justify-between shadow">
      <Link
        href={`/profile/${user.name}/${user.hashtag}`}
        className="flex items-center gap-4"
      >
        {user.avatarPhoto ? (
          <Image
            src={user.avatarPhoto}
            alt="avatar"
            width={48}
            height={48}
            className="rounded-full object-cover w-12 h-12"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <User className="text-gray-500 w-6 h-6" />
          </div>
        )}
        <div>
          <p className="text-sky-900 font-semibold">
            @{user.name}
            {user.hashtag && `#${user.hashtag}`}
          </p>
          {user.realName && (
            <p className="text-gray-500 text-sm">{user.realName}</p>
          )}
        </div>
      </Link>
      <UnfollowButton userId={user.id} userName={user.name} />
    </div>
  );
}
