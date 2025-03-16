import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim().replace(/^#+/, "") || ""; // Remove "#" from query

    if (!query) {
      return NextResponse.json({ success: true, tags: [] });
    }

    // Fetch for only 10 tags at once
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          startsWith: `#${query}`,
        },
      },
      select: { name: true },
      orderBy: { name: "asc" },
      take: 10,
    });

    return NextResponse.json({ success: true, tags: tags.map(tag => tag.name) });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tags" });
  }
}

