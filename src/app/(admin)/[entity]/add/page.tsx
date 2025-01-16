"use client";
import PropertyForm from "@/app/(admin)/[entity]/_forms/property";
import TenantForm from "@/app/(admin)/[entity]/_forms/tenant";
import { createProperty } from "@/util/property";
import { createUser } from "@/util/user";
import { useParams, useRouter } from "next/navigation";

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
