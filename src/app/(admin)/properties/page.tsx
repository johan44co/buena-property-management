import { Property, columns } from "./columns";
import { DataTable } from "./data-table";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getProperties({
  userId,
}: {
  userId?: string;
}): Promise<Property[]> {
  if (!userId) {
    return [];
  }

  const properties = await prisma.property.findMany({
    where: {
      ownerId: userId,
    },
  });

  return properties.map((property) => ({
    id: property.id,
    type: property.type,
    name: property.name,
    status: property.status,
  }));
}

export default async function Page() {
  const session = await getSession();

  const data = await getProperties({
    userId: session?.user.id,
  });

  return <DataTable columns={columns} data={data} />;
}
