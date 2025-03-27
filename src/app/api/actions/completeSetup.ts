"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function completeUserSetup() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { hasCompletedSetup: true },
  });
}
