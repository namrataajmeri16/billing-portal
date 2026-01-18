import { prisma } from "../db/prisma";

export async function processWebhook(eventId: string) {
  const evt = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
  if (!evt || evt.processedAt) return;

  switch (evt.type) {
    case "payment.succeeded":
      // call your payment settlement logic if needed
      break;
    case "payment.failed":
      // mark payment failed, schedule retry
      break;
  }

  await prisma.webhookEvent.update({
    where: { id: eventId },
    data: { processedAt: new Date() },
  });
}
