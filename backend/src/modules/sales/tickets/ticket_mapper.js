function decimalToNumber(decimalValue) {
  if (decimalValue === null || decimalValue === undefined) {
    return 0
  }

  if (typeof decimalValue === 'object' && typeof decimalValue.toNumber === 'function') {
    return decimalValue.toNumber()
  }

  return Number(decimalValue)
}

function buildRouteLabel(routeRecord) {
  if (!routeRecord) {
    return 'Unknown route'
  }

  return `${routeRecord.name} (${routeRecord.origin} → ${routeRecord.destination})`
}

function serializeTicketListItem(ticketRecord) {
  return {
    id: ticketRecord.id,
    ticketCode: ticketRecord.ticketCode,
    passengerName: ticketRecord.passenger?.fullName ?? 'Unknown passenger',
    routeLabel: buildRouteLabel(ticketRecord.schedule?.route),
    status: ticketRecord.status,
    price: decimalToNumber(ticketRecord.price),
    seatNumber: ticketRecord.seatNumber,
    createdAt: ticketRecord.createdAt.toISOString(),
  }
}

module.exports = { serializeTicketListItem }
