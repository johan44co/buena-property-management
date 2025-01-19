import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { retrievePaymentIntent } from "@/util/checkout";
import Link from "next/link";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    payment_intent: string;
  }>;
  params: Promise<{
    entity: string;
    id: string;
  }>;
}) {
  const { payment_intent } = await searchParams;
  const { entity, id } = await params;
  const paymentIntent = await retrievePaymentIntent(payment_intent);

  const status = paymentIntent.paymentIntent?.status;

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
          <Link href={href}>
            <Button>{button}</Button>
          </Link>
        )}
      </DialogFooter>
    </>
  );
}
