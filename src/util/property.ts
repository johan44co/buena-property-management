"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Property } from "@prisma/client";

type PropertyData = Pick<Property, "name" | "address" | "type" | "status">;

export const createProperty = async (data: PropertyData) => {
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

export const updateProperty = async (id: string, data: PropertyData) => {
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

export const getProperties = async () => {
  try {
    const session = await getSession();

    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    const properties = await prisma.property.findMany({
      where: {
        ownerId: session.user.id,
      },
    });

    return { properties };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while fetching the properties" };
  }
};
