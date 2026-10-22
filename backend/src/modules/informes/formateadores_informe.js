const weekdayLabelsEs = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const monthLabelsEs = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
]

const ticketStatusLabelsEs = {
  VALID: 'Válidos',
  USED: 'Usados',
  CANCELLED: 'Cancelados',
  EXPIRED: 'Vencidos',
}

function startOfDay(dateValue) {
  const date = new Date(dateValue)
  date.setHours(0, 0, 0, 0)
  return date
}

function endOfDay(dateValue) {
  const date = new Date(dateValue)
  date.setHours(23, 59, 59, 999)
  return date
}

function startOfToday() {
  return startOfDay(new Date())
}

function formatCurrencyHnl(amount) {
  return new Intl.NumberFormat('es-HN', {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 2,
  }).format(amount ?? 0)
}

function formatRelativeSoldAt(soldAt) {
  const soldDate = new Date(soldAt)
  const today = startOfToday()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const timeLabel = new Intl.DateTimeFormat('es-HN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(soldDate)

  if (soldDate >= today) {
    return `Hoy, ${timeLabel}`
  }
  if (soldDate >= yesterday) {
    return `Ayer, ${timeLabel}`
  }

  return new Intl.DateTimeFormat('es-HN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(soldDate)
}

function formatDepartureLabel(departureAt) {
  return new Intl.DateTimeFormat('es-HN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(departureAt)
}

module.exports = {
  endOfDay,
  formatCurrencyHnl,
  formatDepartureLabel,
  formatRelativeSoldAt,
  monthLabelsEs,
  startOfDay,
  startOfToday,
  ticketStatusLabelsEs,
  weekdayLabelsEs,
}
