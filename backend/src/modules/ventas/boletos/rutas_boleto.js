const { getPrismaClient } = require('../../../infrastructure/database/prisma_client')
const { apiMessages } = require('../../../infrastructure/http/api_messages')
const {
  handleDeletePrismaError,
  handlePrismaRouteError,
} = require('../../../infrastructure/http/prisma_errors')
const { serializeTicketListItem, ticketInclude } = require('./mapeador_boleto')
const {
  deleteTicketRouteSchema,
  getTicketByCodeRouteSchema,
  getTicketByIdRouteSchema,
  listTicketsRouteSchema,
  updateTicketStatusRouteSchema,
} = require('./esquemas_boleto')

async function registerTicketRoutes(application) {
  application.get('/api/sales/tickets', {
    schema: listTicketsRouteSchema,
  }, async () => {
    const prismaClient = getPrismaClient()
    const ticketRecords = await prismaClient.ticket.findMany({
      include: ticketInclude,
      orderBy: { createdAt: 'desc' },
    })
    return { data: ticketRecords.map(serializeTicketListItem) }
  })

  application.get('/api/sales/tickets/code/:ticketCode', {
    schema: getTicketByCodeRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const ticketRecord = await prismaClient.ticket.findUnique({
      where: { ticketCode: request.params.ticketCode },
      include: ticketInclude,
    })
    if (!ticketRecord) {
      return reply.status(404).send({ message: apiMessages.ticketNotFound })
    }
    return serializeTicketListItem(ticketRecord)
  })

  application.get('/api/sales/tickets/:id', {
    schema: getTicketByIdRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const ticketRecord = await prismaClient.ticket.findUnique({
      where: { id: request.params.id },
      include: ticketInclude,
    })
    if (!ticketRecord) {
      return reply.status(404).send({ message: apiMessages.ticketNotFound })
    }
    return serializeTicketListItem(ticketRecord)
  })

  application.patch('/api/sales/tickets/:id', {
    schema: updateTicketStatusRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { status } = request.body

    try {
      const updatedTicket = await prismaClient.ticket.update({
        where: { id: request.params.id },
        data: {
          status,
          validatedAt: status === 'USED' ? new Date() : null,
        },
        include: ticketInclude,
      })
      return serializeTicketListItem(updatedTicket)
    } catch (error) {
      return handlePrismaRouteError(error, reply)
    }
  })

  application.delete('/api/sales/tickets/:id', {
    schema: deleteTicketRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    try {
      await prismaClient.ticket.delete({ where: { id: request.params.id } })
      return reply.status(204).send()
    } catch (error) {
      return handleDeletePrismaError(error, reply)
    }
  })
}

module.exports = { registerTicketRoutes }
