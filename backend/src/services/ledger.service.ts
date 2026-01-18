import { prisma } from "../db/prisma";

export async function postLedgerTransaction(
  entries: { account: any; amountCents: number }[]
) {
  const transactionId = crypto.randomUUID();

  const sum = entries.reduce((a, e) => a + e.amountCents, 0);
  if (sum !== 0) throw new Error("Ledger not balanced");

  await prisma.ledgerEntry.createMany({
  data: [
    {
      account: "accounts_receivable",
      debitCents: proration.debitCents,
      creditCents: 0,
      invoiceId: invoice.id,
    },
    {
      account: "revenue",
      debitCents: 0,
      creditCents: proration.debitCents,
      invoiceId: invoice.id,
    },
  ],
});


  return transactionId;
}

export async function verifyInvoiceLedger(invoiceId: string) {
  const ledger = await prisma.ledgerEntry.findMany({
    where: { invoiceId },
  });

  const debitSum = ledger.reduce((s, e) => s + e.debitCents, 0);
  const creditSum = ledger.reduce((s, e) => s + e.creditCents, 0);

  if (debitSum !== creditSum) {
    throw new Error(
      `Ledger imbalance for invoice ${invoiceId}: debit=${debitSum}, credit=${creditSum}`
    );
  }
}
