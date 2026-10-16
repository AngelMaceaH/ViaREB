export const mockSummaryMetrics = [
  {
    id: 'sales-today',
    label: 'Ventas hoy',
    value: 'L 12,450.00',
    change: '+12%',
    changeDirection: 'up',
  },
  {
    id: 'tickets-issued',
    label: 'Boletos emitidos',
    value: '86',
    change: '+8%',
    changeDirection: 'up',
  },
  {
    id: 'active-buses',
    label: 'Autobuses activos',
    value: '12 / 14',
    change: '2 en taller',
    changeDirection: 'neutral',
  },
  {
    id: 'passengers-week',
    label: 'Pasajeros (7 días)',
    value: '412',
    change: '+5%',
    changeDirection: 'up',
  },
]

export const mockWeeklySales = [
  { dayLabel: 'Lun', salesAmount: 9200 },
  { dayLabel: 'Mar', salesAmount: 11800 },
  { dayLabel: 'Mié', salesAmount: 10500 },
  { dayLabel: 'Jue', salesAmount: 14200 },
  { dayLabel: 'Vie', salesAmount: 16800 },
  { dayLabel: 'Sáb', salesAmount: 19500 },
  { dayLabel: 'Dom', salesAmount: 12450 },
]

export const mockTicketsByStatus = [
  { statusLabel: 'Válidos', ticketCount: 142 },
  { statusLabel: 'Usados', ticketCount: 98 },
  { statusLabel: 'Cancelados', ticketCount: 11 },
  { statusLabel: 'Vencidos', ticketCount: 6 },
]

export const mockRecentSales = [
  {
    id: 'sale-1',
    passengerName: 'María López',
    routeName: 'Tegucigalpa — San Pedro Sula',
    amount: 'L 350.00',
    soldAt: 'Hoy, 08:42',
  },
  {
    id: 'sale-2',
    passengerName: 'Carlos Méndez',
    routeName: 'Tegucigalpa — La Ceiba',
    amount: 'L 420.00',
    soldAt: 'Hoy, 08:15',
  },
  {
    id: 'sale-3',
    passengerName: 'Ana Ruiz',
    routeName: 'San Pedro Sula — Tegucigalpa',
    amount: 'L 350.00',
    soldAt: 'Hoy, 07:58',
  },
  {
    id: 'sale-4',
    passengerName: 'José García',
    routeName: 'Comayagua — Tegucigalpa',
    amount: 'L 180.00',
    soldAt: 'Ayer, 19:20',
  },
]

export const mockUpcomingDepartures = [
  {
    id: 'dep-1',
    routeName: 'Tegucigalpa — San Pedro Sula',
    departureTime: '09:30',
    busPlate: 'PCD-4587',
    occupancyPercent: 72,
  },
  {
    id: 'dep-2',
    routeName: 'Tegucigalpa — La Ceiba',
    departureTime: '10:00',
    busPlate: 'HAB-2193',
    occupancyPercent: 45,
  },
  {
    id: 'dep-3',
    routeName: 'San Pedro Sula — Puerto Cortés',
    departureTime: '10:15',
    busPlate: 'SPS-8841',
    occupancyPercent: 88,
  },
]
