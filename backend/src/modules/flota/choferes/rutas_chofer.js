const { getPrismaClient } = require('../../../infrastructure/database/prisma_client')
const { apiMessages } = require('../../../infrastructure/http/api_messages')
const {
  handleDeletePrismaError,
  handlePrismaRouteError,
} = require('../../../infrastructure/http/prisma_errors')
const { serializeDriver } = require('./mapeador_chofer')
const {
  createDriverRouteSchema,
  deleteDriverRouteSchema,
  getDriverByIdRouteSchema,
  listDriversRouteSchema,
  updateDriverRouteSchema,
} = require('./esquemas_chofer')

async function registerDriverRoutes(application) {
  application.get('/api/fleet/drivers', {
    schema: listDriversRouteSchema,
  }, async () => {
    const prismaClient = getPrismaClient()
    const driverRecords = await prismaClient.driver.findMany({
      orderBy: { fullName: 'asc' },
    })
    return { data: driverRecords.map(serializeDriver) }
  })

  application.post('/api/fleet/drivers', {
    schema: createDriverRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { fullName, licenseNumber, phoneNumber, isActive } = request.body

    try {
      const createdDriver = await prismaClient.driver.create({
        data: {
          fullName: fullName.trim(),
          licenseNumber: licenseNumber.trim(),
          phoneNumber: phoneNumber?.trim() || null,
          isActive: isActive ?? true,
        },
      })
      return reply.status(201).send(serializeDriver(createdDriver))
    } catch (error) {
      return handlePrismaRouteError(
        error,
        reply,
        apiMessages.driverLicenseExists,
      )
    }
  })

  application.get('/api/fleet/drivers/:id', {
    schema: getDriverByIdRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const driverRecord = await prismaClient.driver.findUnique({
      where: { id: request.params.id },
    })
    if (!driverRecord) {
      return reply.status(404).send({ message: apiMessages.driverNotFound })
    }
    return serializeDriver(driverRecord)
  })

  application.patch('/api/fleet/drivers/:id', {
    schema: updateDriverRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { fullName, licenseNumber, phoneNumber, isActive } = request.body

    try {
      const updatedDriver = await prismaClient.driver.update({
        where: { id: request.params.id },
        data: {
          ...(fullName !== undefined ? { fullName: fullName.trim() } : {}),
          ...(licenseNumber !== undefined
            ? { licenseNumber: licenseNumber.trim() }
            : {}),
          ...(phoneNumber !== undefined
            ? { phoneNumber: phoneNumber?.trim() || null }
            : {}),
          ...(isActive !== undefined ? { isActive } : {}),
        },
      })
      return serializeDriver(updatedDriver)
    } catch (error) {
      return handlePrismaRouteError(
        error,
        reply,
        apiMessages.driverLicenseExists,
      )
    }
  })

  application.delete('/api/fleet/drivers/:id', {
    schema: deleteDriverRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    try {
      await prismaClient.driver.delete({ where: { id: request.params.id } })
      return reply.status(204).send()
    } catch (error) {
      return handleDeletePrismaError(error, reply)
    }
  })
}

module.exports = { registerDriverRoutes }
