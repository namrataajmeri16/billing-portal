import { FastifyInstance } from "fastify";
import { upgradeSubscription } from "../services/subscription.service";

export async function subscriptionRoutes(app: FastifyInstance) {
  app.post("/api/subscriptions/:id/upgrade", async (req) => {
    const { id } = req.params as { id: string };
    const { newPlanId } = req.body as { newPlanId: string };

    return upgradeSubscription(id, newPlanId);
  });
}

