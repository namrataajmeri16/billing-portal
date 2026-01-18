import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Customer
  const customer = await prisma.customer.create({
    data: {
      name: "Acme Corp",
      email: "billing@acme.com",
    },
  });

  // 2. Plan
  const plan = await prisma.plan.create({
    data: {
      code: "pro_monthly",
      name: "Pro",
      amountCents: 2000,
      currency: "USD",
      interval: "month",
    },
  });

  // 3. Active subscription
  const subscription = await prisma.subscription.create({
    data: {
      customerId: customer.id,
      planCode: plan.code,
      status: "active",
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // 4. Open invoice (money due)
  const invoice = await prisma.invoice.create({
    data: {
      customerId: customer.id,
      status: "open",
      totalCents: 2000,
      currency: "USD",
      dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  });

  // 5. Past payments (history)
  await prisma.payment.createMany({
    data: [
      {
        customerId: customer.id,
        invoiceId: invoice.id,
        status: "succeeded",
        amountCents: 2000,
        currency: "USD",
      },
      {
        customerId: customer.id,
        invoiceId: invoice.id,
        status: "failed",
        amountCents: 2000,
        currency: "USD",
      },
    ],
  });

  // 6. Usage events (last 30 days)
  await prisma.usageEvent.createMany({
    data: Array.from({ length: 15 }).map(() => ({
      customerId: customer.id,
      quantity: Math.floor(Math.random() * 10) + 1,
      occurredAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ),
    })),
  });

  console.log("Seeded customerId:", customer.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
