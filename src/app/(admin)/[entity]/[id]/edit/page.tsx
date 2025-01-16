import { getProperty } from "@/util/property";
import { getUser } from "@/util/user";

import { redirect } from "next/navigation";
import { UpdateEntity } from "./update-entity";

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
        redirect(`/${entity}`);
      }
      return (
        <div className="container mx-auto p-4 pt-0">
          <UpdateEntity id={id} entity={entity} data={property} />
        </div>
      );
    }
    case "tenants": {
      const { user } = await getUser(id);
      if (!user) {
        redirect(`/${entity}`);
      }
      return (
        <div className="container mx-auto p-4 pt-0">
          <UpdateEntity id={id} entity={entity} data={user} />
        </div>
      );
    }
    default:
      redirect("/");
  }
}
