"use server";

import { PropertyFormValues } from "@/app/(admin)/properties/add/page";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const createProperty = async (data: PropertyFormValues) => {
  try {
    const session = await getSession();

    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    const property = await prisma.property.create({
      data: {
        name: data.name,
        address: data.address,
        type: data.type,
        status: data.status,
        ownerId: session.user.id,
      },
    });

    return { property };
  } catch (error) {
    return { error: "An error occurred while creating the property" };
  }
};
