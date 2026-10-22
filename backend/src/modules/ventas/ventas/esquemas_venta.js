const { spanishTags } = require('../../../infrastructure/openapi/spanish_tags')
const {
  buildDeleteByIdRouteSchema,
  buildNotFoundResponseSchema,
} = require('../../../infrastructure/http/route_schema_helpers')

const saleResponseSchema = {
  type: 'object',
  required: [
    'id',
    'soldByUserId',
    'totalAmount',
    'soldAt',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: { type: 'string' },
    soldByUserId: { type: 'string' },
    passengerId: { type: ['string', 'null'] },
    totalAmount: { type: 'number' },
    soldAt: { type: 'string', format: 'date-time' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    tickets: { type: 'array' },
  },
}

const listSalesRouteSchema = {
  tags: [spanishTags.VENTAS],
  summary: 'Listar ventas',
  description: 'Historial de ventas con boletos asociados.',
  response: {
    200: {
      type: 'object',
      required: ['data'],
      properties: {
        data: { type: 'array', items: saleResponseSchema },
      },
    },
  },
}

const createSaleRouteSchema = {
  tags: [spanishTags.VENTAS],
  summary: 'Registrar venta con boletos',
  description:
    'Crea una venta y los boletos en una sola operación. El total se calcula automáticamente.',
  body: {
    type: 'object',
    required: ['soldByUserId', 'tickets'],
    properties: {
      soldByUserId: { type: 'string', description: 'Usuario cajero que vende' },
      passengerId: { type: 'string' },
      tickets: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['scheduleId', 'passengerId', 'price'],
          properties: {
            scheduleId: { type: 'string' },
            passengerId: { type: 'string' },
            seatNumber: { type: 'integer', minimum: 1 },
            price: { type: 'number', minimum: 0 },
          },
        },
      },
    },
  },
  response: { 201: saleResponseSchema },
}

const getSaleByIdRouteSchema = {
  tags: [spanishTags.VENTAS],
  summary: 'Consultar venta por id',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  response: {
    200: saleResponseSchema,
    404: buildNotFoundResponseSchema(),
  },
}

const updateSaleRouteSchema = {
  tags: [spanishTags.VENTAS],
  summary: 'Actualizar venta',
  description: 'Permite corregir el pasajero principal asociado a la venta.',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string' } },
  },
  body: {
    type: 'object',
    properties: {
      passengerId: { type: ['string', 'null'] },
    },
  },
  response: { 200: saleResponseSchema },
}

const deleteSaleRouteSchema = buildDeleteByIdRouteSchema({
  tag: spanishTags.VENTAS,
  summary: 'Eliminar venta',
  description: 'Elimina la venta y sus boletos (cascada).',
})

module.exports = {
  createSaleRouteSchema,
  deleteSaleRouteSchema,
  getSaleByIdRouteSchema,
  listSalesRouteSchema,
  updateSaleRouteSchema,
}
