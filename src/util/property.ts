"use server";

import { PropertyFormValues } from "@/app/(admin)/properties/form";
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
    console.error(error);
    return { error: "An error occurred while creating the property" };
  }
};

export const getProperty = async (id: string) => {
  try {
    const session = await getSession();

    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    const property = await prisma.property.findUnique({
      where: { id },
    });

    return { property };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while fetching the property" };
  }
};

export const updateProperty = async (id: string, data: PropertyFormValues) => {
  try {
    const session = await getSession();

    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        type: data.type,
        status: data.status,
      },
    });

    return { property };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while updating the property" };
  }
};
