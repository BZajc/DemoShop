import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const safeSession = {
        user: session.user ? {
            name: session.user.name,
            email: session.user.email,
            id: session.user.id || null,
        } : null,
    };

    return NextResponse.json(safeSession);
}
