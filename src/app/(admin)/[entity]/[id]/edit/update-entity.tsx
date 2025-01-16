"use client";

import PropertyForm from "@/app/(admin)/[entity]/_forms/property";
import TenantForm from "@/app/(admin)/[entity]/_forms/tenant";
import { updateProperty } from "@/util/property";
import { updateUser } from "@/util/user";
import { Property, User } from "@prisma/client";
import { useRouter } from "next/navigation";

type EntityProps =
  | {
      id: string;
      entity: "properties";
      data?: Property;
    }
  | {
      id: string;
      entity: "tenants";
      data: User;
    };

export function UpdateEntity({ id, entity, data }: EntityProps) {
  const router = useRouter();

  switch (entity) {
    case "properties":
      return (
        <PropertyForm
          title="Edit Property"
          description="Edit property details"
          submitText="Save"
          property={data as Property}
          onSubmitHandler={(property) => {
            updateProperty(id, property).then((result) => {
              if (result.property) {
                router.push(`/${entity}`);
              }
            });
          }}
        />
      );
    case "tenants":
      const tenant = data && {
        ...data,
        name: data?.name || undefined,
      };
      return (
        <TenantForm
          title="Edit Tenant"
          description="Edit tenant details."
          submitText="Save"
          tenant={tenant}
          onSubmitHandler={(user) => {
            updateUser(id, {
              ...user,
              name: user.name || null,
            }).then((result) => {
              if (result.user) {
                router.push(`/${entity}`);
              }
            });
          }}
        />
      );
    default:
      return null;
  }
}
