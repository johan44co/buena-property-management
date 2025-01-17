import { EntityTable } from "@/app/(admin)/[entity]/entity-table";
import { propertyColumns } from "./_columns/property";
import { tenantColumns } from "./_columns/tenant";
import { unitColumns } from "./_columns/unit";
import { getProperties } from "@/util/property";
import { getUsers } from "@/util/user";
import { getUnits } from "@/util/unit";

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    {
      entity: "properties",
    },
    {
      entity: "tenants",
    },
    {
      entity: "units",
    },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{
    entity: "properties" | "tenants" | "units";
  }>;
}) {
  const entity = (await params).entity;

  const Table = (async () => {
    switch (entity) {
      case "properties":
        const { properties } = await getProperties();
        return (
          <EntityTable
            columns={propertyColumns}
            data={properties || []}
            title="Properties"
            description="Manage your properties."
            inputFilterPlaceholder="Filter properties..."
          />
        );
      case "tenants":
        const { users } = await getUsers();
        return (
          <EntityTable
            columns={tenantColumns}
            data={users || []}
            title="Tenants"
            description="Manage your tenants."
            inputFilterPlaceholder="Filter tenants..."
          />
        );
      case "units":
        const { units } = await getUnits();
        return (
          <EntityTable
            columns={unitColumns}
            data={units || []}
            title="Units"
            description="Manage your units."
            inputFilterPlaceholder="Filter units..."
          />
        );
      default:
        return null;
    }
  })();

  return <div className="container mx-auto p-4 pt-0">{Table}</div>;
}
