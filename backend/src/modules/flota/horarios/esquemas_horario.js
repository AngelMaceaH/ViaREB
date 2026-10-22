const { spanishTags } = require('../../../infrastructure/openapi/spanish_tags')
const {
  buildDeleteByIdRouteSchema,
  buildNotFoundResponseSchema,
} = require('../../../infrastructure/http/route_schema_helpers')

const scheduleResponseSchema = {
  type: 'object',
  required: [
    'id',
    'routeId',
    'busId',
    'driverId',
    'departureAt',
    'isActive',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: { type: 'string' },
    routeId: { type: 'string' },
    busId: { type: 'string' },
    driverId: { type: 'string' },
    departureAt: { type: 'string', format: 'date-time' },
    arrivalAt: { type: ['string', 'null'], format: 'date-time' },
    isActive: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    route: { type: 'object' },
    bus: { type: 'object' },
    driver: { type: 'object' },
  },
}

const listSchedulesRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Listar horarios de salida',
  description: 'Salidas programadas con ruta, autobús y chofer.',
  response: {
    200: {
      type: 'object',
      required: ['data'],
      properties: { data: { type: 'array', items: scheduleResponseSchema } },
    },
  },
}

const createScheduleRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Programar salida',
  body: {
    type: 'object',
    required: ['routeId', 'busId', 'driverId', 'departureAt'],
    properties: {
      routeId: { type: 'string' },
      busId: { type: 'string' },
      driverId: { type: 'string' },
      departureAt: { type: 'string', format: 'date-time' },
      arrivalAt: { type: 'string', format: 'date-time' },
      isActive: { type: 'boolean', default: true },
    },
  },
  response: { 201: scheduleResponseSchema },
}

const getScheduleByIdRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Consultar horario por id',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  response: {
    200: scheduleResponseSchema,
    404: buildNotFoundResponseSchema(),
  },
}

const updateScheduleRouteSchema = {
  tags: [spanishTags.FLOTA],
  summary: 'Actualizar horario',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  body: {
    type: 'object',
    properties: {
      routeId: { type: 'string' },
      busId: { type: 'string' },
      driverId: { type: 'string' },
      departureAt: { type: 'string', format: 'date-time' },
      arrivalAt: { type: ['string', 'null'], format: 'date-time' },
      isActive: { type: 'boolean' },
    },
  },
  response: { 200: scheduleResponseSchema },
}

const deleteScheduleRouteSchema = buildDeleteByIdRouteSchema({
  tag: spanishTags.FLOTA,
  summary: 'Eliminar horario',
  description: 'No se puede eliminar si tiene boletos vendidos.',
})

module.exports = {
  createScheduleRouteSchema,
  deleteScheduleRouteSchema,
  getScheduleByIdRouteSchema,
  listSchedulesRouteSchema,
  updateScheduleRouteSchema,
}
