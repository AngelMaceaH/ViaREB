const { spanishTags } = require('../../../infrastructure/openapi/spanish_tags')
const {
  buildDeleteByIdRouteSchema,
  buildNotFoundResponseSchema,
} = require('../../../infrastructure/http/route_schema_helpers')

const routeResponseSchema = {
  type: 'object',
  required: [
    'id',
    'name',
    'origin',
    'destination',
    'isActive',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    origin: { type: 'string' },
    destination: { type: 'string' },
    distanceKilometers: { type: ['number', 'null'] },
    isActive: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
}

const listRoutesRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Listar rutas',
  description: 'Catálogo de rutas de transporte.',
  response: {
    200: {
      type: 'object',
      required: ['data'],
      properties: { data: { type: 'array', items: routeResponseSchema } },
    },
  },
}

const createRouteRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Registrar ruta',
  body: {
    type: 'object',
    required: ['name', 'origin', 'destination'],
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 120 },
      origin: { type: 'string', minLength: 1, maxLength: 120 },
      destination: { type: 'string', minLength: 1, maxLength: 120 },
      distanceKilometers: { type: 'number', minimum: 0 },
      isActive: { type: 'boolean', default: true },
    },
  },
  response: { 201: routeResponseSchema },
}

const getRouteByIdRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Consultar ruta por id',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  response: {
    200: routeResponseSchema,
    404: buildNotFoundResponseSchema(),
  },
}

const updateRouteRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Actualizar ruta',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 120 },
      origin: { type: 'string', minLength: 1, maxLength: 120 },
      destination: { type: 'string', minLength: 1, maxLength: 120 },
      distanceKilometers: { type: ['number', 'null'] },
      isActive: { type: 'boolean' },
    },
  },
  response: { 200: routeResponseSchema },
}

const deleteRouteRouteSchema = buildDeleteByIdRouteSchema({
  tag: spanishTags.FLOTA,
  summary: 'Eliminar ruta',
  description: 'No se puede eliminar si tiene horarios asociados.',
})

module.exports = {
  createRouteRouteSchema,
  deleteRouteRouteSchema,
  getRouteByIdRouteSchema,
  listRoutesRouteSchema,
  updateRouteRouteSchema,
}
