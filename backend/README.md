# ViaREB Backend

Node.js API (Fastify) with PostgreSQL and Prisma.

## Run with Docker (whole stack)

From the **repository root**:

```bash
docker compose up -d --build
```

See the root `README.md` for URLs and team instructions.

## Prerequisites (local Node development)

- Node.js 20+ (LTS recommended; Node 24 may work but is less tested)
- Docker Desktop (recommended for local PostgreSQL)

After `npm install`, the Prisma client is generated in `postinstall`. If you see `Cannot find module '.prisma/client/default'`, run:

```bash
npm run db:generate
```

## Local database

1. Copy environment variables **before** `npm run dev`:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell: `Copy-Item .env.example .env`

2. Start PostgreSQL (exposed on host port **5434** by default; change `docker-compose.develop.yml` if that port is in use):

   ```bash
   docker compose -f docker/docker-compose.develop.yml up -d
   ```

3. Apply migrations:

   ```bash
   npm run db:migrate
   ```

   For production or CI without prompts: `npm run db:migrate:deploy`

4. Generate the Prisma client (after schema changes):

   ```bash
   npm run db:generate
   ```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | API with Node watch mode (hot reload) |
| `npm run db:migrate` | Create/apply migrations in development |
| `npm run db:studio` | Prisma Studio UI |

## API

- `GET /api/health` — API and database connectivity check
- `GET /docs` — Swagger UI (OpenAPI)
- `GET /api/fleet/buses` — List buses (reference module)
- `POST /api/fleet/buses` — Create bus
- `GET /api/sales/tickets` — List tickets with passenger and route labels

## Adding a new route module

1. Create a folder under `src/modules/<domain>/<resource>/` (example: `src/modules/fleet/routes/`).
2. Add JSON schemas for Fastify in `*_schemas.js` (body, params, response) and include OpenAPI `tags`.
3. Implement handlers in `*_routes.js` using `getPrismaClient()` from `src/infrastructure/database/prisma_client.js`.
4. Export `register<Resource>Routes(application)` and call it from `src/routes/register_application_routes.js`.
5. Add a matching tag in `src/infrastructure/openapi/register_openapi.js` if you introduce a new API group.

The **buses** module is the copy-paste reference for the team.

### Optional demo data

```bash
node prisma/seed.js
```

Requires `DATABASE_URL` in `.env` and applied migrations.
