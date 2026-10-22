const {
  decimalToNumber,
  serializeDateTime,
} = require('../../../infrastructure/http/serialization')
const { serializeTicketListItem } = require('../boletos/mapeador_boleto')

function serializeSale(saleRecord) {
  return {
    id: saleRecord.id,
    soldByUserId: saleRecord.soldByUserId,
    passengerId: saleRecord.passengerId,
    totalAmount: decimalToNumber(saleRecord.totalAmount),
    soldAt: serializeDateTime(saleRecord.soldAt),
    createdAt: serializeDateTime(saleRecord.createdAt),
    updatedAt: serializeDateTime(saleRecord.updatedAt),
    soldBy: saleRecord.soldBy
      ? {
          id: saleRecord.soldBy.id,
          fullName: saleRecord.soldBy.fullName,
          email: saleRecord.soldBy.email,
        }
      : undefined,
    passenger: saleRecord.passenger
      ? {
          id: saleRecord.passenger.id,
          fullName: saleRecord.passenger.fullName,
          documentNumber: saleRecord.passenger.documentNumber,
        }
      : undefined,
    tickets: saleRecord.tickets?.map(serializeTicketListItem),
  }
}

module.exports = { serializeSale }
