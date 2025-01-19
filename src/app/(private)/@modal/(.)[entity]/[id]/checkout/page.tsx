import Checkout from "@/components/checkout";
import { CheckoutButton } from "@/components/checkout-button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { calculateRentDue } from "@/util/rent-due";
import { getUnitRent } from "@/util/unit";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const { unit } = await getUnitRent(id, {
    include: {
      rentPayments: true,
    },
  });

  if (!unit || !unit.leaseStart || !unit.leaseEnd) {
    return null;
  }
  const rentDue = calculateRentDue(unit, unit.rentPayments);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">Rent Payment</DialogTitle>
        <DialogDescription>
          {unit.property.address} - {unit.unitNumber}
        </DialogDescription>
      </DialogHeader>
      <Checkout currency="eur" amount={rentDue.totalDue * 100} />
      <DialogFooter>
        <CheckoutButton amount={rentDue.totalDue} />
      </DialogFooter>
    </>
  );
}
