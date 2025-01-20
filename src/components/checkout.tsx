"use client";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import StripeElements from "./stripe-elements";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  createPaymentIntentAction,
  createPaymentMethodAction,
  confirmPaymentAction,
  useCheckout,
} from "@/providers/checkout-provider";

export default function Checkout({
  currency = "eur",
  amount,
}: {
  currency?: string;
  amount?: number;
}) {
  return currency && amount ? (
    <StripeElements currency={currency} amount={amount}>
      <CheckoutForm />
    </StripeElements>
  ) : null;
}

function CheckoutForm() {
  const { state: checkout, dispatch } = useCheckout();
  const stripeElements = useElements();
  const stripeInstance = useStripe();

  const { data: session } = useSession();
  const { id, entity } = useParams<{ id: string; entity: string }>();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripeElements || !stripeInstance) {
      return;
    }
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch(createPaymentIntentAction(id))
      .then(async (clientSecret) => {
        const paymentMethod = await dispatch(
          createPaymentMethodAction(
            stripeInstance,
            stripeElements,
            session?.user?.email,
          ),
        );
        return { clientSecret, paymentMethod };
      })
      .then(({ clientSecret, paymentMethod }) => {
        return dispatch(
          confirmPaymentAction(
            stripeInstance,
            router,
            clientSecret,
            paymentMethod,
            new URL(`/${entity}/${id}/payment`, window.location.origin),
          ),
        );
      })
      .finally(() => {
        dispatch({ type: "SET_LOADING", payload: false });
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" id="checkoutForm">
      <PaymentElement
        options={{
          layout: {
            type: "tabs",
          },
          readOnly: checkout.loading,
        }}
        onLoaderStart={() => dispatch({ type: "SET_LOADING", payload: true })}
        onReady={() => dispatch({ type: "SET_LOADING", payload: false })}
      />
      {checkout.errorMessage && (
        <Alert variant="destructive" className="mt-80">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{checkout.errorMessage}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
