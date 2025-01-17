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
    console.log(session);
    if (!session || !session.user?.id || session.user?.role !== "admin") {
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
