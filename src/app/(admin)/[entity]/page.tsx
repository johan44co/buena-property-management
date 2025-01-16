import { DataTable } from "@/components/data-table";
import { getSession } from "@/lib/auth";
import { propertyColumns } from "./property-columns";
import { tenantColumns } from "./tenant-columns";
import { getProperties, getTenants } from "./data-columns";

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    {
      entity: "properties",
    },
    {
      entity: "tenants",
    },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{
    entity: "properties" | "tenants";
  }>;
}) {
  const session = await getSession();
  const entity = (await params).entity;

  const Table = (async () => {
    switch (entity) {
      case "properties":
        return (
          <DataTable
            columns={propertyColumns}
            data={await getProperties({
              userId: session?.user.id,
            })}
            title="Properties"
            description="Manage your properties."
            inputFilterPlaceholder="Filter properties..."
          />
        );
      case "tenants":
        return (
          <DataTable
            columns={tenantColumns}
            data={await getTenants({
              userId: session?.user.id,
            })}
            title="Tenants"
            description="Manage your tenants."
            inputFilterPlaceholder="Filter tenants..."
          />
        );
      default:
        return null;
    }
  })();

  return <div className="container mx-auto p-4 pt-0">{Table}</div>;
}
