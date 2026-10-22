const { spanishTags } = require('../../../infrastructure/openapi/spanish_tags')
const {
  buildDeleteByIdRouteSchema,
  buildNotFoundResponseSchema,
} = require('../../../infrastructure/http/route_schema_helpers')

const busResponseProperties = {
  id: { type: 'string', description: 'Identificador' },
  licensePlate: { type: 'string', description: 'Placa del vehículo' },
  capacity: { type: 'integer', description: 'Capacidad de asientos' },
  modelName: { type: ['string', 'null'], description: 'Modelo' },
  isActive: { type: 'boolean', description: '¿Activo en flota?' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
}

const busResponseSchema = {
  type: 'object',
  required: [
    'id',
    'licensePlate',
    'capacity',
    'isActive',
    'createdAt',
    'updatedAt',
  ],
  properties: busResponseProperties,
}

const listBusesRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Listar autobuses',
  description: 'Obtiene todos los autobuses ordenados por placa.',
  response: {
    200: {
      type: 'object',
      required: ['data'],
      properties: {
        data: { type: 'array', items: busResponseSchema },
      },
    },
  },
}

const createBusRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Registrar autobús',
  description: 'Crea un nuevo autobús en la flota.',
  body: {
    type: 'object',
    required: ['licensePlate', 'capacity'],
    properties: {
      licensePlate: { type: 'string', minLength: 1, maxLength: 32 },
      capacity: { type: 'integer', minimum: 1, maximum: 200 },
      modelName: { type: 'string', maxLength: 120 },
      isActive: { type: 'boolean', default: true },
    },
  },
  response: { 201: busResponseSchema },
}

const getBusByIdRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Consultar autobús por id',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  response: {
    200: busResponseSchema,
    404: buildNotFoundResponseSchema(),
  },
}

const updateBusRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Actualizar autobús',
  description: 'Modifica placa, capacidad, modelo o estado activo.',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  body: {
    type: 'object',
    properties: {
      licensePlate: { type: 'string', minLength: 1, maxLength: 32 },
      capacity: { type: 'integer', minimum: 1, maximum: 200 },
      modelName: { type: ['string', 'null'], maxLength: 120 },
      isActive: { type: 'boolean' },
    },
  },
  response: {
    200: busResponseSchema,
    404: buildNotFoundResponseSchema(),
  },
}

const deleteBusRouteSchema = buildDeleteByIdRouteSchema({
  tag: spanishTags.FLOTA,
  summary: 'Eliminar autobús',
  description:
    'Elimina el autobús si no está referenciado en horarios u otras operaciones.',
})

module.exports = {
  createBusRouteSchema,
  deleteBusRouteSchema,
  getBusByIdRouteSchema,
  listBusesRouteSchema,
  updateBusRouteSchema,
}
