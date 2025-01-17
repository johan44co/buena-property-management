import { redirect } from "next/navigation";
import { getSession } from "./auth";

export default async function redirectIfAdmin() {
  const session = await getSession();
  const isAdmin = session?.user?.role === "admin";
  if (!isAdmin) {
    redirect("/dashboard");
  }
}
