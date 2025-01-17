import { getProperty } from "@/util/property";
import { getUser } from "@/util/user";
import { getUnit } from "@/util/unit";
import { redirect } from "next/navigation";
import { UpdateEntity } from "./update-entity";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; entity: string }>;
}) {
  const { id, entity } = await params;

  let form = null;
  switch (entity) {
    case "properties": {
      const { property } = await getProperty(id);
      form = <UpdateEntity id={id} entity={entity} data={property} />;
      break;
    }
    case "tenants": {
      const { user } = await getUser(id);
      form = <UpdateEntity id={id} entity={entity} data={user} />;
      break;
    }
    case "units":
      const { unit } = await getUnit(id);
      form = <UpdateEntity id={id} entity={entity} data={unit} />;
      break;
    default:
      redirect("/");
  }

  return <div className="container mx-auto p-4 pt-0">{form}</div>;
}
