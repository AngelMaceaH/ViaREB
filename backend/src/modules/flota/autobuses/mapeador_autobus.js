const { serializeDateTime } = require('../../../infrastructure/http/serialization')

function serializeBus(busRecord) {
  return {
    id: busRecord.id,
    licensePlate: busRecord.licensePlate,
    capacity: busRecord.capacity,
    modelName: busRecord.modelName,
    isActive: busRecord.isActive,
    createdAt: serializeDateTime(busRecord.createdAt),
    updatedAt: serializeDateTime(busRecord.updatedAt),
  }
}

module.exports = { serializeBus }
