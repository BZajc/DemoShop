import FeedMainContent from "../../components/feed/FeedMainContent";
import UserInformation from "../../components/userInformation/UserInformation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function FeedPage() {
  const session = await auth();

  const user = session?.user?.id
  ? await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { hasCompletedSetup: true },
    })
  : null;

  return (
    <div className="flex">
      <FeedMainContent />
      {!user?.hasCompletedSetup && <UserInformation />}

    </div>
  );
}
