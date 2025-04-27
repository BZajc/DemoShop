"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";

export async function getRecentlyVisited() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  const visitorId = session.user.id;

  const visitedUsers = await prisma.recentlyVisitedUsers.findMany({
    where: { visitorId },
    orderBy: { visitedAt: "desc" },
    take: 20,
    select: {
      visited: {
        select: {
          id: true,
          hashtag: true,
          name: true,
          avatarPhoto: true,
        },
      },
    },
  });

  return visitedUsers.map((visit) => visit.visited);
}
