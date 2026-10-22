const {
  decimalToNumber,
  serializeDateTime,
} = require('../../../infrastructure/http/serialization')

function buildRouteLabel(routeRecord) {
  if (!routeRecord) {
    return 'Unknown route'
  }

  return `${routeRecord.name} (${routeRecord.origin} → ${routeRecord.destination})`
}

const ticketInclude = {
  passenger: {
    select: { id: true, fullName: true, documentNumber: true },
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
  sale: {
    select: { id: true, soldAt: true },
  },
}

function serializeTicketListItem(ticketRecord) {
  return {
    id: ticketRecord.id,
    ticketCode: ticketRecord.ticketCode,
    saleId: ticketRecord.saleId,
    scheduleId: ticketRecord.scheduleId,
    passengerId: ticketRecord.passengerId,
    passengerName: ticketRecord.passenger?.fullName ?? 'Unknown passenger',
    routeLabel: buildRouteLabel(ticketRecord.schedule?.route),
    status: ticketRecord.status,
    price: decimalToNumber(ticketRecord.price),
    seatNumber: ticketRecord.seatNumber,
    validatedAt: ticketRecord.validatedAt
      ? serializeDateTime(ticketRecord.validatedAt)
      : null,
    createdAt: serializeDateTime(ticketRecord.createdAt),
    updatedAt: serializeDateTime(ticketRecord.updatedAt),
  }
}

module.exports = {
  serializeTicketListItem,
  ticketInclude,
}
