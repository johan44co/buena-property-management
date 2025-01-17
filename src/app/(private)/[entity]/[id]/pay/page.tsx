import { rentDueCalculation } from "@/util/rent-due";
import { getUnitRent } from "@/util/unit";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/util/currency";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
    entity: string;
  }>;
}) {
  const { id, entity } = await params;

  if (entity !== "rent") {
    return redirect("/");
  }

  const { unit } = await getUnitRent(id, {
    include: {
      rentPayments: true,
    },
  });

  const { rentDue, totalDue, nextDueDate, paymentStatus, partialMonth } =
    rentDueCalculation(unit, unit?.rentPayments);

  const needsPayment = totalDue > 0;

  return (
    <div className="container mx-auto p-4 pt-0 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start gap-4 md:flex-row-reverse md:items-center md:justify-between">
            <Badge variant={paymentStatus.current ? "default" : "destructive"}>
              {paymentStatus.current
                ? "Current"
                : `${paymentStatus.daysLate} Days Late`}
            </Badge>
            <CardTitle>Rent Payment</CardTitle>
          </div>
          <CardDescription>
            {unit?.property.address} - Unit {unit?.unitNumber}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rent Due</span>
              <span className="font-medium">{formatCurrency(rentDue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Due</span>
              <span className="font-medium">{formatCurrency(totalDue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next Due Date</span>
              <span className="font-medium">
                {nextDueDate ? format(nextDueDate, "PPP") : "N/A"}
              </span>
            </div>
            {partialMonth && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Partial Month</span>
                <span className="font-medium">
                  {partialMonth.days} days (
                  {formatCurrency(partialMonth.amount)})
                </span>
              </div>
            )}
          </div>

          <Separator />

          {needsPayment ? (
            <div className="space-y-4">
              <h3 className="font-semibold">Make a Payment</h3>
              {/* Payment form placeholder */}
              <div className="h-48 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                <span className="text-muted-foreground">
                  Payment form goes here
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Badge variant="default" className="text-lg">
                No Payment Due
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
