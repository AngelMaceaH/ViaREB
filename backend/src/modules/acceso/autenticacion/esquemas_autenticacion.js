const { spanishTags } = require('../../../infrastructure/openapi/spanish_tags')

const bearerSecurity = [{ bearerAuth: [] }]

const loginRouteSchema = {
  tags: [spanishTags.AUTENTICACION],
  summary: 'Iniciar sesión',
  description:
    'Valida correo y contraseña. Devuelve un JWT Bearer para el resto de la API.',
  security: [],
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 1, maxLength: 128 },
    },
  },
  response: {
    200: {
      type: 'object',
      required: ['accessToken', 'tokenType', 'expiresIn', 'user'],
      properties: {
        accessToken: { type: 'string' },
        tokenType: { type: 'string', example: 'Bearer' },
        expiresIn: { type: 'string', example: '8h' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            fullName: { type: 'string' },
            roles: { type: 'array', items: { type: 'object' } },
            permissions: { type: 'array', items: { type: 'string' } },
            roleNames: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
    401: {
      type: 'object',
      required: ['message'],
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

const currentSessionRouteSchema = {
  tags: [spanishTags.AUTENTICACION],
  summary: 'Sesión actual',
  description: 'Devuelve el usuario autenticado según el JWT enviado.',
  security: bearerSecurity,
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        fullName: { type: 'string' },
        isActive: { type: 'boolean' },
        permissions: { type: 'array', items: { type: 'string' } },
        roleNames: { type: 'array', items: { type: 'string' } },
        roles: { type: 'array', items: { type: 'object' } },
      },
    },
    401: {
      type: 'object',
      required: ['message'],
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

module.exports = {
  currentSessionRouteSchema,
  loginRouteSchema,
}
