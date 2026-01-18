import { prisma } from "../db/prisma";
import { calculateProration } from "./proration.service";
import { addProrationLineItems } from "./invoice.service";
import { postLedgerTransaction, verifyInvoiceLedger } from "./ledger.service";
import { LedgerAccount } from "@prisma/client";

export async function upgradeSubscription(
  subscriptionId: string,
  newPlanId: string
) {
    
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: { plan: true },
  });

  if (!subscription) throw new Error("Subscription not found");

  const newPlan = await prisma.plan.findUnique({
    where: { code: newPlanId },
  });

  if (!newPlan) throw new Error("Plan not found");

  const proration = calculateProration({
    oldPriceCents: subscription.plan.amountCents,
    newPriceCents: newPlan.amountCents,
    periodStart: subscription.periodStart,
    periodEnd: subscription.periodEnd,
    changeDate: new Date(),
  });

  // 1) Find or create open invoice
    const invoice = await prisma.invoice.upsert({
        where: { subscriptionId_status: { subscriptionId, status: "open" } },
        update: {},
        create: {
            subscriptionId,
            status: "open",
        },
    });
    // 2) Invoice line items
    await addProrationLineItems({
        invoiceId: invoice.id,
        creditCents: proration.creditCents,
        chargeCents: proration.chargeCents,
    });

    // 3) Ledger (balanced)
    await postLedgerTransaction([
        { account: LedgerAccount.ACCOUNTS_RECEIVABLE, amountCents: proration.prorationCents },
        { account: LedgerAccount.REVENUE, amountCents: -proration.prorationCents },
    ]);

  // Update subscription
  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      planCode: newPlanId,
    },
  });

  await verifyInvoiceLedger(invoice.id)

  return proration;
}
