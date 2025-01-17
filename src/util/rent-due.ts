import { Unit, RentPayment } from "@prisma/client";

interface RentDueResult {
  rentDue: number;
  totalDue: number;
  nextDueDate: Date | null;
  paymentStatus: {
    current: boolean;
    daysLate: number;
    unpaidMonths: number;
  };
  partialMonth?: {
    days: number;
    amount: number;
  };
}

/**
 * Calculates rent due for a unit considering lease terms, payments, and late fees
 * @param unit - Unit information including lease terms
 * @param rentPayments - Array of past rent payments
 * @returns RentDueResult object with detailed payment information
 */
export const rentDueCalculation = (
  unit?: Unit | null,
  rentPayments: RentPayment[] = [],
): RentDueResult => {
  // Input validation
  if (!unit || typeof unit.rentAmount !== "number" || unit.rentAmount < 0) {
    throw new Error("Invalid unit data");
  }

  const now = new Date();
  const leaseStart = unit.leaseStart ? new Date(unit.leaseStart) : new Date();
  const leaseEnd = unit.leaseEnd ? new Date(unit.leaseEnd) : new Date();
  const rentAmount = unit.rentAmount;

  if (!unit.isOccupied) {
    return {
      rentDue: 0,
      totalDue: 0,
      nextDueDate: null,
      paymentStatus: { current: true, daysLate: 0, unpaidMonths: 0 },
    };
  }

  // Calculate partial month for lease end
  let partialMonthEnd;
  if (
    leaseEnd.getMonth() === now.getMonth() &&
    leaseEnd.getFullYear() === now.getFullYear()
  ) {
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    const daysInLease = leaseEnd.getDate();
    partialMonthEnd = {
      days: daysInLease,
      amount: (rentAmount / daysInMonth) * daysInLease,
    };
  }

  // Calculate unpaid rent and late fees
  const startDate = new Date(leaseStart);
  let unpaidRent = 0;
  let unpaidMonths = 0;

  while (startDate < now) {
    // Only process if within lease period
    if (startDate >= leaseStart && startDate <= leaseEnd) {
      const monthPayments = rentPayments.filter(
        (payment) =>
          payment.paymentDate.getMonth() === startDate.getMonth() &&
          payment.paymentDate.getFullYear() === startDate.getFullYear() &&
          payment.status === "paid",
      );

      const monthPaid = monthPayments.reduce(
        (sum, payment) => sum + payment.amountPaid,
        0,
      );

      if (monthPaid < rentAmount) {
        unpaidRent = rentAmount - monthPaid;
        unpaidMonths++;
      }
    }
    startDate.setMonth(startDate.getMonth() + 1);
  }

  // Calculate nextDueDate based on lease end
  const nextDueDate =
    leaseEnd && leaseEnd < new Date(now.getFullYear(), now.getMonth() + 1, 1)
      ? null
      : new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const daysLate = now.getDate();

  const baseRentDue = partialMonthEnd ? partialMonthEnd.amount : rentAmount;
  const totalDue = unpaidMonths > 1 ? baseRentDue + unpaidRent : baseRentDue;

  return {
    rentDue: baseRentDue,
    totalDue,
    nextDueDate,
    paymentStatus: {
      current: unpaidRent === 0,
      daysLate,
      unpaidMonths,
    },
    partialMonth: partialMonthEnd,
  };
};
