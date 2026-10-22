const { getPrismaClient } = require('../../../infrastructure/database/prisma_client')
const { serializeBus } = require('./bus_mapper')
const {
  createBusRouteSchema,
  getBusByIdRouteSchema,
  listBusesRouteSchema,
} = require('./bus_schemas')

function isUniqueConstraintError(error) {
  return error?.code === 'P2002'
}

async function registerBusRoutes(application) {
  application.get('/api/fleet/buses', {
    schema: listBusesRouteSchema,
  }, async () => {
    const prismaClient = getPrismaClient()
    const busRecords = await prismaClient.bus.findMany({
      orderBy: { licensePlate: 'asc' },
    })

    return {
      data: busRecords.map(serializeBus),
    }
  })

  application.get('/api/fleet/buses/:id', {
    schema: getBusByIdRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const busRecord = await prismaClient.bus.findUnique({
      where: { id: request.params.id },
    })

    if (!busRecord) {
      return reply.status(404).send({
        message: 'Bus not found',
      })
    }

    return serializeBus(busRecord)
  })

  application.post('/api/fleet/buses', {
    schema: createBusRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { licensePlate, capacity, modelName, isActive } = request.body

    try {
      const createdBus = await prismaClient.bus.create({
        data: {
          licensePlate: licensePlate.trim(),
          capacity,
          modelName: modelName?.trim() || null,
          isActive: isActive ?? true,
        },
      })

      return reply.status(201).send(serializeBus(createdBus))
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        return reply.status(409).send({
          message: 'A bus with this license plate already exists',
        })
      }

      throw error
    }
  })
}

module.exports = { registerBusRoutes }
