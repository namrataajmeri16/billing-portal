
**Getting started**

Clone the repository

    git clone <repo-url>
-----------------------------------------------------------------------

    cd billing-portal/backend

    npm i
    
Create .env file
Open docker desktop
docker compose -f infra/docker-compose.yml up -d

    npm run dev
    npm prisma generate
    npm run db:seed
    npx prisma studio
--------------------------
    
    npx prisma migrate dev --name core_billing_models

Output : Loaded Prisma config from prisma.config.ts.

 Prisma schema loaded from prisma\schema.prisma.
 Datasource "db": PostgreSQL database "billing_dev", schema "public" at "localhost:5432"

 Applying migration `20260113044549_core_billing_models`

The following migration(s) have been created and applied from new schema changes:

 prisma\migrations/
   └─ 20260113044549_core_billing_models/
     └─ migration.sql

 Your database is now in sync with your schema.

**Explanation:**

I added new model in schema.prisma file
model WebhookEvent {
  id          String   @id              // provider event id
  type        String
  payload     Json
  processedAt DateTime?
  createdAt   DateTime @default(now())
}

    npx prisma migrate dev --name add_webhook_events
    npx prisma generate

    you will be able to see new model WebhookEvent in prisma ui.
----------------------------------------------------------------------

    node sign.js -> output will be alphanumeric that will be signature value. add in below curl commant with x-signature
    
    curl -X POST http://localhost:3000/webhooks   -H "Content-Type: application/json"   -H "x-signature: c9100425f79abe575891ae66d8739c87f58f32b19353f54e6ec9b60b6f2e9123"   --data-binary @event.json

output : {"received":true}

see in

    npx prisma studio.
    
There will be this row in webhookevent table.

if you run webhook again

    curl -X POST http://localhost:3000/webhooks   -H "Content-Type: application/json"   -H "x-signature: c9100425f79abe575891ae66d8739c87f58f32b19353f54e6ec9b60b6f2e9123"   --data-binary @event.json
then also there will one row. This confirms idempotency.
