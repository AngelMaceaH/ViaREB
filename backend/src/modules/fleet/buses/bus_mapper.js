function serializeBus(busRecord) {
  return {
    id: busRecord.id,
    licensePlate: busRecord.licensePlate,
    capacity: busRecord.capacity,
    modelName: busRecord.modelName,
    isActive: busRecord.isActive,
    createdAt: busRecord.createdAt.toISOString(),
    updatedAt: busRecord.updatedAt.toISOString(),
  }
}

module.exports = { serializeBus }
