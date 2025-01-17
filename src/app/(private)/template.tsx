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
import { getUnit } from "@/util/unit";
import { getUser } from "@/util/user";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ id: string; entity: string }>();

  const [breadcrumb, setBreadcrumb] = React.useState<
    { name?: string; href: string }[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);

    const generateBreadcrumbItems = async () => {
      const entityNameResolvers = {
        properties: async (id: string) =>
          (await getProperty(id)).property?.name,
        tenants: async (id: string) => {
          const { user } = await getUser(id);
          return user?.name || user?.email;
        },
        units: async (id: string) => (await getUnit(id)).unit?.unitNumber,
      };

      const breadcrumbItems = await Promise.all(
        parts.map(async (part, index) => {
          const href = `/${parts.slice(0, index + 1).join("/")}`;

          if (part !== params.id) {
            return { name: part, href };
          }

          const resolver =
            entityNameResolvers[
              params.entity as keyof typeof entityNameResolvers
            ];
          const name = resolver ? await resolver(params.id) : part;
          return { name, href };
        }),
      );

      // Handle special case for units to include property
      if (params.entity === "units" && params.id) {
        const { unit } = await getUnit(params.id);
        if (unit?.property) {
          breadcrumbItems.splice(1, 0, {
            name: unit.property.name,
            href: `/properties/${unit.property.id}`,
          });
        }
      }

      setBreadcrumb(breadcrumbItems);
      setLoading(false);
    };

    generateBreadcrumbItems().catch(() => setLoading(false));
  }, [pathname, params.id, params.entity]);

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
