const busResponseProperties = {
  id: { type: 'string' },
  licensePlate: { type: 'string' },
  capacity: { type: 'integer' },
  modelName: { type: ['string', 'null'] },
  isActive: { type: 'boolean' },
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

const createBusBodySchema = {
  type: 'object',
  required: ['licensePlate', 'capacity'],
  properties: {
    licensePlate: { type: 'string', minLength: 1, maxLength: 32 },
    capacity: { type: 'integer', minimum: 1, maximum: 200 },
    modelName: { type: 'string', maxLength: 120 },
    isActive: { type: 'boolean', default: true },
  },
}

const listBusesRouteSchema = {
  tags: ['Fleet'],
  summary: 'List buses',
  response: {
    200: {
      type: 'object',
      required: ['data'],
      properties: {
        data: {
          type: 'array',
          items: busResponseSchema,
        },
      },
    },
  },
}

const getBusByIdRouteSchema = {
  tags: ['Fleet'],
  summary: 'Get bus by id',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  response: {
    200: busResponseSchema,
    404: {
      type: 'object',
      required: ['message'],
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

const createBusRouteSchema = {
  tags: ['Fleet'],
  summary: 'Create bus',
  body: createBusBodySchema,
  response: {
    201: busResponseSchema,
    409: {
      type: 'object',
      required: ['message'],
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

module.exports = {
  createBusRouteSchema,
  getBusByIdRouteSchema,
  listBusesRouteSchema,
}
