const { getPrismaClient } = require('../../infrastructure/database/prisma_client')
const { decimalToNumber } = require('../../infrastructure/http/serialization')
const {
  parseCountQuery,
  parseDateRangeQuery,
  parseLimitQuery,
  startOfToday,
} = require('./rango_fechas_informe')
const {
  formatCurrencyHnl,
  formatDepartureLabel,
  formatRelativeSoldAt,
  monthLabelsEs,
  startOfDay,
  ticketStatusLabelsEs,
  weekdayLabelsEs,
} = require('./formateadores_informe')

async function buildPanelReport() {
  const indicators = await buildIndicatorsReport()
  const weeklySales = await buildWeeklySalesReport({ semanas: 1 })
  const ticketsByStatus = await buildTicketsByStatusReport()
  const recentSales = await buildRecentSalesReport({ limite: 5 })
  const upcomingDepartures = await buildUpcomingDeparturesReport({ limite: 5 })

  return {
    summaryMetrics: indicators.indicators.map((indicator) => ({
      id: indicator.id,
      label: indicator.label,
      value: indicator.displayValue,
      change: indicator.change,
      changeDirection: indicator.changeDirection,
    })),
    weeklySales: weeklySales.series[0]?.days ?? [],
    ticketsByStatus: ticketsByStatus.items,
    recentSales: recentSales.items,
    upcomingDepartures: upcomingDepartures.items,
  }
}

async function buildIndicatorsReport() {
  const prismaClient = getPrismaClient()
  const todayStart = startOfToday()
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 6)

  const [
    salesTodayAggregate,
    ticketsIssuedToday,
    activeBusCount,
    totalBusCount,
    passengersWeekCount,
    salesWeekAggregate,
    ticketsValidatedToday,
  ] = await Promise.all([
    prismaClient.sale.aggregate({
      where: { soldAt: { gte: todayStart } },
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
    prismaClient.ticket.count({
      where: { createdAt: { gte: todayStart } },
    }),
    prismaClient.bus.count({ where: { isActive: true } }),
    prismaClient.bus.count(),
    prismaClient.passenger.count({
      where: { createdAt: { gte: weekStart } },
    }),
    prismaClient.sale.aggregate({
      where: { soldAt: { gte: weekStart } },
      _sum: { totalAmount: true },
    }),
    prismaClient.ticket.count({
      where: {
        status: 'USED',
        validatedAt: { gte: todayStart },
      },
    }),
  ])

  const salesTodayAmount = decimalToNumber(salesTodayAggregate._sum.totalAmount) ?? 0
  const salesWeekAmount = decimalToNumber(salesWeekAggregate._sum.totalAmount) ?? 0

  return {
    generatedAt: new Date().toISOString(),
    indicators: [
      {
        id: 'sales-today',
        label: 'Ventas hoy',
        numericValue: salesTodayAmount,
        displayValue: formatCurrencyHnl(salesTodayAmount),
        unit: 'HNL',
        change: `${salesTodayAggregate._count._all} transacciones`,
        changeDirection: 'neutral',
      },
      {
        id: 'tickets-issued-today',
        label: 'Boletos emitidos hoy',
        numericValue: ticketsIssuedToday,
        displayValue: String(ticketsIssuedToday),
        unit: 'boletos',
        change: `${ticketsValidatedToday} validados hoy`,
        changeDirection: 'neutral',
      },
      {
        id: 'sales-week',
        label: 'Ventas últimos 7 días',
        numericValue: salesWeekAmount,
        displayValue: formatCurrencyHnl(salesWeekAmount),
        unit: 'HNL',
        change: '—',
        changeDirection: 'neutral',
      },
      {
        id: 'active-buses',
        label: 'Autobuses activos',
        numericValue: activeBusCount,
        displayValue: `${activeBusCount} / ${totalBusCount}`,
        unit: 'unidades',
        change:
          totalBusCount - activeBusCount > 0
            ? `${totalBusCount - activeBusCount} inactivos`
            : 'Flota completa activa',
        changeDirection: 'neutral',
      },
      {
        id: 'new-passengers-week',
        label: 'Pasajeros nuevos (7 días)',
        numericValue: passengersWeekCount,
        displayValue: String(passengersWeekCount),
        unit: 'personas',
        change: '—',
        changeDirection: 'neutral',
      },
    ],
  }
}

async function buildSalesSummaryReport(query) {
  const prismaClient = getPrismaClient()
  const { desde, hasta } = parseDateRangeQuery(query)

  const aggregate = await prismaClient.sale.aggregate({
    where: { soldAt: { gte: desde, lte: hasta } },
    _sum: { totalAmount: true },
    _count: { _all: true },
    _avg: { totalAmount: true },
  })

  const ticketCount = await prismaClient.ticket.count({
    where: { createdAt: { gte: desde, lte: hasta } },
  })

  const totalAmount = decimalToNumber(aggregate._sum.totalAmount) ?? 0
  const averageAmount = decimalToNumber(aggregate._avg.totalAmount) ?? 0

  return {
    period: {
      desde: desde.toISOString(),
      hasta: hasta.toISOString(),
      label: 'Rango personalizado',
    },
    totalSalesCount: aggregate._count._all,
    totalRevenue: totalAmount,
    totalRevenueFormatted: formatCurrencyHnl(totalAmount),
    averageSaleAmount: averageAmount,
    averageSaleAmountFormatted: formatCurrencyHnl(averageAmount),
    ticketsIssued: ticketCount,
  }
}

async function buildDailySalesReport(query) {
  const prismaClient = getPrismaClient()
  const { desde, hasta } = parseDateRangeQuery(query)

  const saleRecords = await prismaClient.sale.findMany({
    where: { soldAt: { gte: desde, lte: hasta } },
    select: { soldAt: true, totalAmount: true },
    orderBy: { soldAt: 'asc' },
  })

  const dayMap = new Map()
  const cursor = startOfDay(desde)
  const end = startOfDay(hasta)

  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 10)
    dayMap.set(key, {
      date: key,
      dayLabel: weekdayLabelsEs[cursor.getDay()],
      salesAmount: 0,
      salesCount: 0,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  for (const saleRecord of saleRecords) {
    const key = startOfDay(saleRecord.soldAt).toISOString().slice(0, 10)
    const bucket = dayMap.get(key)
    if (bucket) {
      bucket.salesAmount += decimalToNumber(saleRecord.totalAmount) ?? 0
      bucket.salesCount += 1
    }
  }

  return {
    period: { desde: desde.toISOString(), hasta: hasta.toISOString() },
    items: Array.from(dayMap.values()),
  }
}

async function buildWeeklySalesReport(query) {
  const prismaClient = getPrismaClient()
  const weeksCount = parseCountQuery(query, 'semanas', 8)
  const todayStart = startOfToday()
  const rangeStart = new Date(todayStart)
  rangeStart.setDate(rangeStart.getDate() - weeksCount * 7 + 1)

  const saleRecords = await prismaClient.sale.findMany({
    where: { soldAt: { gte: rangeStart } },
    select: { soldAt: true, totalAmount: true },
  })

  const series = []
  for (let weekIndex = weeksCount - 1; weekIndex >= 0; weekIndex -= 1) {
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - weekIndex * 7 - 6)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    const days = []
    for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
      const dayDate = new Date(weekStart)
      dayDate.setDate(weekStart.getDate() + dayOffset)
      days.push({
        dayLabel: weekdayLabelsEs[dayDate.getDay()],
        date: dayDate.toISOString().slice(0, 10),
        salesAmount: 0,
        salesCount: 0,
      })
    }

    for (const saleRecord of saleRecords) {
      const soldDate = new Date(saleRecord.soldAt)
      if (soldDate >= weekStart && soldDate <= weekEnd) {
        const dayIndex = Math.floor(
          (startOfDay(soldDate) - startOfDay(weekStart)) / (24 * 60 * 60 * 1000),
        )
        if (dayIndex >= 0 && dayIndex < 7) {
          days[dayIndex].salesAmount += decimalToNumber(saleRecord.totalAmount) ?? 0
          days[dayIndex].salesCount += 1
        }
      }
    }

    const weekTotal = days.reduce((sum, day) => sum + day.salesAmount, 0)
    series.push({
      weekLabel: `Semana ${weeksCount - weekIndex}`,
      weekStart: weekStart.toISOString().slice(0, 10),
      weekEnd: weekEnd.toISOString().slice(0, 10),
      weekTotal,
      weekTotalFormatted: formatCurrencyHnl(weekTotal),
      days,
    })
  }

  return { series }
}

async function buildMonthlySalesReport(query) {
  const prismaClient = getPrismaClient()
  const monthsCount = parseCountQuery(query, 'meses', 6)
  const now = new Date()
  const rangeStart = new Date(now.getFullYear(), now.getMonth() - (monthsCount - 1), 1)

  const saleRecords = await prismaClient.sale.findMany({
    where: { soldAt: { gte: rangeStart } },
    select: { soldAt: true, totalAmount: true },
  })

  const items = []
  for (let monthOffset = monthsCount - 1; monthOffset >= 0; monthOffset -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1)
    const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
    items.push({
      monthKey,
      monthLabel: `${monthLabelsEs[monthDate.getMonth()]} ${monthDate.getFullYear()}`,
      salesAmount: 0,
      salesCount: 0,
    })
  }

  for (const saleRecord of saleRecords) {
    const soldDate = new Date(saleRecord.soldAt)
    const monthKey = `${soldDate.getFullYear()}-${String(soldDate.getMonth() + 1).padStart(2, '0')}`
    const bucket = items.find((item) => item.monthKey === monthKey)
    if (bucket) {
      bucket.salesAmount += decimalToNumber(saleRecord.totalAmount) ?? 0
      bucket.salesCount += 1
    }
  }

  return {
    items: items.map((item) => ({
      ...item,
      salesAmountFormatted: formatCurrencyHnl(item.salesAmount),
    })),
  }
}

async function buildSalesByRouteReport(query) {
  const prismaClient = getPrismaClient()
  const { desde, hasta } = parseDateRangeQuery(query)

  const ticketRecords = await prismaClient.ticket.findMany({
    where: { createdAt: { gte: desde, lte: hasta } },
    select: {
      price: true,
      schedule: {
        select: {
          route: {
            select: { id: true, name: true, origin: true, destination: true },
          },
        },
      },
    },
  })

  const routeMap = new Map()
  for (const ticketRecord of ticketRecords) {
    const route = ticketRecord.schedule?.route
    if (!route) {
      continue
    }

    const existing = routeMap.get(route.id) ?? {
      routeId: route.id,
      routeName: route.name,
      origin: route.origin,
      destination: route.destination,
      ticketCount: 0,
      revenue: 0,
    }

    existing.ticketCount += 1
    existing.revenue += decimalToNumber(ticketRecord.price) ?? 0
    routeMap.set(route.id, existing)
  }

  const items = Array.from(routeMap.values())
    .sort((left, right) => right.revenue - left.revenue)
    .map((item) => ({
      ...item,
      revenueFormatted: formatCurrencyHnl(item.revenue),
    }))

  return {
    period: { desde: desde.toISOString(), hasta: hasta.toISOString() },
    items,
  }
}

async function buildSalesByCashierReport(query) {
  const prismaClient = getPrismaClient()
  const { desde, hasta } = parseDateRangeQuery(query)

  const saleRecords = await prismaClient.sale.findMany({
    where: { soldAt: { gte: desde, lte: hasta } },
    select: {
      totalAmount: true,
      soldBy: { select: { id: true, fullName: true, email: true } },
    },
  })

  const cashierMap = new Map()
  for (const saleRecord of saleRecords) {
    const cashierId = saleRecord.soldBy?.id ?? 'unknown'
    const existing = cashierMap.get(cashierId) ?? {
      userId: cashierId,
      fullName: saleRecord.soldBy?.fullName ?? 'Desconocido',
      email: saleRecord.soldBy?.email ?? null,
      salesCount: 0,
      revenue: 0,
    }

    existing.salesCount += 1
    existing.revenue += decimalToNumber(saleRecord.totalAmount) ?? 0
    cashierMap.set(cashierId, existing)
  }

  const items = Array.from(cashierMap.values())
    .sort((left, right) => right.revenue - left.revenue)
    .map((item) => ({
      ...item,
      revenueFormatted: formatCurrencyHnl(item.revenue),
    }))

  return {
    period: { desde: desde.toISOString(), hasta: hasta.toISOString() },
    items,
  }
}

async function buildTicketsByStatusReport(query = {}) {
  const prismaClient = getPrismaClient()
  const hasRange = query.desde || query.hasta
  const dateFilter = hasRange
    ? parseDateRangeQuery(query)
    : null

  const ticketGroups = await prismaClient.ticket.groupBy({
    by: ['status'],
    where: dateFilter
      ? { createdAt: { gte: dateFilter.desde, lte: dateFilter.hasta } }
      : undefined,
    _count: { _all: true },
  })

  const items = ticketGroups.map((group) => ({
    status: group.status,
    statusLabel: ticketStatusLabelsEs[group.status] ?? group.status,
    ticketCount: group._count._all,
  }))

  const totalTickets = items.reduce((sum, item) => sum + item.ticketCount, 0)

  return {
    period: dateFilter
      ? { desde: dateFilter.desde.toISOString(), hasta: dateFilter.hasta.toISOString() }
      : null,
    totalTickets,
    items,
  }
}

async function buildTicketValidationReport(query) {
  const prismaClient = getPrismaClient()
  const { desde, hasta } = parseDateRangeQuery(query)
  const todayStart = startOfToday()

  const [validatedInRange, issuedInRange, cancelledInRange, validatedToday] =
    await Promise.all([
      prismaClient.ticket.count({
        where: {
          status: 'USED',
          validatedAt: { gte: desde, lte: hasta },
        },
      }),
      prismaClient.ticket.count({
        where: { createdAt: { gte: desde, lte: hasta } },
      }),
      prismaClient.ticket.count({
        where: {
          status: 'CANCELLED',
          updatedAt: { gte: desde, lte: hasta },
        },
      }),
      prismaClient.ticket.count({
        where: { status: 'USED', validatedAt: { gte: todayStart } },
      }),
    ])

  const pendingValid = await prismaClient.ticket.count({
    where: {
      status: 'VALID',
      createdAt: { gte: desde, lte: hasta },
    },
  })

  const validationRate =
    issuedInRange > 0 ? Math.round((validatedInRange / issuedInRange) * 100) : 0

  return {
    period: { desde: desde.toISOString(), hasta: hasta.toISOString() },
    ticketsIssued: issuedInRange,
    ticketsValidated: validatedInRange,
    ticketsPendingValidation: pendingValid,
    ticketsCancelled: cancelledInRange,
    ticketsValidatedToday: validatedToday,
    validationRatePercent: validationRate,
  }
}

async function buildTicketTrendReport(query) {
  const prismaClient = getPrismaClient()
  const { desde, hasta } = parseDateRangeQuery(query)

  const ticketRecords = await prismaClient.ticket.findMany({
    where: { createdAt: { gte: desde, lte: hasta } },
    select: { createdAt: true, status: true },
  })

  const dayMap = new Map()
  const cursor = startOfDay(desde)
  const end = startOfDay(hasta)

  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 10)
    dayMap.set(key, {
      date: key,
      dayLabel: weekdayLabelsEs[cursor.getDay()],
      ticketCount: 0,
      validatedCount: 0,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  for (const ticketRecord of ticketRecords) {
    const key = startOfDay(ticketRecord.createdAt).toISOString().slice(0, 10)
    const bucket = dayMap.get(key)
    if (bucket) {
      bucket.ticketCount += 1
      if (ticketRecord.status === 'USED') {
        bucket.validatedCount += 1
      }
    }
  }

  return {
    period: { desde: desde.toISOString(), hasta: hasta.toISOString() },
    items: Array.from(dayMap.values()),
  }
}

async function buildFleetSummaryReport() {
  const prismaClient = getPrismaClient()
  const now = new Date()

  const [
    activeBuses,
    totalBuses,
    activeRoutes,
    activeDrivers,
    upcomingSchedules,
    totalPassengers,
  ] = await Promise.all([
    prismaClient.bus.count({ where: { isActive: true } }),
    prismaClient.bus.count(),
    prismaClient.route.count({ where: { isActive: true } }),
    prismaClient.driver.count({ where: { isActive: true } }),
    prismaClient.schedule.count({
      where: { isActive: true, departureAt: { gte: now } },
    }),
    prismaClient.passenger.count(),
  ])

  return {
    buses: {
      active: activeBuses,
      total: totalBuses,
      inactive: totalBuses - activeBuses,
    },
    activeRoutes,
    activeDrivers,
    upcomingSchedules,
    registeredPassengers: totalPassengers,
  }
}

async function buildRouteOccupancyReport(query) {
  const salesByRoute = await buildSalesByRouteReport(query)
  const maxTickets = salesByRoute.items[0]?.ticketCount ?? 1

  return {
    period: salesByRoute.period,
    items: salesByRoute.items.map((item) => ({
      routeId: item.routeId,
      routeName: item.routeName,
      ticketCount: item.ticketCount,
      revenue: item.revenue,
      revenueFormatted: item.revenueFormatted,
      relativeDemandPercent: Math.round((item.ticketCount / maxTickets) * 100),
    })),
  }
}

async function buildUpcomingDeparturesReport(query) {
  const prismaClient = getPrismaClient()
  const limit = parseLimitQuery(query, 10)

  const scheduleRecords = await prismaClient.schedule.findMany({
    where: {
      departureAt: { gte: new Date() },
      isActive: true,
    },
    take: limit,
    orderBy: { departureAt: 'asc' },
    include: {
      route: { select: { name: true } },
      bus: { select: { licensePlate: true } },
      driver: { select: { fullName: true } },
    },
  })

  return {
    items: scheduleRecords.map((scheduleRecord) => ({
      id: scheduleRecord.id,
      routeName: scheduleRecord.route.name,
      busPlate: scheduleRecord.bus.licensePlate,
      driverName: scheduleRecord.driver.fullName,
      departureAt: scheduleRecord.departureAt.toISOString(),
      departureLabel: formatDepartureLabel(scheduleRecord.departureAt),
    })),
  }
}

async function buildRecentSalesReport(query) {
  const prismaClient = getPrismaClient()
  const limit = parseLimitQuery(query, 20)

  const saleRecords = await prismaClient.sale.findMany({
    take: limit,
    orderBy: { soldAt: 'desc' },
    include: {
      passenger: { select: { fullName: true } },
      soldBy: { select: { fullName: true } },
      tickets: {
        take: 1,
        include: {
          schedule: {
            include: { route: { select: { name: true } } },
          },
        },
      },
    },
  })

  return {
    items: saleRecords.map((saleRecord) => ({
      id: saleRecord.id,
      passengerName: saleRecord.passenger?.fullName ?? 'Sin pasajero',
      cashierName: saleRecord.soldBy?.fullName ?? '—',
      routeName:
        saleRecord.tickets[0]?.schedule?.route?.name ?? 'Ruta no disponible',
      amount: decimalToNumber(saleRecord.totalAmount),
      amountFormatted: formatCurrencyHnl(saleRecord.totalAmount),
      soldAt: saleRecord.soldAt.toISOString(),
      soldAtLabel: formatRelativeSoldAt(saleRecord.soldAt),
    })),
  }
}

async function buildPassengersSummaryReport(query) {
  const prismaClient = getPrismaClient()
  const { desde, hasta } = parseDateRangeQuery(query)

  const [newPassengers, totalPassengers, topTravelers] = await Promise.all([
    prismaClient.passenger.count({
      where: { createdAt: { gte: desde, lte: hasta } },
    }),
    prismaClient.passenger.count(),
    prismaClient.ticket.groupBy({
      by: ['passengerId'],
      where: { createdAt: { gte: desde, lte: hasta } },
      _count: { _all: true },
      orderBy: { _count: { passengerId: 'desc' } },
      take: 10,
    }),
  ])

  const passengerIds = topTravelers.map((row) => row.passengerId)
  const passengerRecords = await prismaClient.passenger.findMany({
    where: { id: { in: passengerIds } },
    select: { id: true, fullName: true, documentNumber: true },
  })

  const passengerById = new Map(
    passengerRecords.map((passenger) => [passenger.id, passenger]),
  )

  return {
    period: { desde: desde.toISOString(), hasta: hasta.toISOString() },
    newPassengersInPeriod: newPassengers,
    totalRegisteredPassengers: totalPassengers,
    topTravelers: topTravelers.map((row) => {
      const passenger = passengerById.get(row.passengerId)
      return {
        passengerId: row.passengerId,
        fullName: passenger?.fullName ?? 'Desconocido',
        documentNumber: passenger?.documentNumber ?? '—',
        ticketCount: row._count._all,
      }
    }),
  }
}

module.exports = {
  buildDailySalesReport,
  buildFleetSummaryReport,
  buildIndicatorsReport,
  buildMonthlySalesReport,
  buildPanelReport,
  buildPassengersSummaryReport,
  buildRecentSalesReport,
  buildRouteOccupancyReport,
  buildSalesByCashierReport,
  buildSalesByRouteReport,
  buildSalesSummaryReport,
  buildTicketTrendReport,
  buildTicketValidationReport,
  buildTicketsByStatusReport,
  buildUpcomingDeparturesReport,
  buildWeeklySalesReport,
}
