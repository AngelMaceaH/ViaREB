const { apiMessages } = require('../../../infrastructure/http/api_messages')
const {
  authenticateWithPassword,
  findUserByIdForSession,
  serializeSessionUser,
} = require('./servicio_autenticacion')
const {
  currentSessionRouteSchema,
  loginRouteSchema,
} = require('./esquemas_autenticacion')

async function registerAuthRoutes(application) {
  application.post('/api/auth/login', {
    schema: loginRouteSchema,
  }, async (request, reply) => {
    const { email, password } = request.body
    const authResult = await authenticateWithPassword(email, password)

    if (!authResult.ok) {
      return reply.status(401).send({ message: apiMessages.invalidCredentials })
    }

    const accessToken = await reply.jwtSign(authResult.jwtPayload)
    const sessionUser = await serializeSessionUser(authResult.userRecord)

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: application.config.JWT_EXPIRES_IN ?? '8h',
      user: sessionUser,
    }
  })

  application.get('/api/auth/me', {
    schema: currentSessionRouteSchema,
  }, async (request, reply) => {
    const userId = request.user.sub
    const userRecord = await findUserByIdForSession(userId)

    if (!userRecord || !userRecord.isActive) {
      return reply.status(401).send({ message: apiMessages.unauthorized })
    }

    return serializeSessionUser(userRecord)
  })
}

module.exports = { registerAuthRoutes }
