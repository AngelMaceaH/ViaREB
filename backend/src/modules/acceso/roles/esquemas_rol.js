const { spanishTags } = require('../../../infrastructure/openapi/spanish_tags')
const {
  buildDeleteByIdRouteSchema,
  buildNotFoundResponseSchema,
} = require('../../../infrastructure/http/route_schema_helpers')

const roleResponseSchema = {
  type: 'object',
  required: ['id', 'name', 'createdAt', 'updatedAt'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: ['string', 'null'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    permissions: { type: 'array' },
  },
}

const listRolesRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Listar roles',
  response: {
    200: {
      type: 'object',
      required: ['data'],
      properties: { data: { type: 'array', items: roleResponseSchema } },
    },
  },
}

const createRoleRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Crear rol',
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 80 },
      description: { type: 'string', maxLength: 255 },
    },
  },
  response: { 201: roleResponseSchema },
}

const getRoleByIdRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Consultar rol por id',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  response: {
    200: roleResponseSchema,
    404: buildNotFoundResponseSchema(),
  },
}

const updateRoleRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Actualizar rol',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 80 },
      description: { type: ['string', 'null'], maxLength: 255 },
    },
  },
  response: { 200: roleResponseSchema },
}

const deleteRoleRouteSchema = buildDeleteByIdRouteSchema({
  tag: spanishTags.ACCESO,
  summary: 'Eliminar rol',
  description: 'Elimina el rol y sus asignaciones de permisos.',
})

const assignRolePermissionRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Asignar permiso a rol',
  params: {
    type: 'object',
    required: ['roleId', 'permissionId'],
    properties: {
      roleId: { type: 'string' },
      permissionId: { type: 'string' },
    },
  },
  response: {
    201: {
      type: 'object',
      required: ['roleId', 'permissionId'],
      properties: {
        roleId: { type: 'string' },
        permissionId: { type: 'string' },
      },
    },
  },
}

const removeRolePermissionRouteSchema = {
  tags: [spanishTags.ACCESO],
  summary: 'Quitar permiso de rol',
  params: {
    type: 'object',
    required: ['roleId', 'permissionId'],
    properties: {
      roleId: { type: 'string' },
      permissionId: { type: 'string' },
    },
  },
  response: { 204: { type: 'null' } },
}

module.exports = {
  assignRolePermissionRouteSchema,
  createRoleRouteSchema,
  deleteRoleRouteSchema,
  getRoleByIdRouteSchema,
  listRolesRouteSchema,
  removeRolePermissionRouteSchema,
  updateRoleRouteSchema,
}
