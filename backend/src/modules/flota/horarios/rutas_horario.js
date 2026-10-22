const { getPrismaClient } = require('../../../infrastructure/database/prisma_client')
const { apiMessages } = require('../../../infrastructure/http/api_messages')
const {
  handleDeletePrismaError,
  handlePrismaRouteError,
} = require('../../../infrastructure/http/prisma_errors')
const { serializeSchedule } = require('./mapeador_horario')
const {
  createScheduleRouteSchema,
  deleteScheduleRouteSchema,
  getScheduleByIdRouteSchema,
  listSchedulesRouteSchema,
  updateScheduleRouteSchema,
} = require('./esquemas_horario')

const scheduleInclude = {
  route: {
    select: {
      id: true,
      name: true,
      origin: true,
      destination: true,
    },
  },
  bus: { select: { id: true, licensePlate: true } },
  driver: { select: { id: true, fullName: true } },
}

async function registerScheduleRoutes(application) {
  application.get('/api/fleet/schedules', {
    schema: listSchedulesRouteSchema,
  }, async () => {
    const prismaClient = getPrismaClient()
    const scheduleRecords = await prismaClient.schedule.findMany({
      include: scheduleInclude,
      orderBy: { departureAt: 'asc' },
    })
    return { data: scheduleRecords.map(serializeSchedule) }
  })

  application.post('/api/fleet/schedules', {
    schema: createScheduleRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { routeId, busId, driverId, departureAt, arrivalAt, isActive } =
      request.body

    try {
      const createdSchedule = await prismaClient.schedule.create({
        data: {
          routeId,
          busId,
          driverId,
          departureAt: new Date(departureAt),
          arrivalAt: arrivalAt ? new Date(arrivalAt) : null,
          isActive: isActive ?? true,
        },
        include: scheduleInclude,
      })
      return reply.status(201).send(serializeSchedule(createdSchedule))
    } catch (error) {
      return handlePrismaRouteError(error, reply)
    }
  })

  application.get('/api/fleet/schedules/:id', {
    schema: getScheduleByIdRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const scheduleRecord = await prismaClient.schedule.findUnique({
      where: { id: request.params.id },
      include: scheduleInclude,
    })
    if (!scheduleRecord) {
      return reply.status(404).send({ message: apiMessages.scheduleNotFound })
    }
    return serializeSchedule(scheduleRecord)
  })

  application.patch('/api/fleet/schedules/:id', {
    schema: updateScheduleRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { routeId, busId, driverId, departureAt, arrivalAt, isActive } =
      request.body

    try {
      const updatedSchedule = await prismaClient.schedule.update({
        where: { id: request.params.id },
        data: {
          ...(routeId !== undefined ? { routeId } : {}),
          ...(busId !== undefined ? { busId } : {}),
          ...(driverId !== undefined ? { driverId } : {}),
          ...(departureAt !== undefined
            ? { departureAt: new Date(departureAt) }
            : {}),
          ...(arrivalAt !== undefined
            ? { arrivalAt: arrivalAt ? new Date(arrivalAt) : null }
            : {}),
          ...(isActive !== undefined ? { isActive } : {}),
        },
        include: scheduleInclude,
      })
      return serializeSchedule(updatedSchedule)
    } catch (error) {
      return handlePrismaRouteError(error, reply)
    }
  })

  application.delete('/api/fleet/schedules/:id', {
    schema: deleteScheduleRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    try {
      await prismaClient.schedule.delete({
        where: { id: request.params.id },
      })
      return reply.status(204).send()
    } catch (error) {
      return handleDeletePrismaError(error, reply)
    }
  })
}

module.exports = { registerScheduleRoutes }
