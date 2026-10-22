const { spanishTags } = require('../../../infrastructure/openapi/spanish_tags')
const {
  buildDeleteByIdRouteSchema,
  buildNotFoundResponseSchema,
} = require('../../../infrastructure/http/route_schema_helpers')

const permissionResponseSchema = {
  type: 'object',
  required: ['id', 'code', 'name', 'createdAt', 'updatedAt'],
  properties: {
    id: { type: 'string' },
    code: { type: 'string' },
    name: { type: 'string' },
    description: { type: ['string', 'null'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
}

const listPermissionsRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Listar permisos',
  response: {
    200: {
      type: 'object',
      required: ['data'],
      properties: {
        data: { type: 'array', items: permissionResponseSchema },
      },
    },
  },
}

const createPermissionRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Crear permiso',
  body: {
    type: 'object',
    required: ['code', 'name'],
    properties: {
      code: { type: 'string', minLength: 1, maxLength: 80 },
      name: { type: 'string', minLength: 1, maxLength: 120 },
      description: { type: 'string', maxLength: 255 },
    },
  },
  response: { 201: permissionResponseSchema },
}

const getPermissionByIdRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Consultar permiso por id',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  response: {
    200: permissionResponseSchema,
    404: buildNotFoundResponseSchema(),
  },
}

const updatePermissionRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Actualizar permiso',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  body: {
    type: 'object',
    properties: {
      code: { type: 'string', minLength: 1, maxLength: 80 },
      name: { type: 'string', minLength: 1, maxLength: 120 },
      description: { type: ['string', 'null'], maxLength: 255 },
    },
  },
  response: { 200: permissionResponseSchema },
}

const deletePermissionRouteSchema = buildDeleteByIdRouteSchema({
  tag: spanishTags.ACCESO,
  summary: 'Eliminar permiso',
  description: 'Elimina el permiso y lo desvincula de los roles.',
})

module.exports = {
  createPermissionRouteSchema,
  deletePermissionRouteSchema,
  getPermissionByIdRouteSchema,
  listPermissionsRouteSchema,
  updatePermissionRouteSchema,
}
