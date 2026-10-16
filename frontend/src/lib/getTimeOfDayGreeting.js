export function getTimeOfDayGreeting(date = new Date()) {
  const hour = date.getHours()

  if (hour >= 5 && hour < 12) {
    return 'Buenos días'
  }

  if (hour >= 12 && hour < 19) {
    return 'Buenas tardes'
  }

  return 'Buenas noches'
}
