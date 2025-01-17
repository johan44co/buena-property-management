import { EntityTable } from "@/components/entity-table";
import { propertyColumns } from "./_columns/property";
import { tenantColumns } from "./_columns/tenant";
import { unitColumns } from "./_columns/unit";
import { getProperties } from "@/util/property";
import { getUsers } from "@/util/user";
import { getUnits, getUnitsRent } from "@/util/unit";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { rentColumns } from "./_columns/rent";

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
    {
      entity: "maintenance-requests",
    },
    {
      entity: "rent",
    },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{
    entity:
      | "properties"
      | "tenants"
      | "units"
      | "maintenance-requests"
      | "rent";
  }>;
}) {
  const entity = (await params).entity;
  const session = await getSession();

  const Table = (async () => {
    if (session?.user?.role === "admin") {
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
              filterColumn={"name"}
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
              filterColumn={"name"}
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
              filterColumn={"unitNumber"}
            />
          );
        case "maintenance-requests":
          return (
            <EntityTable
              columns={[]}
              data={[]}
              title="Maintenance Requests"
              description="View your maintenance requests."
              inputFilterPlaceholder="Filter maintenance requests..."
              filterColumn={"unitNumber"}
            />
          );
        default:
          return redirect("/");
      }
    }

    if (session?.user?.role === "tenant") {
      switch (entity) {
        case "rent":
          const { units } = await getUnitsRent();
          return (
            <EntityTable
              columns={rentColumns}
              data={units || []}
              title="Rent"
              description="View your rent information."
              inputFilterPlaceholder="Filter rent information..."
              filterColumn={"unitNumber"}
            />
          );
        case "maintenance-requests":
          return (
            <EntityTable
              columns={[]}
              data={[]}
              title="Maintenance Requests"
              description="View your maintenance requests."
              inputFilterPlaceholder="Filter maintenance requests..."
              filterColumn={"unitNumber"}
            />
          );
        default:
          return redirect("/");
      }
    }
  })();

  return <div className="container mx-auto p-4 pt-0">{Table}</div>;
}
