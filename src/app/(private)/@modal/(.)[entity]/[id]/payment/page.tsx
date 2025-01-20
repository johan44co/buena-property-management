"use client";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  retrievePaymentIntentAction,
  useCheckout,
} from "@/providers/checkout-provider";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { state: checkout, dispatch } = useCheckout();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams<{
    entity: string;
    id: string;
  }>();

  const payment_intent = searchParams.get("payment_intent");
  const { entity, id } = params;

  useEffect(() => {
    dispatch(retrievePaymentIntentAction(payment_intent));
  }, [payment_intent]);

  if (!payment_intent) {
    router.back();
  }

  const status = checkout.paymentIntent?.status;
  const paymentConfig = {
    succeeded: {
      title: "Payment Successful",
      description: "Your payment was successful",
      button: "Go Back",
      href: `/${entity}/${id}`,
    },
    failed: {
      title: "Payment Failed",
      description: "Your payment failed. Please try again",
      button: "Try Again",
      href: `/${entity}/${id}/checkout`,
    },
  };

  const { title, description, button, href } =
    paymentConfig[status === "succeeded" ? "succeeded" : "failed"];

  if (!status) {
    return null;
  }

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
