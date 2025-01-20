"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCheckout } from "@/providers/checkout-provider";
import { useRouter } from "next/navigation";
import React from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const checkout = useCheckout();

  const onOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
      checkout.dispatch({ type: "RESET" });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
