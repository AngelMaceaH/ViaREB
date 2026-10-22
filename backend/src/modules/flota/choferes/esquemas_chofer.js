const { spanishTags } = require('../../../infrastructure/openapi/spanish_tags')
const {
  buildDeleteByIdRouteSchema,
  buildNotFoundResponseSchema,
} = require('../../../infrastructure/http/route_schema_helpers')

const driverResponseSchema = {
  type: 'object',
  required: [
    'id',
    'fullName',
    'licenseNumber',
    'isActive',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: { type: 'string' },
    fullName: { type: 'string' },
    licenseNumber: { type: 'string' },
    phoneNumber: { type: ['string', 'null'] },
    isActive: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
}

const listDriversRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Listar choferes',
  response: {
    200: {
      type: 'object',
      required: ['data'],
      properties: { data: { type: 'array', items: driverResponseSchema } },
    },
  },
}

const createDriverRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Registrar chofer',
  body: {
    type: 'object',
    required: ['fullName', 'licenseNumber'],
    properties: {
      fullName: { type: 'string', minLength: 1, maxLength: 120 },
      licenseNumber: { type: 'string', minLength: 1, maxLength: 64 },
      phoneNumber: { type: 'string', maxLength: 32 },
      isActive: { type: 'boolean', default: true },
    },
  },
  response: { 201: driverResponseSchema },
}

const getDriverByIdRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Consultar chofer por id',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  response: {
    200: driverResponseSchema,
    404: buildNotFoundResponseSchema(),
  },
}

const updateDriverRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Actualizar chofer',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  body: {
    type: 'object',
    properties: {
      fullName: { type: 'string', minLength: 1, maxLength: 120 },
      licenseNumber: { type: 'string', minLength: 1, maxLength: 64 },
      phoneNumber: { type: ['string', 'null'], maxLength: 32 },
      isActive: { type: 'boolean' },
    },
  },
  response: { 200: driverResponseSchema },
}

const deleteDriverRouteSchema = buildDeleteByIdRouteSchema({
  tag: spanishTags.FLOTA,
  summary: 'Eliminar chofer',
  description: 'No se puede eliminar si tiene horarios asignados.',
})

module.exports = {
  createDriverRouteSchema,
  deleteDriverRouteSchema,
  getDriverByIdRouteSchema,
  listDriversRouteSchema,
  updateDriverRouteSchema,
}
