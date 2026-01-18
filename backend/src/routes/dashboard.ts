import { FastifyInstance } from "fastify";
import { getDashboard } from "../services/dashboard.service";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/api/dashboard", async () => {
    return getDashboard("749353f1-205c-43a6-88dd-3f70932f0fe6");
  });
}
