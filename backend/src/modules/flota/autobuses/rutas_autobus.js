const { getPrismaClient } = require('../../../infrastructure/database/prisma_client')
const { apiMessages } = require('../../../infrastructure/http/api_messages')
const {
  handleDeletePrismaError,
  handlePrismaRouteError,
} = require('../../../infrastructure/http/prisma_errors')
const { serializeBus } = require('./mapeador_autobus')
const {
  createBusRouteSchema,
  deleteBusRouteSchema,
  getBusByIdRouteSchema,
  listBusesRouteSchema,
  updateBusRouteSchema,
} = require('./esquemas_autobus')

async function registerBusRoutes(application) {
  application.get('/api/fleet/buses', {
    schema: listBusesRouteSchema,
  }, async () => {
    const prismaClient = getPrismaClient()
    const busRecords = await prismaClient.bus.findMany({
      orderBy: { licensePlate: 'asc' },
    })
    return { data: busRecords.map(serializeBus) }
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
      return handlePrismaRouteError(error, reply, apiMessages.busPlateExists)
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
      return reply.status(404).send({ message: apiMessages.busNotFound })
    }
    return serializeBus(busRecord)
  })

  application.patch('/api/fleet/buses/:id', {
    schema: updateBusRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { licensePlate, capacity, modelName, isActive } = request.body

    try {
      const updatedBus = await prismaClient.bus.update({
        where: { id: request.params.id },
        data: {
          ...(licensePlate !== undefined
            ? { licensePlate: licensePlate.trim() }
            : {}),
          ...(capacity !== undefined ? { capacity } : {}),
          ...(modelName !== undefined
            ? { modelName: modelName?.trim() || null }
            : {}),
          ...(isActive !== undefined ? { isActive } : {}),
        },
      })
      return serializeBus(updatedBus)
    } catch (error) {
      return handlePrismaRouteError(error, reply, apiMessages.busPlateExists)
    }
  })

  application.delete('/api/fleet/buses/:id', {
    schema: deleteBusRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    try {
      await prismaClient.bus.delete({
        where: { id: request.params.id },
      })
      return reply.status(204).send()
    } catch (error) {
      return handleDeletePrismaError(error, reply)
    }
  })
}

module.exports = { registerBusRoutes }
