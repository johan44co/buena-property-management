import { Unit, RentPayment } from "@prisma/client";
import { convertLocalToUTC } from "./timezone";
import { startOfDay } from "date-fns";

interface RentPeriod {
  startDate: Date;
  endDate: Date;
  amount: number;
  daysInPeriod: number;
  isFullMonth: boolean;
  current: boolean;
}

interface RentStatus {
  pending: boolean;
  daysLate: number;
}

interface RentDueResult {
  leaseStart: Date;
  leaseEnd: Date;
  totalDue: number;
  dueDate: Date | null;
  nextDueDate: Date | null;
  rentStatus: RentStatus;
  periods: RentPeriod[];
}

function getLastDayOfMonth(date: Date): Date {
  const lastDay = new Date(date);
  lastDay.setMonth(lastDay.getMonth() + 1);
  lastDay.setDate(0);
  lastDay.setHours(23, 59, 59, 999);
  return lastDay;
}

function calculatePeriodAmount(
  rentAmount: number,
  daysInPeriod: number,
  isFullMonth: boolean,
  daysInMonth: number,
): number {
  return rentAmount * (isFullMonth ? 1 : daysInPeriod / daysInMonth);
}

function calculateMonthsBetweenDates(startDate: Date, endDate: Date): number {
  return (
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    1
  );
}

export function calculateRentDue(
  unit: Unit,
  rentPayments: RentPayment[],
): RentDueResult {
  const today = convertLocalToUTC(startOfDay(new Date()));
  const leaseStart = unit.leaseStart!;
  const leaseEnd = unit.leaseEnd!;

  const periods = generateRentPeriods(unit, leaseStart, leaseEnd, today);
  const totalPaid = rentPayments.reduce(
    (sum, payment) => sum + payment.amountPaid,
    0,
  );
  const totalDue =
    periods.reduce((sum, period) => sum + period.amount, 0) - totalPaid;
  const currentPeriod = periods.find((period) => period.current);
  const nextPeriod = periods.find((period) => period.startDate > today);

  const rentStatus: RentStatus = {
    pending: totalDue > 0,
    daysLate: calculateDaysLate(today, currentPeriod?.startDate, totalDue),
  };

  return {
    leaseStart,
    leaseEnd,
    totalDue,
    dueDate: currentPeriod?.startDate ?? null,
    nextDueDate: nextPeriod?.startDate ?? null,
    rentStatus,
    periods,
  };
}

function generateRentPeriods(
  unit: Unit,
  leaseStart: Date,
  leaseEnd: Date,
  today: Date,
): RentPeriod[] {
  const numberOfMonths = calculateMonthsBetweenDates(leaseStart, leaseEnd);
  const periods: RentPeriod[] = [];

  for (let i = 0; i < numberOfMonths; i++) {
    const periodStart = new Date(leaseStart);
    periodStart.setMonth(leaseStart.getMonth() + i);
    if (i !== 0) periodStart.setDate(1);

    const periodEnd = calculatePeriodEndDate(leaseStart, leaseEnd, i);
    const lastDayOfMonth = getLastDayOfMonth(periodStart);
    const daysInPeriod = periodEnd.getDate() - periodStart.getDate() + 1;
    const isFullMonth = daysInPeriod === lastDayOfMonth.getDate();

    periods.push({
      startDate: periodStart,
      endDate: convertLocalToUTC(periodEnd),
      amount: calculatePeriodAmount(
        unit.rentAmount,
        daysInPeriod,
        isFullMonth,
        lastDayOfMonth.getDate(),
      ),
      daysInPeriod,
      isFullMonth,
      current: today >= periodStart && today <= periodEnd,
    });
  }

  return periods;
}

function calculatePeriodEndDate(
  leaseStart: Date,
  leaseEnd: Date,
  monthIndex: number,
): Date {
  const endDate = new Date(leaseStart);
  endDate.setMonth(leaseStart.getMonth() + monthIndex + 1);
  endDate.setDate(0);
  endDate.setHours(23, 59, 59, 999);

  if (endDate > leaseEnd) {
    endDate.setTime(leaseEnd.getTime());
    endDate.setHours(23, 59, 59, 999);
  }

  return endDate;
}

function calculateDaysLate(
  today: Date,
  dueDate: Date | undefined,
  totalDue: number,
): number {
  if (!dueDate || totalDue <= 0 || today <= dueDate) return 0;
  return Math.ceil(
    (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
  );
}
