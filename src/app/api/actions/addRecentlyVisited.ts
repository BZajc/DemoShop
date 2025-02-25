"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function addRecentlyVisited(visitedUserId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const visitorId = session.user.id;

  // Do not add own profile to the list
  if (visitorId === visitedUserId) return { success: false };

  try {
    // Check if profile exist on the list
    const existingVisit = await prisma.recentlyVisitedUsers.findFirst({
      where: {
        visitorId,
        visitedId: visitedUserId,
      },
    });

    // If exist, update visit time
    if (existingVisit) {
      await prisma.recentlyVisitedUsers.update({
        where: { id: existingVisit.id },
        data: {
          visitedAt: new Date(),
        },
      });
    } else {
      // Add to the list
      await prisma.recentlyVisitedUsers.create({
        data: {
          visitorId,
          visitedId: visitedUserId,
        },
      });
    }
    // Remove the oldest visited users if list is longer than 20
    const totalVisits = await prisma.recentlyVisitedUsers.count({
      where: { visitorId },
    });

    if (totalVisits > 20) {
      const oldestVisit = await prisma.recentlyVisitedUsers.findMany({
        where: { visitorId },
        orderBy: { visitedAt: "asc" },
        skip: 20, // Remove profiles after 20 (keep only the newest ones)
      });

      const oldestIds = oldestVisit.map((visit) => visit.id);

      if (oldestIds.length > 0) {
        await prisma.recentlyVisitedUsers.deleteMany({
          where: {
            id: { in: oldestIds },
          },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error recording visit:", error);
    return { success: false, error: "Failed to record visit" };
  }
}
