import { EntityTable } from "@/app/(admin)/[entity]/entity-table";
import { propertyColumns } from "./_columns/property";
import { tenantColumns } from "./_columns/tenant";
import { getProperties } from "@/util/property";
import { getUsers } from "@/util/user";

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
  const entity = (await params).entity;

  const Table = (async () => {
    switch (entity) {
      case "properties":
        const { properties } = await getProperties();
        return (
          <EntityTable
            columns={propertyColumns}
            data={
              properties?.map((property) => ({
                id: property.id,
                type: property.type,
                name: property.name,
                status: property.status,
              })) || []
            }
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
            data={
              users?.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
              })) || []
            }
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
