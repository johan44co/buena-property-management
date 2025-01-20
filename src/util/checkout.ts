"use server";

import { getSession } from "@/lib/auth";
import Stripe from "stripe";
import { getUnitRent } from "./unit";
import { calculateRentDue } from "./rent-due";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function createPaymentIntent({ id }: { id: string }) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    const email = session.user.email || undefined;
    const { unit } = await getUnitRent(id, {
      include: {
        rentPayments: true,
      },
    });

    if (!unit || !unit.leaseStart || !unit.leaseEnd) {
      return { error: "Unit not found" };
    }

    const rentDue = calculateRentDue(unit, unit.rentPayments);
    const customer = await stripe.customers
      .list({ email, limit: 1 })
      .then(({ data }) => {
        const customer = data[0];
        if (!customer) {
          return stripe.customers.create({ email });
        }
        return customer;
      });

    const invoice = await stripe.invoices.create({
      customer: customer.id,
      payment_settings: {
        payment_method_types: ["card", "paypal"],
      },
      collection_method: "send_invoice",
      days_until_due: 30,
    });

    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      amount: rentDue.totalDue * 100,
      metadata: {
        unitId: unit.id,
        propertyId: unit.propertyId,
        ownerId: unit.property.ownerId,
        tenantId: unit.tenantId,
        dueDate: rentDue.dueDate?.toISOString() || null,
      },
      description: `Rent payment for unit ${unit.property.address} - ${unit.unitNumber}`,
    });

    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    const paymentIntentId =
      typeof finalizedInvoice.payment_intent === "string"
        ? finalizedInvoice.payment_intent
        : finalizedInvoice.payment_intent?.id;
    if (!paymentIntentId) {
      return { error: "Payment intent not found" };
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const clientSecret = paymentIntent.client_secret;
    if (!clientSecret) {
      return { error: "Client secret not found" };
    }

    return { clientSecret };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function retrievePaymentIntent(paymentIntentId: string | null) {
  try {
    if (!paymentIntentId) {
      return { error: "Payment intent not found" };
    }
    const { status, client_secret, id, invoice } =
      await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      paymentIntent: {
        status,
        clientSecret: client_secret,
        invoice: typeof invoice === "string" ? invoice : null,
        // paymentMethod: payment_method,
        id,
      },
    };
  } catch (err) {
    return { error: (err as Error).message };
  }
}
