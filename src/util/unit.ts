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

type GetUnitsArgs = Parameters<typeof prisma.unit.findMany>[0];

export const getUnits = async ({
  where,
  include,
  ...rest
}: GetUnitsArgs = {}) => {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    const units = await prisma.unit.findMany({
      ...rest,
      where: {
        ...where,
        property: { ownerId: session.user.id },
      },
      include: {
        ...include,
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

export const getUnitsRent = async () => {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    const units = await prisma.unit.findMany({
      where: {
        tenantId: session.user.id,
      },
      include: {
        property: {
          select: { name: true, address: true },
        },
      },
    });

    return { units };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while retrieving the units" };
  }
};

type GetUnitRentArgs = Parameters<typeof prisma.unit.findUnique>[0];

export const getUnitRent = async (
  id: string,
  { where, include, ...rest }: Partial<GetUnitRentArgs> = {},
) => {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    const unit = await prisma.unit.findUnique({
      ...rest,
      where: { ...where, id, tenantId: session.user.id },
      include: {
        ...include,
        property: {
          select: { name: true, id: true, address: true, ownerId: true },
        },
      },
    });

    return { unit };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while retrieving the unit" };
  }
};
