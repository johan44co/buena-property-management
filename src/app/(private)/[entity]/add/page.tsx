"use client";
import PropertyForm from "@/components/entity-forms/property";
import TenantForm from "@/components/entity-forms/tenant";
import UnitForm from "@/components/entity-forms/unit";
import { createProperty } from "@/util/property";
import { createUser } from "@/util/user";
import { useParams, useRouter } from "next/navigation";
import { createUnit } from "@/util/unit";

export default function Page() {
  const route = useRouter();
  const { entity } = useParams();

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
