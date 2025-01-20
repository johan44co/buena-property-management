"use client";

import { formatCurrency } from "@/util/currency";
import { Button } from "./ui/button";
import { useCheckout } from "@/providers/checkout-provider";

export function CheckoutButton({ amount }: { amount: number }) {
  const { state: checkout } = useCheckout();
  const { loading, paymentIntent } = checkout;
  const { status } = paymentIntent || {};
  const isSucceeded = status === "succeeded";
  const disabled = loading || isSucceeded;

  const getButtonText = () => {
    if (loading) return "Processing...";
    if (isSucceeded) return "Waiting...";
    return `Pay ${formatCurrency(amount)}`;
  };

  const button = getButtonText();

  return (
    <Button type="submit" form="checkoutForm" disabled={disabled}>
      {button}
    </Button>
  );
}
