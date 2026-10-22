const swaggerPlugin = require('@fastify/swagger')
const swaggerUiPlugin = require('@fastify/swagger-ui')

async function registerOpenApi(application, options = {}) {
  const serverPort = options.serverPort ?? 8000
  const serverUrl = options.serverUrl ?? `http://localhost:${serverPort}`

  await application.register(swaggerPlugin, {
    openapi: {
      info: {
        title: 'ViaREB API',
        description:
          'REST API for bus ticket sales and validation (USAP).',
        version: '1.0.0',
      },
      tags: [
        { name: 'System', description: 'Health and operational endpoints' },
        { name: 'Fleet', description: 'Buses, routes, drivers, schedules' },
        { name: 'Sales', description: 'Sales and tickets' },
      ],
      servers: [
        {
          url: serverUrl,
          description: 'Current server',
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
