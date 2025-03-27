import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/authOptions";


export default async function Home() {
  const session = await getServerSession(authOptions);

  // Redirect user depending on the session state
  if (session) {
    redirect("/feed");
  } else {
    redirect("/sign");
  }

  return null;
}
