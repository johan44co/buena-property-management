"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Unit } from "@prisma/client";

type UnitData = Pick<
  Unit,
  | "propertyId"
  | "unitNumber"
  | "isOccupied"
  | "leaseEnd"
  | "leaseStart"
  | "rentAmount"
  | "tenantId"
>;

export const createUnit = async (data: UnitData) => {
  try {
    const session = await getSession();
    if (!session || !session.user?.id || session.user?.role !== "admin") {
      return { error: "Unauthorized" };
    }

    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
    });

    if (!property || property.ownerId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    const unit = await prisma.unit.create({
      data,
    });

    return { unit };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while creating the unit" };
  }
};

export const getUnit = async (id: string) => {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    const unit = await prisma.unit.findUnique({
      where: { id, property: { ownerId: session.user.id } },
      include: {
        property: {
          select: { name: true, id: true },
        },
      },
    });

    return { unit };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while retrieving the unit" };
  }
};

export const updateUnit = async (id: string, data: UnitData) => {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    const unitUpdated = await prisma.unit.update({
      where: {
        id,
        property: {
          ownerId: session.user.id,
        },
      },
      data,
    });

    return { unit: unitUpdated };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while updating the unit" };
  }
};

export const getUnits = async () => {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    const units = await prisma.unit.findMany({
      where: { property: { ownerId: session.user.id } },
      include: {
        property: {
          select: { name: true },
        },
        tenant: { select: { name: true } },
      },
    });

    return { units };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while retrieving the units" };
  }
};
