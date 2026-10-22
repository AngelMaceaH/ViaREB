const { serializeDateTime } = require('../../../infrastructure/http/serialization')

function serializeSchedule(scheduleRecord) {
  return {
    id: scheduleRecord.id,
    routeId: scheduleRecord.routeId,
    busId: scheduleRecord.busId,
    driverId: scheduleRecord.driverId,
    departureAt: serializeDateTime(scheduleRecord.departureAt),
    arrivalAt: scheduleRecord.arrivalAt
      ? serializeDateTime(scheduleRecord.arrivalAt)
      : null,
    isActive: scheduleRecord.isActive,
    createdAt: serializeDateTime(scheduleRecord.createdAt),
    updatedAt: serializeDateTime(scheduleRecord.updatedAt),
    route: scheduleRecord.route
      ? {
          id: scheduleRecord.route.id,
          name: scheduleRecord.route.name,
          origin: scheduleRecord.route.origin,
          destination: scheduleRecord.route.destination,
        }
      : undefined,
    bus: scheduleRecord.bus
      ? {
          id: scheduleRecord.bus.id,
          licensePlate: scheduleRecord.bus.licensePlate,
        }
      : undefined,
    driver: scheduleRecord.driver
      ? {
          id: scheduleRecord.driver.id,
          fullName: scheduleRecord.driver.fullName,
        }
      : undefined,
  }
}

module.exports = { serializeSchedule }
