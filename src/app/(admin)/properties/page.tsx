import { Property, columns } from "./columns";
import { DataTable } from "./data-table";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getProperties({
  userId,
}: {
  userId?: string;
}): Promise<Property[]> {
  const properties = await prisma.property.findMany({
    where: {
      ownerId: userId,
    },
  });

  return properties.map((property) => ({
    id: property.id,
    type: property.type,
    name: property.name,
  }));
}

export default async function Page() {
  const session = await getSession();

  const data = await getProperties({
    userId: session?.user.id,
  });

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
