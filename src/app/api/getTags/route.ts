import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim().replace(/^#+/, "") || "";

    const tags = await prisma.tag.findMany({
      where: query
        ? {
            name: {
              startsWith: `#${query}`,
            },
          }
        : undefined, // No filter if query is empty
      select: { name: true },
      orderBy: { name: "asc" },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      tags: tags.map((tag) => tag.name),
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch tags",
    });
  }
}
