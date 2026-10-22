const { spanishTags } = require('../../../infrastructure/openapi/spanish_tags')
const {
  buildDeleteByIdRouteSchema,
  buildNotFoundResponseSchema,
} = require('../../../infrastructure/http/route_schema_helpers')

const userResponseSchema = {
  type: 'object',
  required: [
    'id',
    'email',
    'fullName',
    'isActive',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
    fullName: { type: 'string' },
    isActive: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    roles: { type: 'array' },
  },
}

const listUsersRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Listar usuarios',
  response: {
    200: {
      type: 'object',
      required: ['data'],
      properties: { data: { type: 'array', items: userResponseSchema } },
    },
  },
}

const createUserRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Crear usuario',
  description: 'La contraseña se almacena cifrada; no se devuelve en la respuesta.',
  body: {
    type: 'object',
    required: ['email', 'password', 'fullName'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8, maxLength: 128 },
      fullName: { type: 'string', minLength: 1, maxLength: 120 },
      isActive: { type: 'boolean', default: true },
    },
  },
  response: { 201: userResponseSchema },
}

const getUserByIdRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Consultar usuario por id',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  response: {
    200: userResponseSchema,
    404: buildNotFoundResponseSchema(),
  },
}

const updateUserRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Actualizar usuario',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8, maxLength: 128 },
      fullName: { type: 'string', minLength: 1, maxLength: 120 },
      isActive: { type: 'boolean' },
    },
  },
  response: { 200: userResponseSchema },
}

const deleteUserRouteSchema = buildDeleteByIdRouteSchema({
  tag: spanishTags.ACCESO,
  summary: 'Eliminar usuario',
  description: 'No se puede eliminar si tiene ventas registradas.',
})

const assignUserRoleRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Asignar rol a usuario',
  params: {
    type: 'object',
    required: ['userId', 'roleId'],
    properties: {
      userId: { type: 'string' },
      roleId: { type: 'string' },
    },
  },
  response: {
    201: {
      type: 'object',
      required: ['userId', 'roleId', 'assignedAt'],
      properties: {
        userId: { type: 'string' },
        roleId: { type: 'string' },
        assignedAt: { type: 'string', format: 'date-time' },
      },
    },
  },
}

const removeUserRoleRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Quitar rol de usuario',
  params: {
    type: 'object',
    required: ['userId', 'roleId'],
    properties: {
      userId: { type: 'string' },
      roleId: { type: 'string' },
    },
  },
  response: { 204: { type: 'null' } },
}

module.exports = {
  assignUserRoleRouteSchema,
  createUserRouteSchema,
  deleteUserRouteSchema,
  getUserByIdRouteSchema,
  listUsersRouteSchema,
  removeUserRoleRouteSchema,
  updateUserRouteSchema,
}
