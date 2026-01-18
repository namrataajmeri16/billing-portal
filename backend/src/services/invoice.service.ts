import { prisma } from "../db/prisma";

export async function addProrationLineItems({
  invoiceId,
  creditCents,
  chargeCents,
}: {
  invoiceId: string;
  creditCents: number;
  chargeCents: number;
}) {
  await prisma.invoiceLineItem.createMany({
    data: [
      {
        invoiceId,
        description: "Proration credit (unused time)",
        amountCents: -creditCents,
      },
      {
        invoiceId,
        description: "Proration charge (remaining time)",
        amountCents: chargeCents,
      },
      {
      invoiceId: invoice.id,
      type: "credit",
      amountCents: -proration.creditCents,
      description: "Unused time on Basic plan",
    },
    {
      invoiceId: invoice.id,
      type: "debit",
      amountCents: proration.debitCents,
      description: "Remaining time on Pro plan",
    },
    ],
  });
}
