import 'dotenv/config'
import { defineConfig } from 'prisma/config'

// Prisma CLI (generate, migrate) needs a URL in config even when the DB is offline.
// Runtime uses DATABASE_URL from .env via Fastify; this fallback matches .env.example.
const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://viareb:viareb_local@127.0.0.1:5434/viareb?schema=public'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
})
