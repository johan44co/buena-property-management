"use client";
import PropertyForm from "@/app/(admin)/[entity]/_forms/property";
import TenantForm from "@/app/(admin)/[entity]/_forms/tenant";
import UnitForm from "@/app/(admin)/[entity]/_forms/unit";
import { createProperty } from "@/util/property";
import { createUser } from "@/util/user";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProperties } from "@/util/property";
import { getUsers } from "@/util/user";
import { Property, User } from "@prisma/client";
import { createUnit } from "@/util/unit";

export default function Page() {
  const route = useRouter();
  const { entity } = useParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<User[]>([]);

  useEffect(() => {
    if (entity === "units") {
      getProperties().then((result) => {
        setProperties(result.properties || []);
      });
      getUsers().then((result) => {
        setTenants(result.users || []);
      });
    }
  }, [entity]);

  const Form = () => {
    switch (entity) {
      case "properties":
        return (
          <PropertyForm
            title="Add New Property"
            description="Fill in the details below to add a new property."
            submitText="Create Property"
            onSubmitHandler={(property) => {
              createProperty(property).then((result) => {
                if (result.property) {
                  route.push(`/${entity}/${result.property.id}`);
                }
              });
            }}
          />
        );
      case "tenants":
        return (
          <TenantForm
            title="Add New Tenant"
            description="Fill in the details below to add a new tenant."
            submitText="Create Tenant"
            onSubmitHandler={(user) => {
              createUser({
                ...user,
                name: user.name || null,
              }).then((result) => {
                if (result.user) {
                  route.push(`/${entity}/${result.user.id}`);
                }
              });
            }}
          />
        );
      case "units":
        return (
          <UnitForm
            title="Add New Unit"
            description="Fill in the details below to add a new unit."
            submitText="Create Unit"
            properties={properties}
            tenants={tenants}
            onSubmitHandler={(unit) => {
              createUnit({
                ...unit,
                tenantId: unit.tenantId || null,
                leaseStart: unit.leaseStart || null,
                leaseEnd: unit.leaseEnd || null,
              }).then((result) => {
                if (result.unit) {
                  route.push(`/${entity}/${result.unit.id}`);
                }
              });
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 pt-0">
      <Form />
    </div>
  );
}
