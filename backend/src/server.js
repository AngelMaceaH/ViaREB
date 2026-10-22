const path = require('node:path')

require('dotenv').config({
  path: path.join(__dirname, '..', '.env'),
})

const Fastify = require('fastify')
const cors = require('@fastify/cors')
const envPlugin = require('@fastify/env')

const defaultLocalDatabaseUrl =
  'postgresql://viareb:viareb_local@127.0.0.1:5434/viareb?schema=public'
const {
  createPrismaClient,
  disconnectPrismaClient,
  getPrismaClient,
} = require('./infrastructure/database/prisma_client')
const { registerOpenApi } = require('./infrastructure/openapi/register_openapi')
const { spanishTags } = require('./infrastructure/openapi/spanish_tags')
const { registerApplicationRoutes } = require('./routes/register_application_routes')

const environmentSchema = {
  type: 'object',
  required: ['DATABASE_URL'],
  properties: {
    DATABASE_URL: {
      type: 'string',
      default: defaultLocalDatabaseUrl,
    },
    NODE_ENV: { type: 'string', default: 'development' },
    PORT: { type: 'string', default: '8000' },
    CORS_ORIGIN: { type: 'string', default: 'http://localhost:5173' },
  },
}

const application = Fastify({
  logger: true,
})

async function start() {
  await application.register(envPlugin, {
    schema: environmentSchema,
    dotenv: true,
  })

  createPrismaClient(application.config.DATABASE_URL)

  await application.register(cors, {
    origin: application.config.CORS_ORIGIN,
  })

  const serverPort = Number(application.config.PORT)

  await registerOpenApi(application, {
    serverPort,
    serverUrl: `http://localhost:${serverPort}`,
  })

  await registerApplicationRoutes(application)

  application.get('/api/health', {
    schema: {
      tags: [spanishTags.SISTEMA],
      summary: 'Estado del servicio',
      description: 'Comprueba que la API responde y que la base de datos está accesible.',
      response: {
        200: {
          type: 'object',
          required: ['status', 'message', 'database'],
          properties: {
            status: { type: 'string', example: 'ok' },
            message: {
              type: 'string',
              example: 'La API ViaREB está en ejecución',
            },
            database: { type: 'string', example: 'conectada' },
          },
        },
      },
    },
  }, async () => {
    const prismaClient = getPrismaClient()
    await prismaClient.$queryRaw`SELECT 1`

    return {
      status: 'ok',
      message: 'La API ViaREB está en ejecución',
      database: 'conectada',
    }
  })

  application.addHook('onClose', async () => {
    await disconnectPrismaClient()
  })

  try {
    await application.listen({
      port: serverPort,
      host: '0.0.0.0',
    })
  } catch (error) {
    application.log.error(error)
    process.exit(1)
  }
}

start()
