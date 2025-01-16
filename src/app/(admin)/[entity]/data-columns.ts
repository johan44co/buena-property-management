import { prisma } from "@/lib/prisma";
import { PropertyDataColumns } from "./property-columns";
import { TenantDataColumns } from "./tenant-columns";

export async function getProperties({
  userId,
}: {
  userId?: string;
}): Promise<PropertyDataColumns[]> {
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

export async function getTenants({
  userId,
}: {
  userId?: string;
}): Promise<TenantDataColumns[]> {
  if (!userId) {
    return [];
  }

  const tenants = await prisma.user.findMany({
    where: {
      createdById: userId,
    },
  });

  return tenants.map((tenant) => ({
    id: tenant.id,
    name: tenant.name,
    email: tenant.email,
  }));
}
