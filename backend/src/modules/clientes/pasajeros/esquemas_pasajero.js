const { spanishTags } = require('../../../infrastructure/openapi/spanish_tags')
const {
  buildDeleteByIdRouteSchema,
  buildNotFoundResponseSchema,
} = require('../../../infrastructure/http/route_schema_helpers')

const passengerResponseSchema = {
  type: 'object',
  required: [
    'id',
    'fullName',
    'documentNumber',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: { type: 'string' },
    fullName: { type: 'string' },
    documentNumber: { type: 'string' },
    email: { type: ['string', 'null'] },
    phoneNumber: { type: ['string', 'null'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
}

const listPassengersRouteSchema = {
  tags: [spanishTags.CLIENTES],
  summary: 'Listar pasajeros',
  response: {
    200: {
      type: 'object',
      required: ['data'],
      properties: { data: { type: 'array', items: passengerResponseSchema } },
    },
  },
}

const createPassengerRouteSchema = {
  tags: [spanishTags.CLIENTES],
  summary: 'Registrar pasajero',
  body: {
    type: 'object',
    required: ['fullName', 'documentNumber'],
    properties: {
      fullName: { type: 'string', minLength: 1, maxLength: 120 },
      documentNumber: { type: 'string', minLength: 1, maxLength: 64 },
      email: { type: 'string', maxLength: 120 },
      phoneNumber: { type: 'string', maxLength: 32 },
    },
  },
  response: { 201: passengerResponseSchema },
}

const getPassengerByIdRouteSchema = {
  tags: [spanishTags.CLIENTES],
  summary: 'Consultar pasajero por id',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  response: {
    200: passengerResponseSchema,
    404: buildNotFoundResponseSchema(),
  },
}

const updatePassengerRouteSchema = {
  tags: [spanishTags.CLIENTES],
  summary: 'Actualizar pasajero',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  body: {
    type: 'object',
    properties: {
      fullName: { type: 'string', minLength: 1, maxLength: 120 },
      documentNumber: { type: 'string', minLength: 1, maxLength: 64 },
      email: { type: ['string', 'null'], maxLength: 120 },
      phoneNumber: { type: ['string', 'null'], maxLength: 32 },
    },
  },
  response: { 200: passengerResponseSchema },
}

const deletePassengerRouteSchema = buildDeleteByIdRouteSchema({
  tag: spanishTags.CLIENTES,
  summary: 'Eliminar pasajero',
  description: 'No se puede eliminar si tiene boletos o ventas asociadas.',
})

module.exports = {
  createPassengerRouteSchema,
  deletePassengerRouteSchema,
  getPassengerByIdRouteSchema,
  listPassengersRouteSchema,
  updatePassengerRouteSchema,
}
