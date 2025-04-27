import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import SettingsCommunity from "./SettingsCommunity";
import { redirect } from "next/navigation";

export default async function SettingsCommunityWrapper() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const userId = session.user.id;

const contacts = await prisma.contact.findMany({
  where: {
    OR: [
      { senderId: userId },
      { receiverId: userId },
    ],
  },
  include: {
    sender: true,
    receiver: true,
  },
});

  const follows = await prisma.follows.findMany({
    where: { followerId: userId },
    include: { following: true },
  });

  return (
    <SettingsCommunity
      userId={userId}
      contacts={contacts}
      followed={follows.map((f) => f.following)}
    />
  );
}
