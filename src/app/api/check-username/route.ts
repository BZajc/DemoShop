import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username || !/^[a-zA-Z0-9]{4,16}$/.test(username)) {
    return NextResponse.json({ available: false });
  }

  const exists = await prisma.profiles.findUnique({
    where: { username },
  });

  return NextResponse.json({ available: !exists });
}
