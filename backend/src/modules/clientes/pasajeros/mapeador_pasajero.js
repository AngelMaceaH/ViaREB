const { serializeDateTime } = require('../../../infrastructure/http/serialization')

function serializePassenger(passengerRecord) {
  return {
    id: passengerRecord.id,
    fullName: passengerRecord.fullName,
    documentNumber: passengerRecord.documentNumber,
    email: passengerRecord.email,
    phoneNumber: passengerRecord.phoneNumber,
    createdAt: serializeDateTime(passengerRecord.createdAt),
    updatedAt: serializeDateTime(passengerRecord.updatedAt),
  }
}

module.exports = { serializePassenger }
