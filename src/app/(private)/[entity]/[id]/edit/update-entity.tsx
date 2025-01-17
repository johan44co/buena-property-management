"use client";

import PropertyForm from "@/app/(private)/[entity]/_forms/property";
import TenantForm from "@/app/(private)/[entity]/_forms/tenant";
import UnitForm from "@/app/(private)/[entity]/_forms/unit";
import { updateProperty } from "@/util/property";
import { updateUnit } from "@/util/unit";
import { updateUser } from "@/util/user";
import { Property, Unit, User } from "@prisma/client";
import { redirect, useRouter } from "next/navigation";

type EntityProps =
  | {
      id: string;
      entity: "properties";
      data?: Property | null;
    }
  | {
      id: string;
      entity: "tenants";
      data?: User | null;
    }
  | {
      id: string;
      entity: "units";
      data?: Unit | null;
    };

export function UpdateEntity({ id, entity, data }: EntityProps) {
  const router = useRouter();

  if (!data) {
    redirect(`/${entity}`);
  }

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
    case "units":
      return (
        <UnitForm
          title="Edit Unit"
          description="Edit unit details."
          submitText="Save"
          unit={data as Unit}
          onSubmitHandler={(unit) => {
            updateUnit(id, {
              ...unit,
              leaseEnd: unit.leaseEnd || null,
              leaseStart: unit.leaseStart || null,
              tenantId: unit.tenantId || null,
            }).then((result) => {
              if (result.unit) {
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
