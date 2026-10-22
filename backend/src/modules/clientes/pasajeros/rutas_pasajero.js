const { getPrismaClient } = require('../../../infrastructure/database/prisma_client')
const { apiMessages } = require('../../../infrastructure/http/api_messages')
const {
  handleDeletePrismaError,
  handlePrismaRouteError,
} = require('../../../infrastructure/http/prisma_errors')
const { serializePassenger } = require('./mapeador_pasajero')
const {
  createPassengerRouteSchema,
  deletePassengerRouteSchema,
  getPassengerByIdRouteSchema,
  listPassengersRouteSchema,
  updatePassengerRouteSchema,
} = require('./esquemas_pasajero')

async function registerPassengerRoutes(application) {
  application.get('/api/customer/passengers', {
    schema: listPassengersRouteSchema,
  }, async () => {
    const prismaClient = getPrismaClient()
    const passengerRecords = await prismaClient.passenger.findMany({
      orderBy: { fullName: 'asc' },
    })
    return { data: passengerRecords.map(serializePassenger) }
  })

  application.post('/api/customer/passengers', {
    schema: createPassengerRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { fullName, documentNumber, email, phoneNumber } = request.body

    try {
      const createdPassenger = await prismaClient.passenger.create({
        data: {
          fullName: fullName.trim(),
          documentNumber: documentNumber.trim(),
          email: email?.trim() || null,
          phoneNumber: phoneNumber?.trim() || null,
        },
      })
      return reply.status(201).send(serializePassenger(createdPassenger))
    } catch (error) {
      return handlePrismaRouteError(
        error,
        reply,
        apiMessages.passengerDocumentExists,
      )
    }
  })

  application.get('/api/customer/passengers/:id', {
    schema: getPassengerByIdRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const passengerRecord = await prismaClient.passenger.findUnique({
      where: { id: request.params.id },
    })
    if (!passengerRecord) {
      return reply.status(404).send({ message: apiMessages.passengerNotFound })
    }
    return serializePassenger(passengerRecord)
  })

  application.patch('/api/customer/passengers/:id', {
    schema: updatePassengerRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { fullName, documentNumber, email, phoneNumber } = request.body

    try {
      const updatedPassenger = await prismaClient.passenger.update({
        where: { id: request.params.id },
        data: {
          ...(fullName !== undefined ? { fullName: fullName.trim() } : {}),
          ...(documentNumber !== undefined
            ? { documentNumber: documentNumber.trim() }
            : {}),
          ...(email !== undefined ? { email: email?.trim() || null } : {}),
          ...(phoneNumber !== undefined
            ? { phoneNumber: phoneNumber?.trim() || null }
            : {}),
        },
      })
      return serializePassenger(updatedPassenger)
    } catch (error) {
      return handlePrismaRouteError(
        error,
        reply,
        apiMessages.passengerDocumentExists,
      )
    }
  })

  application.delete('/api/customer/passengers/:id', {
    schema: deletePassengerRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    try {
      await prismaClient.passenger.delete({
        where: { id: request.params.id },
      })
      return reply.status(204).send()
    } catch (error) {
      return handleDeletePrismaError(error, reply)
    }
  })
}

module.exports = { registerPassengerRoutes }
