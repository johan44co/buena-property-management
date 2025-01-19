"use client";
import { formatCurrency } from "@/util/currency";
import { convertUTCToLocal } from "@/util/timezone";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { RentDueResult } from "@/util/rent-due";
import { Unit } from "@prisma/client";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function RentPayment({
  rentDue: { totalDue, nextDueDate, rentStatus, periods },
  unit,
}: {
  rentDue: RentDueResult;
  unit: Unit & { property: { address: string } };
}) {
  const currentPeriod = periods.find((period) => period.current);
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 md:flex-row-reverse md:items-center md:justify-between">
          <Badge variant={rentStatus.pending ? "destructive" : "default"}>
            {rentStatus.pending
              ? `${rentStatus.daysLate} Days Late`
              : "Current"}
          </Badge>
          <CardTitle>Rent Payment</CardTitle>
        </div>
        <CardDescription>
          {unit?.property.address} - Unit {unit?.unitNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {currentPeriod && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Period</span>
              <span className="font-medium">
                {format(convertUTCToLocal(currentPeriod?.startDate), "MMMM d")}{" "}
                - {format(convertUTCToLocal(currentPeriod?.endDate), "MMMM d")}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monthly Rent</span>
            <span className="font-medium">
              {formatCurrency(currentPeriod?.amount || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Due</span>
            <span className="font-medium">{formatCurrency(totalDue)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next Due Date</span>
            <span className="font-medium">
              {nextDueDate ? format(nextDueDate, "MMMM d, yyyy") : "None"}
            </span>
          </div>
        </div>
        <Button
          size="lg"
          className="w-full text-md"
          onClick={() => router.push(`/rent/${unit.id}/checkout`)}
        >
          Checkout
        </Button>
      </CardContent>
    </Card>
  );
}