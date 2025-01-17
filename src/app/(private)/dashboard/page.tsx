import AdminDashboard from "@/components/admin-dashboard";
import { getSession } from "@/lib/auth";

export default async function Page() {
  const session = await getSession();

  if (session?.user.role == "admin") {
    return <AdminDashboard />;
  }

  return null;
}
