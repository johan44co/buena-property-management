import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Payment = {
  id: string;
  name: string;
  email: string;
  amount: number;
  avatar: string;
};

const payments: Payment[] = [];

export default function RentCollection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
        <CardDescription>
          Recent payments collected from tenants.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {payments.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No payments found
            </div>
          ) : (
            payments.map((payment) => (
              <div key={payment.id} className="flex items-center">
                {payment.avatar ? (
                  <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
                    <img
                      className="aspect-square h-full w-full"
                      alt={`${payment.name}'s avatar`}
                      src={payment.avatar}
                    />
                  </span>
                ) : (
                  <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9 bg-muted items-center justify-center">
                    <span className="text-muted-foreground">
                      {payment.name.charAt(0).toUpperCase()}
                    </span>
                  </span>
                )}
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {payment.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payment.email}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  +${payment.amount.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
