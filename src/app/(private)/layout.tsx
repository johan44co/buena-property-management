import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumb from "@/components/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {modal}
        <Breadcrumb />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
