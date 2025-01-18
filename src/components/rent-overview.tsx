import { calculateRentDue } from "@/util/rent-due";
import { getUnitRent } from "@/util/unit";
import { redirect } from "next/navigation";
import PaymentSchedule from "@/components/payment-schedule";
import RentPayment from "@/components/rent-payment";

export default async function RentOverview({ id }: { id: string }) {
  const { unit } = await getUnitRent(id, {
    include: {
      rentPayments: true,
    },
  });

  if (!unit || !unit.leaseStart || !unit.leaseEnd) {
    return redirect("/rent");
  }

  const rentDue = calculateRentDue(unit, unit.rentPayments);

  return (
    <div className="container mx-auto flex flex-col lg:flex-row gap-4 p-4 pt-0 max-w-5xl">
      <div className="lg:w-1/2 flex flex-col gap-4">
        <RentPayment rentDue={rentDue} unit={unit} />
      </div>
      <PaymentSchedule className="lg:w-1/2" periods={rentDue.periods} />
    </div>
  );
}
