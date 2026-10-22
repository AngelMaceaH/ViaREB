const { spanishTags } = require('../../../infrastructure/openapi/spanish_tags')
const {
  buildDeleteByIdRouteSchema,
  buildNotFoundResponseSchema,
} = require('../../../infrastructure/http/route_schema_helpers')

const ticketListItemSchema = {
  type: 'object',
  required: [
    'id',
    'ticketCode',
    'passengerName',
    'routeLabel',
    'status',
    'price',
  ],
  properties: {
    id: { type: 'string' },
    ticketCode: { type: 'string' },
    saleId: { type: 'string' },
    scheduleId: { type: 'string' },
    passengerId: { type: 'string' },
    passengerName: { type: 'string' },
    routeLabel: { type: 'string' },
    status: {
      type: 'string',
      enum: ['VALID', 'USED', 'CANCELLED', 'EXPIRED'],
    },
    price: { type: 'number' },
    seatNumber: { type: ['integer', 'null'] },
    validatedAt: { type: ['string', 'null'], format: 'date-time' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
}

const listTicketsRouteSchema = {
  tags: [spanishTags.VENTAS],
  summary: 'Listar boletos',
  description: 'Listado general de boletos emitidos.',
  response: {
    200: {
      type: 'object',
      required: ['data'],
      properties: {
        data: { type: 'array', items: ticketListItemSchema },
      },
    },
  },
}

const getTicketByCodeRouteSchema = {
  tags: [spanishTags.VENTAS],
  summary: 'Buscar boleto por código',
  description: 'Consulta rápida para validación en punto de embarque.',
  params: {
    type: 'object',
    required: ['ticketCode'],
    properties: { ticketCode: { type: 'string' } },
  },
  response: {
    200: ticketListItemSchema,
    404: buildNotFoundResponseSchema(),
  },
}

const getTicketByIdRouteSchema = {
  tags: [spanishTags.VENTAS],
  summary: 'Consultar boleto por id',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  response: {
    200: ticketListItemSchema,
    404: buildNotFoundResponseSchema(),
  },
}

const updateTicketStatusRouteSchema = {
  tags: [spanishTags.VENTAS],
  summary: 'Actualizar estado del boleto',
  description:
    'Cambia el estado (por ejemplo a USADO al validar). Si el estado es USADO, se registra validatedAt.',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: {
        type: 'string',
        enum: ['VALID', 'USED', 'CANCELLED', 'EXPIRED'],
      },
    },
  },
  response: { 200: ticketListItemSchema },
}

const deleteTicketRouteSchema = buildDeleteByIdRouteSchema({
  tag: spanishTags.VENTAS,
  summary: 'Eliminar boleto',
  description: 'Elimina un boleto individual de forma permanente.',
})

module.exports = {
  deleteTicketRouteSchema,
  getTicketByCodeRouteSchema,
  getTicketByIdRouteSchema,
  listTicketsRouteSchema,
  ticketListItemSchema,
  updateTicketStatusRouteSchema,
}
