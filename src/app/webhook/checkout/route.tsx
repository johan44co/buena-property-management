import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createRentPayment } from "@/util/rent-payment";

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

    switch (event.type) {
      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;
        invoice.lines.data.forEach(async (line) => {
          const amount = line.amount / 100;
          const metadata = line.metadata;
          await createRentPayment({
            unitId: metadata.unitId,
            tenantId: metadata.tenantId,
            amountPaid: amount,
            status: "paid",
            dueDate: new Date(metadata.dueDate),
          });
        });
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 },
    );
  }
}
