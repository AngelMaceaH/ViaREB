const Fastify = require('fastify');
const cors = require('@fastify/cors');
const envPlugin = require('@fastify/env');
const { prismaClient } = require('./infrastructure/database/prisma_client');

const environmentSchema = {
  type: 'object',
  required: ['DATABASE_URL'],
  properties: {
    DATABASE_URL: { type: 'string' },
    NODE_ENV: { type: 'string', default: 'development' },
    PORT: { type: 'string', default: '3000' },
    CORS_ORIGIN: { type: 'string', default: 'http://localhost:5173' },
  },
};

const application = Fastify({
  logger: true,
});

async function start() {
  await application.register(envPlugin, {
    schema: environmentSchema,
    dotenv: true,
  });

  await application.register(cors, {
    origin: application.config.CORS_ORIGIN,
  });

  application.get('/api/health', async () => {
    await prismaClient.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      message: 'ViaREB API is running',
      database: 'connected',
    };
  });

  application.addHook('onClose', async () => {
    await prismaClient.$disconnect();
  });

  try {
    const port = Number(application.config.PORT);

    await application.listen({
      port,
      host: '0.0.0.0',
    });
  } catch (error) {
    application.log.error(error);
    process.exit(1);
  }
}

start();
