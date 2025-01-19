"use client";

import { formatCurrency } from "@/util/currency";
import { Button } from "./ui/button";
import { useCheckout } from "@/providers/checkout-provider";

export function CheckoutButton({ amount }: { amount: number }) {
  const { state: checkout } = useCheckout();
  return (
    <Button type="submit" form="checkoutForm" disabled={checkout.loading}>
      {checkout.loading ? `Pay ${formatCurrency(amount)}` : "Processing..."}
    </Button>
  );
}
