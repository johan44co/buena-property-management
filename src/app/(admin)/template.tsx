"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getProperty } from "@/util/property";
import { getUser } from "@/util/user";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();

  const [breadcrumb, setBreadcrumb] = React.useState<
    { name?: string; href: string }[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);

    Promise.all(
      parts.map(async (part, index) => {
        if (parts[index - 1] === "properties" && part === params.id) {
          const propertyName = (await getProperty(params.id)).property?.name;
          return {
            name: propertyName,
            href: `/${parts.slice(0, index + 1).join("/")}`,
          };
        }
        if (parts[index - 1] === "tenants" && part === params.id) {
          const { user } = await getUser(params.id);
          const propertyName = user?.name || user?.email;
          return {
            name: propertyName,
            href: `/${parts.slice(0, index + 1).join("/")}`,
          };
        }
        return {
          name: part,
          href: `/${parts.slice(0, index + 1).join("/")}`,
        };
      }),
    )
      .then(setBreadcrumb)
      .finally(() => setLoading(false));
  }, [pathname, params.id]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {loading && (
                <BreadcrumbItem>
                  <BreadcrumbLink>
                    <Skeleton className="h-4 w-48" />
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
              {breadcrumb.map(({ name, href }, index) => (
                <React.Fragment key={href}>
                  <BreadcrumbItem>
                    <BreadcrumbLink className="capitalize" href={href}>
                      {name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      {children}
    </>
  );
}
