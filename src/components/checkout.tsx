"use client";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StripeElements from "./stripe-elements";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { createPaymentIntent } from "@/util/checkout";
import { useSession } from "next-auth/react";

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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");

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
    setLoading(true);
    const { clientSecret } = await createPaymentIntent({ id });
    stripeElements.submit();
    const { paymentMethod } = await stripeInstance.createPaymentMethod({
      elements: stripeElements,
      params: {
        billing_details: { email: session?.user?.email },
      },
    });
    if (clientSecret && paymentMethod) {
      const url = new URL(`/${entity}/${id}/payment`, window.location.origin);
      const { paymentIntent, error } = await stripeInstance.confirmPayment({
        clientSecret: clientSecret,
        confirmParams: {
          return_url: url.href,
          payment_method: paymentMethod.id,
          save_payment_method: true,
        },
        redirect: "if_required",
      });
      if (error) {
        setErrorMessage(error.message);
      } else {
        url.searchParams.set("payment_intent", paymentIntent.id);
        router.replace(url.pathname + url.search, { scroll: false });
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" id="checkoutForm">
      <PaymentElement
        options={{
          layout: {
            type: "tabs",
          },
          readOnly: loading,
        }}
        onLoaderStart={() => setLoading(true)}
        onReady={() => setLoading(false)}
        onChange={() => setErrorMessage("")}
      />
      {errorMessage && (
        <Alert variant="destructive" className="mt-80">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
