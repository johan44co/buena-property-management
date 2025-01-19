"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckoutProvider } from "@/providers/checkout-provider";
import { useRouter } from "next/navigation";
import React from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const onOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <CheckoutProvider>
        <DialogContent>{children}</DialogContent>
      </CheckoutProvider>
    </Dialog>
  );
}
