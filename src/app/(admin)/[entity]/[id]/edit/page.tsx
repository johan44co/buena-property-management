import { getProperty } from "@/util/property";
import { getUser } from "@/util/user";

import { redirect } from "next/navigation";
import { UpdateProperty, UpdateTenant } from "./update";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; entity: string }>;
}) {
  const { id, entity } = await params;

  switch (entity) {
    case "properties": {
      const { property } = await getProperty(id);
      if (!property) {
        redirect(`/${entity}/${id}`);
      }
      return (
        <div className="container mx-auto p-4 pt-0">
          <UpdateProperty id={id} property={property} />
        </div>
      );
    }
    case "tenants": {
      const { user } = await getUser(id);
      if (!user) {
        redirect(`/${entity}/${id}`);
      }
      return (
        <div className="container mx-auto p-4 pt-0">
          <UpdateTenant id={id} user={user} />
        </div>
      );
    }
    default:
      redirect("/");
  }
}
