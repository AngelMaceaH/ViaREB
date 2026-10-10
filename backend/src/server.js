
const Fastify = require('fastify');
const cors = require('@fastify/cors');

const app = Fastify({
  logger: true,
});

async function start() {
  await app.register(cors, {
    origin: 'http://localhost:5173',
  });

  app.get('/api/health', async () => {
    return {
      status: 'ok',
      message: 'ViaREB API is running',
    };
  });

  try {
    await app.listen({
      port: 3000,
      host: '0.0.0.0',
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();
