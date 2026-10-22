const { decimalToNumber, serializeDateTime } = require('../../../infrastructure/http/serialization')

function serializeRoute(routeRecord) {
  return {
    id: routeRecord.id,
    name: routeRecord.name,
    origin: routeRecord.origin,
    destination: routeRecord.destination,
    distanceKilometers: decimalToNumber(routeRecord.distanceKilometers),
    isActive: routeRecord.isActive,
    createdAt: serializeDateTime(routeRecord.createdAt),
    updatedAt: serializeDateTime(routeRecord.updatedAt),
  }
}

module.exports = { serializeRoute }
