const { spanishTags } = require('../../infrastructure/openapi/spanish_tags')

const dateRangeQuerySchema = {
  type: 'object',
  properties: {
    desde: {
      type: 'string',
      format: 'date',
      description: 'Fecha inicial (YYYY-MM-DD). Por defecto: 30 días antes de hasta.',
    },
    hasta: {
      type: 'string',
      format: 'date',
      description: 'Fecha final (YYYY-MM-DD). Por defecto: hoy.',
    },
  },
}

const limitQuerySchema = {
  type: 'object',
  properties: {
    limite: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      description: 'Cantidad máxima de registros.',
    },
  },
}

const weeksQuerySchema = {
  type: 'object',
  properties: {
    semanas: {
      type: 'integer',
      minimum: 1,
      maximum: 24,
      description: 'Número de semanas hacia atrás (por defecto 8).',
    },
  },
}

const monthsQuerySchema = {
  type: 'object',
  properties: {
    meses: {
      type: 'integer',
      minimum: 1,
      maximum: 24,
      description: 'Número de meses hacia atrás (por defecto 6).',
    },
  },
}

function buildReportRouteSchema({ summary, description, querystring }) {
  return {
    tags: [spanishTags.REPORTES],
    summary,
    description,
    ...(querystring ? { querystring } : {}),
    response: {
      200: {
        type: 'object',
        description: 'Datos listos para gráficos o tablas en el frontend.',
      },
    },
  }
}

const panelReportRouteSchema = buildReportRouteSchema({
  summary: 'Panel ejecutivo (vista consolidada)',
  description:
    'Combina indicadores, ventas semanales, boletos por estado, últimas ventas y próximas salidas. Ideal para la pantalla principal.',
})

const indicatorsReportRouteSchema = buildReportRouteSchema({
  summary: 'Indicadores clave (KPI)',
  description:
    'Métricas numéricas para tarjetas del dashboard y toma de decisiones.',
})

const salesSummaryReportRouteSchema = buildReportRouteSchema({
  summary: 'Resumen de ventas por período',
  description: 'Totales, promedio por venta y boletos emitidos en el rango de fechas.',
  querystring: dateRangeQuerySchema,
})

const dailySalesReportRouteSchema = buildReportRouteSchema({
  summary: 'Ventas diarias (serie temporal)',
  description: 'Montos y cantidad de ventas por día. Gráfico de líneas o barras.',
  querystring: dateRangeQuerySchema,
})

const weeklySalesReportRouteSchema = buildReportRouteSchema({
  summary: 'Ventas semanales',
  description: 'Desglose por semana con detalle día a día.',
  querystring: weeksQuerySchema,
})

const monthlySalesReportRouteSchema = buildReportRouteSchema({
  summary: 'Ventas mensuales',
  description: 'Totales agrupados por mes.',
  querystring: monthsQuerySchema,
})

const salesByRouteReportRouteSchema = buildReportRouteSchema({
  summary: 'Ventas por ruta',
  description: 'Ingresos y boletos vendidos por ruta de autobús.',
  querystring: dateRangeQuerySchema,
})

const salesByCashierReportRouteSchema = buildReportRouteSchema({
  summary: 'Ventas por cajero',
  description: 'Desempeño de usuarios que registran ventas.',
  querystring: dateRangeQuerySchema,
})

const ticketsByStatusReportRouteSchema = buildReportRouteSchema({
  summary: 'Boletos por estado',
  description: 'Distribución válidos, usados, cancelados y vencidos.',
  querystring: dateRangeQuerySchema,
})

const ticketValidationReportRouteSchema = buildReportRouteSchema({
  summary: 'Indicadores de validación de boletos',
  description: 'Tasa de validación, pendientes y cancelaciones en el período.',
  querystring: dateRangeQuerySchema,
})

const ticketTrendReportRouteSchema = buildReportRouteSchema({
  summary: 'Tendencia de emisión de boletos',
  description: 'Boletos emitidos y validados por día.',
  querystring: dateRangeQuerySchema,
})

const fleetSummaryReportRouteSchema = buildReportRouteSchema({
  summary: 'Resumen de flota y operación',
  description: 'Autobuses, rutas activas, choferes y horarios programados.',
})

const routeOccupancyReportRouteSchema = buildReportRouteSchema({
  summary: 'Demanda por ruta (ocupación relativa)',
  description: 'Comparativo de boletos vendidos por ruta en el período.',
  querystring: dateRangeQuerySchema,
})

const upcomingDeparturesReportRouteSchema = buildReportRouteSchema({
  summary: 'Próximas salidas',
  description: 'Horarios activos ordenados por fecha de salida.',
  querystring: limitQuerySchema,
})

const recentSalesReportRouteSchema = buildReportRouteSchema({
  summary: 'Últimas ventas',
  description: 'Listado reciente para tablas de seguimiento.',
  querystring: limitQuerySchema,
})

const passengersSummaryReportRouteSchema = buildReportRouteSchema({
  summary: 'Resumen de pasajeros',
  description: 'Altas en el período y pasajeros con más viajes.',
  querystring: dateRangeQuerySchema,
})

module.exports = {
  dailySalesReportRouteSchema,
  fleetSummaryReportRouteSchema,
  indicatorsReportRouteSchema,
  monthlySalesReportRouteSchema,
  panelReportRouteSchema,
  passengersSummaryReportRouteSchema,
  recentSalesReportRouteSchema,
  routeOccupancyReportRouteSchema,
  salesByCashierReportRouteSchema,
  salesByRouteReportRouteSchema,
  salesSummaryReportRouteSchema,
  ticketTrendReportRouteSchema,
  ticketValidationReportRouteSchema,
  ticketsByStatusReportRouteSchema,
  upcomingDeparturesReportRouteSchema,
  weeklySalesReportRouteSchema,
}
