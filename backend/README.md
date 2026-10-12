# ViaREB Backend

Node.js API (Fastify) with PostgreSQL and Prisma.

## Prerequisites

- Node.js 20+
- Docker Desktop (recommended for local PostgreSQL)

## Local database

1. Start PostgreSQL (exposed on host port **5434** by default; change `docker-compose.develop.yml` if that port is in use):

   ```bash
   docker compose -f docker/docker-compose.develop.yml up -d
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell: `Copy-Item .env.example .env`

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
| `npm run dev` | API with nodemon |
| `npm run db:migrate` | Create/apply migrations in development |
| `npm run db:studio` | Prisma Studio UI |

## API

- `GET /api/health` — API and database connectivity check
