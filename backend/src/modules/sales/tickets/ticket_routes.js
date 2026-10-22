const { getPrismaClient } = require('../../../infrastructure/database/prisma_client')
const { serializeTicketListItem } = require('./ticket_mapper')
const { listTicketsRouteSchema } = require('./ticket_schemas')

async function registerTicketRoutes(application) {
  application.get('/api/sales/tickets', {
    schema: listTicketsRouteSchema,
  }, async () => {
    const prismaClient = getPrismaClient()
    const ticketRecords = await prismaClient.ticket.findMany({
      include: {
        passenger: {
          select: { fullName: true },
        },
        schedule: {
          include: {
            route: {
              select: {
                name: true,
                origin: true,
                destination: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return {
      data: ticketRecords.map(serializeTicketListItem),
    }
  })
}

module.exports = { registerTicketRoutes }
