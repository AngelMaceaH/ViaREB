const { getPrismaClient } = require('../../../infrastructure/database/prisma_client')
const { apiMessages } = require('../../../infrastructure/http/api_messages')
const {
  handleDeletePrismaError,
  handlePrismaRouteError,
} = require('../../../infrastructure/http/prisma_errors')
const { serializeRoute } = require('./mapeador_trayecto')
const {
  createRouteRouteSchema,
  deleteRouteRouteSchema,
  getRouteByIdRouteSchema,
  listRoutesRouteSchema,
  updateRouteRouteSchema,
} = require('./esquemas_trayecto')

async function registerRouteRoutes(application) {
  application.get('/api/fleet/routes', {
    schema: listRoutesRouteSchema,
  }, async () => {
    const prismaClient = getPrismaClient()
    const routeRecords = await prismaClient.route.findMany({
      orderBy: { name: 'asc' },
    })
    return { data: routeRecords.map(serializeRoute) }
  })

  application.post('/api/fleet/routes', {
    schema: createRouteRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { name, origin, destination, distanceKilometers, isActive } =
      request.body

    try {
      const createdRoute = await prismaClient.route.create({
        data: {
          name: name.trim(),
          origin: origin.trim(),
          destination: destination.trim(),
          distanceKilometers: distanceKilometers ?? null,
          isActive: isActive ?? true,
        },
      })
      return reply.status(201).send(serializeRoute(createdRoute))
    } catch (error) {
      return handlePrismaRouteError(error, reply)
    }
  })

  application.get('/api/fleet/routes/:id', {
    schema: getRouteByIdRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const routeRecord = await prismaClient.route.findUnique({
      where: { id: request.params.id },
    })
    if (!routeRecord) {
      return reply.status(404).send({ message: apiMessages.routeNotFound })
    }
    return serializeRoute(routeRecord)
  })

  application.patch('/api/fleet/routes/:id', {
    schema: updateRouteRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { name, origin, destination, distanceKilometers, isActive } =
      request.body

    try {
      const updatedRoute = await prismaClient.route.update({
        where: { id: request.params.id },
        data: {
          ...(name !== undefined ? { name: name.trim() } : {}),
          ...(origin !== undefined ? { origin: origin.trim() } : {}),
          ...(destination !== undefined
            ? { destination: destination.trim() }
            : {}),
          ...(distanceKilometers !== undefined
            ? { distanceKilometers }
            : {}),
          ...(isActive !== undefined ? { isActive } : {}),
        },
      })
      return serializeRoute(updatedRoute)
    } catch (error) {
      return handlePrismaRouteError(error, reply)
    }
  })

  application.delete('/api/fleet/routes/:id', {
    schema: deleteRouteRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    try {
      await prismaClient.route.delete({ where: { id: request.params.id } })
      return reply.status(204).send()
    } catch (error) {
      return handleDeletePrismaError(error, reply)
    }
  })
}

module.exports = { registerRouteRoutes }
