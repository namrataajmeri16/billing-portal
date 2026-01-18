import Fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";
import { dashboardRoutes } from "./routes/dashboard";
import { subscriptionRoutes } from "./routes/subscription";
import { webhookRoutes } from "./routes/webhook.routes";
import { prisma } from "./db/prisma";
import fastifyRawBody from "fastify-raw-body";

const app = Fastify({ logger: true,
  bodyLimit: 1048576,
  exposeHeadRoutes: false,
 });

app.register(fastifyRawBody, {
  field: "rawBody",      // req.rawBody
  global: false,         // only for routes that ask for it
  encoding: "utf8",
  runFirst: true,
});



app.register(cors, { origin: true });
app.register(dashboardRoutes);
app.register(subscriptionRoutes);
app.register(webhookRoutes);


app.get("/health", async () => {
  return { status: "ok" };
});

app.post("/webhooks/replay/:id", async (req) => {
  await prisma.webhookEvent.update({
    where: { id: req.params.id },
    data: { processedAt: null },
  });
  return { replayQueued: true };
});


const port = Number(process.env.PORT) || 3000;

app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log(`API running on port ${port}`);
});
