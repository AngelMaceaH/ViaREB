function decimalToNumber(decimalValue) {
  if (decimalValue === null || decimalValue === undefined) {
    return null
  }

  if (typeof decimalValue === 'object' && typeof decimalValue.toNumber === 'function') {
    return decimalValue.toNumber()
  }

  return Number(decimalValue)
}

function serializeDateTime(dateValue) {
  return dateValue instanceof Date ? dateValue.toISOString() : dateValue
}

module.exports = {
  decimalToNumber,
  serializeDateTime,
}
