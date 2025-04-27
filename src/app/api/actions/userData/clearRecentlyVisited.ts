'use server';

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function clearRecentlyVisited() {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  await prisma.recentlyVisitedUsers.deleteMany({
    where: { visitorId: session.user.id },
  });

  return { success: true };
}
