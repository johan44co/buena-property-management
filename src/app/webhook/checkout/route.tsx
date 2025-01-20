import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createRentPayment } from "@/util/rent-payment";

export const revalidate = 0;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature")!;

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );

    let response;

    switch (event.type) {
      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;
        await Promise.all(
          invoice.lines.data.map(async (line) => {
            const amount = line.amount / 100;
            const metadata = line.metadata;
            const rentPayment = await createRentPayment({
              unitId: metadata.unitId,
              tenantId: metadata.tenantId,
              amountPaid: amount,
              status: "paid",
              dueDate: new Date(metadata.dueDate),
            });
            response = rentPayment;
            console.warn("Rent payment created:", rentPayment);
          }),
        );
        break;
      default:
        break;
    }

    return NextResponse.json(
      { received: true, response },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 },
    );
  }
}
