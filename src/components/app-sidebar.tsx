"use client";

import * as React from "react";
import {
  Building,
  HandCoins,
  LayoutDashboard,
  Users,
  Wrench,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProperties } from "@/components/nav-properties";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import Link from "next/link";

const data = {
  user: {
    name: "",
    email: "",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Properties",
      url: "/properties",
      icon: Building,
      isActive: false,
      items: [
        {
          title: "All Properties",
          url: "/properties",
        },
        {
          title: "Add Property",
          url: "/properties/add",
        },
      ],
    },
    {
      title: "Tenants",
      url: "/tenants",
      icon: Users,
      items: [
        {
          title: "All Tenants",
          url: "/tenants",
        },
        {
          title: "Add Tenant",
          url: "/tenants/add",
        },
      ],
    },
    {
      title: "Rent Collection",
      url: "/rent-collection",
      icon: HandCoins,
      items: [],
    },
    {
      title: "Maintenance Requests",
      url: "/maintenance-requests",
      icon: Wrench,
      items: [],
    },
  ],
  properties: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  if (session?.user) {
    data.user.name = session.user.name ?? session.user.email ?? data.user.name;
    data.user.email = session.user.email ?? data.user.email;
    data.user.avatar = session.user.image ?? data.user.avatar;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quick view</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={"Dashboard"}>
                <Link href={"/dashboard"}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavMain items={data.navMain.slice(1, Infinity)} />
        <NavProperties properties={data.properties} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
