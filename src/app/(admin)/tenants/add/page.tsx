"use client";
import TenantForm from "@/app/(admin)/tenants/tenant-form";
import { createUser } from "@/util/user";
import { useRouter } from "next/navigation";

export default function Page() {
  const route = useRouter();
  return (
    <div className="container mx-auto p-4 pt-0">
      <TenantForm
        title="Add new tenant"
        description="Fill in the form below to add a new tenant."
        submitText="Add Tenant"
        onSubmitHandler={(property) => {
          createUser(property).then((result) => {
            if (result.user) {
              route.push(`/tenants/${result.user.id}`);
            }
          });
        }}
      />
    </div>
  );
}
