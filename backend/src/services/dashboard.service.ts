import { prisma } from "../db/prisma";

export async function getDashboard(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      subscriptions: {
        where: { status: "active" },
        include: { plan: true },
      },
      invoices: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      payments: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!customer) throw new Error("Customer not found");

  return {
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
    },
    subscription: customer.subscriptions[0] ?? null,
    upcomingInvoice: customer.invoices[0] ?? null,
    recentPayments: customer.payments,
  };
}
