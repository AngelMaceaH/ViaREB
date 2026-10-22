const { getPrismaClient } = require('../../../infrastructure/database/prisma_client')
const { apiMessages } = require('../../../infrastructure/http/api_messages')
const {
  handleDeletePrismaError,
  handlePrismaRouteError,
} = require('../../../infrastructure/http/prisma_errors')
const { serializeSale } = require('./mapeador_venta')
const {
  createSaleRouteSchema,
  deleteSaleRouteSchema,
  getSaleByIdRouteSchema,
  listSalesRouteSchema,
  updateSaleRouteSchema,
} = require('./esquemas_venta')

const saleInclude = {
  soldBy: {
    select: { id: true, fullName: true, email: true },
  },
  passenger: {
    select: { id: true, fullName: true, documentNumber: true },
  },
  tickets: {
    include: {
      passenger: { select: { fullName: true } },
      schedule: {
        include: {
          route: {
            select: { name: true, origin: true, destination: true },
          },
        },
      },
    },
  },
}

async function registerSaleRoutes(application) {
  application.get('/api/sales', {
    schema: listSalesRouteSchema,
  }, async () => {
    const prismaClient = getPrismaClient()
    const saleRecords = await prismaClient.sale.findMany({
      include: saleInclude,
      orderBy: { soldAt: 'desc' },
    })
    return { data: saleRecords.map(serializeSale) }
  })

  application.post('/api/sales', {
    schema: createSaleRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { soldByUserId, passengerId, tickets } = request.body

    const totalAmount = tickets.reduce(
      (accumulator, ticket) => accumulator + ticket.price,
      0,
    )

    try {
      const createdSale = await prismaClient.$transaction(async (transaction) => {
        const saleRecord = await transaction.sale.create({
          data: {
            soldByUserId,
            passengerId: passengerId ?? tickets[0]?.passengerId ?? null,
            totalAmount,
          },
        })

        for (const ticket of tickets) {
          await transaction.ticket.create({
            data: {
              saleId: saleRecord.id,
              scheduleId: ticket.scheduleId,
              passengerId: ticket.passengerId,
              seatNumber: ticket.seatNumber ?? null,
              price: ticket.price,
            },
          })
        }

        return transaction.sale.findUnique({
          where: { id: saleRecord.id },
          include: saleInclude,
        })
      })

      return reply.status(201).send(serializeSale(createdSale))
    } catch (error) {
      return handlePrismaRouteError(error, reply)
    }
  })

  application.get('/api/sales/:id', {
    schema: getSaleByIdRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const saleRecord = await prismaClient.sale.findUnique({
      where: { id: request.params.id },
      include: saleInclude,
    })
    if (!saleRecord) {
      return reply.status(404).send({ message: apiMessages.saleNotFound })
    }
    return serializeSale(saleRecord)
  })

  application.patch('/api/sales/:id', {
    schema: updateSaleRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { passengerId } = request.body

    try {
      const updatedSale = await prismaClient.sale.update({
        where: { id: request.params.id },
        data: {
          ...(passengerId !== undefined ? { passengerId } : {}),
        },
        include: saleInclude,
      })
      return serializeSale(updatedSale)
    } catch (error) {
      return handlePrismaRouteError(error, reply)
    }
  })

  application.delete('/api/sales/:id', {
    schema: deleteSaleRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    try {
      await prismaClient.sale.delete({ where: { id: request.params.id } })
      return reply.status(204).send()
    } catch (error) {
      return handleDeletePrismaError(error, reply)
    }
  })
}

module.exports = { registerSaleRoutes }
