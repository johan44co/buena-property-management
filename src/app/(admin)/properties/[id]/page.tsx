import { getProperty } from "@/util/property";
import { redirect } from "next/navigation";
import UpdateProperty from "./update";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const { property } = await getProperty(id);

  if (!property) {
    redirect("/properties");
  }

  return <UpdateProperty id={id} property={property} />;
}
