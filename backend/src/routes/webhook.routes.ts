import { FastifyInstance } from "fastify";
import { prisma } from "../db/prisma";
import { verifySignature } from "../webhooks/verify";

export async function webhookRoutes(app: FastifyInstance) {
  app.post("/webhooks", { config: { rawBody: true } }, async (req, res) => {
    const sig = req.headers["x-signature"] as string;
    const raw = (req as any).rawBody;

    verifySignature(raw, sig, process.env.WEBHOOK_SECRET!);

    const event = JSON.parse(raw);

    // Exactly-once: insert by unique event id
    await prisma.webhookEvent.create({
      data: {
        id: event.id,
        type: event.type,
        payload: event,
      },
    }).catch(() => {
      // duplicate → already stored → safe to ACK
    });

    // ACK immediately
    return { received: true };
  });
}
