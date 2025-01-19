"use client";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCheckout } from "@/providers/checkout-provider";
import { retrievePaymentIntent } from "@/util/checkout";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { state: checkout, dispatch } = useCheckout();
  const searchParams = useSearchParams();
  const params = useParams<{
    entity: string;
    id: string;
  }>();

  const payment_intent = searchParams.get("payment_intent");
  const { entity, id } = params;

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      const { paymentIntent } = await retrievePaymentIntent(payment_intent);
      dispatch({ type: "SET_PAYMENT_INTENT", payload: paymentIntent });
      if (
        paymentIntent?.status !== "succeeded" &&
        paymentIntent?.status !== "processing"
      ) {
        dispatch({
          type: "SET_ERROR_MESSAGE",
          payload: "Payment failed or requires action. Please try again",
        });
      }
    };
    fetchPaymentIntent();
  }, [payment_intent]);

  const status = checkout.paymentIntent?.status;

  const title =
    status === "succeeded" ? "Payment Successful" : "Payment Failed";
  const description =
    status === "succeeded"
      ? "Your payment was successful"
      : "Your payment failed. Please try again";
  const button = status === "succeeded" ? "Go Back" : "Try Again";
  const href =
    status === "succeeded" ? `/${entity}/${id}` : `/${entity}/${id}/checkout`;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        {status === "succeeded" ? (
          <DialogClose asChild>
            <Button>{button}</Button>
          </DialogClose>
        ) : (
          <Link href={href} replace={true}>
            <Button>{button}</Button>
          </Link>
        )}
      </DialogFooter>
    </>
  );
}
