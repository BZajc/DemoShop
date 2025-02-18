import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      select: { name: true },
    });

    return NextResponse.json({ success: true, tags: tags.map(tag => tag.name) });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tags" });
  }
}
