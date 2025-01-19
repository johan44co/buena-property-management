import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function StripeElements({
  amount,
  currency = "eur",
  children,
}: {
  amount?: number;
  currency?: string;
  children: React.ReactNode;
}) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        paymentMethodTypes: ["card", "paypal"],
        paymentMethodCreation: "manual",
        mode: "payment", // or setup
        currency,
        amount,
        appearance: {
          theme: "stripe",
          variables: {
            fontFamily: "Arial, Helvetica, sans-serif",
            fontWeightNormal: "500",
            focusBoxShadow:
              "rgb(255, 255, 255) 0px 0px 0px 2px, rgb(10, 10, 10) 0px 0px 0px 4px, rgba(0, 0, 0, 0) 0px 0px 0px 0px",
            colorPrimary: "black",
            borderRadius: "0.375rem",
          },
          rules: {
            ".Input": {
              padding: "0.625rem 0.75rem",
              fontSize: "0.875rem",
              marginTop: "0.5rem",
              boxShadow:
                "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px",
            },
            ".Input:focus": {
              borderColor: "#e6e6e6",
            },
            ".Label": {
              fontSize: "0.875rem",
              marginBottom: "0",
              color: "rgb(55, 65, 81)",
            },
            ".Error": {
              marginTop: "0.5rem",
              fontSize: "0.875rem",
            },
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
