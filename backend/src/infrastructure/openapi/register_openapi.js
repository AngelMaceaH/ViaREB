const swaggerPlugin = require('@fastify/swagger')
const swaggerUiPlugin = require('@fastify/swagger-ui')
const { swaggerTagDefinitions } = require('./spanish_tags')

async function registerOpenApi(application, options = {}) {
  const serverPort = options.serverPort ?? 8000
  const serverUrl = options.serverUrl ?? `http://localhost:${serverPort}`

  await application.register(swaggerPlugin, {
    openapi: {
      info: {
        title: 'ViaREB API',
        description:
          'API REST para venta y validación de boletos de autobús (USAP). Documentación en español.',
        version: '1.0.0',
      },
      tags: swaggerTagDefinitions,
      servers: [
        {
          url: serverUrl,
          description: 'Servidor actual',
        },
      ],
    },
  })

  await application.register(swaggerUiPlugin, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
  })
}

module.exports = { registerOpenApi }
