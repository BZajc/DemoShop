import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";

export async function auth() {
    return await getServerSession(authOptions);
}
