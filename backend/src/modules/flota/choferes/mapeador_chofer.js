const { serializeDateTime } = require('../../../infrastructure/http/serialization')

function serializeDriver(driverRecord) {
  return {
    id: driverRecord.id,
    fullName: driverRecord.fullName,
    licenseNumber: driverRecord.licenseNumber,
    phoneNumber: driverRecord.phoneNumber,
    isActive: driverRecord.isActive,
    createdAt: serializeDateTime(driverRecord.createdAt),
    updatedAt: serializeDateTime(driverRecord.updatedAt),
  }
}

module.exports = { serializeDriver }
