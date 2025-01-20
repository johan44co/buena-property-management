"use server";

import { prisma } from "@/lib/prisma";
import { RentPayment } from "@prisma/client";

type RentPaymentData = Pick<
  RentPayment,
  "unitId" | "tenantId" | "amountPaid" | "status" | "dueDate"
>;

export const createRentPayment = async (data: RentPaymentData) => {
  try {
    const rentPayment = await prisma.rentPayment.create({
      data: {
        unitId: data.unitId,
        tenantId: data.tenantId,
        amountPaid: data.amountPaid,
        status: data.status,
        dueDate: data.dueDate,
      },
    });

    return { rentPayment };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while creating the rent payment" };
  }
};
