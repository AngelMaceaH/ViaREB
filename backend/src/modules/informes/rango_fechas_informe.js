const { endOfDay, startOfDay, startOfToday } = require('./formateadores_informe')

function parseOptionalDate(value) {
  if (!value) {
    return null
  }

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return parsedDate
}

function parseDateRangeQuery(query, defaultDaySpan = 30) {
  const hastaDate = parseOptionalDate(query.hasta) ?? new Date()
  const hasta = endOfDay(hastaDate)

  let desde = parseOptionalDate(query.desde)
  if (!desde) {
    desde = startOfDay(hasta)
    desde.setDate(desde.getDate() - (defaultDaySpan - 1))
  } else {
    desde = startOfDay(desde)
  }

  if (desde > hasta) {
    return { desde: hasta, hasta: desde, isSwapped: true }
  }

  return { desde, hasta, isSwapped: false }
}

function parseLimitQuery(query, defaultLimit, maxLimit = 100) {
  const parsedLimit = Number(query.limite ?? defaultLimit)
  if (!Number.isFinite(parsedLimit) || parsedLimit < 1) {
    return defaultLimit
  }
  return Math.min(Math.floor(parsedLimit), maxLimit)
}

function parseCountQuery(query, fieldName, defaultCount, maxCount = 24) {
  const parsedCount = Number(query[fieldName] ?? defaultCount)
  if (!Number.isFinite(parsedCount) || parsedCount < 1) {
    return defaultCount
  }
  return Math.min(Math.floor(parsedCount), maxCount)
}

module.exports = {
  parseCountQuery,
  parseDateRangeQuery,
  parseLimitQuery,
  startOfToday,
}
