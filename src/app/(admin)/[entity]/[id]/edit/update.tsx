"use client";

import PropertyForm from "@/app/(admin)/[entity]/property-form";
import TenantForm from "@/app/(admin)/[entity]/tenant-form";
import { updateProperty } from "@/util/property";
import { updateUser } from "@/util/user";

import { Property, User } from "@prisma/client";
import { useRouter } from "next/navigation";

export function UpdateProperty({
  id,
  property,
}: {
  id: string;
  property?: Property;
}) {
  const router = useRouter();
  return (
    <PropertyForm
      title="Edit Property"
      description="Edit property details"
      submitText="Save"
      property={property ?? undefined}
      onSubmitHandler={(property) => {
        updateProperty(id, property).then((result) => {
          if (result.property) {
            router.push(`/properties`);
          }
        });
      }}
    />
  );
}

export function UpdateTenant({ id, user }: { id: string; user?: User }) {
  const router = useRouter();
  const tenant = user && {
    ...user,
    name: user?.name || undefined,
  };
  return (
    <TenantForm
      title="Edit User"
      description="Edit user details"
      submitText="Save"
      tenant={tenant}
      onSubmitHandler={(user) => {
        updateUser(id, {
          ...user,
          name: user.name || null,
        }).then((result) => {
          if (result.user) {
            router.push(`/tenants`);
          }
        });
      }}
    />
  );
}
