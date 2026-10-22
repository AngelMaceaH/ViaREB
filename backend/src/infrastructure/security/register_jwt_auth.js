const fastifyJwt = require('@fastify/jwt')
const { apiMessages } = require('../http/api_messages')
const { isPublicApiRoute } = require('./public_api_routes')

async function registerJwtAuth(application) {
  const jwtSecret = application.config.JWT_SECRET
  const jwtExpiresIn = application.config.JWT_EXPIRES_IN ?? '8h'

  await application.register(fastifyJwt, {
    secret: jwtSecret,
    sign: {
      expiresIn: jwtExpiresIn,
    },
  })

  application.decorate('authenticate', async function authenticate(request, reply) {
    try {
      await request.jwtVerify()
    } catch {
      return reply.status(401).send({ message: apiMessages.unauthorized })
    }
  })

  application.addHook('onRequest', async (request, reply) => {
    if (!request.url.startsWith('/api/')) {
      return
    }

    if (isPublicApiRoute(request.method, request.url)) {
      return
    }

    await application.authenticate(request, reply)
  })
}

module.exports = { registerJwtAuth }
