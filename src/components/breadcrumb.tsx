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
import { getProperty } from "@/util/property";
import { getUnit, getUnitRent } from "@/util/unit";
import { getUser } from "@/util/user";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export default function BreadcrumbComponent() {
  const pathname = usePathname();
  const params = useParams<{ id: string; entity: string }>();

  const [breadcrumb, setBreadcrumb] = React.useState<
    { name?: string; href: string }[]
  >([]);

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
        rent: async (id: string) => (await getUnitRent(id)).unit?.unitNumber,
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
      if (params.entity === "units" && params.id && parts.length > 1) {
        const { unit } = await getUnit(params.id);
        if (unit?.property) {
          breadcrumbItems.splice(1, 0, {
            name: unit.property.name,
            href: `/properties/${unit.property.id}`,
          });
        }
      }

      // Handle special case for rent to include property address
      if (params.entity === "rent" && params.id && parts.length > 1) {
        const { unit } = await getUnitRent(params.id);
        if (unit?.property) {
          breadcrumbItems.splice(1, 0, {
            name: unit.property.address,
            href: `/rent/${unit.id}`,
          });
        }
      }

      setBreadcrumb(breadcrumbItems);
    };

    generateBreadcrumbItems();
  }, [pathname, params.id, params.entity]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.map(({ name, href }, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={href} className="capitalize">
                      {name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
