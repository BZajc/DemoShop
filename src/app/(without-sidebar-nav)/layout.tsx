import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NoSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/sign");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main>{children}</main>
    </div>
  );
}
