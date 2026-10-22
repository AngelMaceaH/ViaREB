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
    passengerName: { type: 'string' },
    routeLabel: { type: 'string' },
    status: {
      type: 'string',
      enum: ['VALID', 'USED', 'CANCELLED', 'EXPIRED'],
    },
    price: { type: 'number' },
    seatNumber: { type: ['integer', 'null'] },
    createdAt: { type: 'string', format: 'date-time' },
  },
}

const listTicketsRouteSchema = {
  tags: ['Sales'],
  summary: 'List tickets',
  response: {
    200: {
      type: 'object',
      required: ['data'],
      properties: {
        data: {
          type: 'array',
          items: ticketListItemSchema,
        },
      },
    },
  },
}

module.exports = { listTicketsRouteSchema }
