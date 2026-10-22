const {
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
} = require('./esquemas_informe')
const {
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
} = require('./servicio_informe')

async function registerReportRoutes(application) {
  application.get('/api/reports/panel', {
    schema: panelReportRouteSchema,
  }, async () => buildPanelReport())

  application.get('/api/reports/indicadores', {
    schema: indicatorsReportRouteSchema,
  }, async () => buildIndicatorsReport())

  application.get('/api/reports/ventas/resumen', {
    schema: salesSummaryReportRouteSchema,
  }, async (request) => buildSalesSummaryReport(request.query))

  application.get('/api/reports/ventas/diarias', {
    schema: dailySalesReportRouteSchema,
  }, async (request) => buildDailySalesReport(request.query))

  application.get('/api/reports/ventas/semanales', {
    schema: weeklySalesReportRouteSchema,
  }, async (request) => buildWeeklySalesReport(request.query))

  application.get('/api/reports/ventas/mensuales', {
    schema: monthlySalesReportRouteSchema,
  }, async (request) => buildMonthlySalesReport(request.query))

  application.get('/api/reports/ventas/por-ruta', {
    schema: salesByRouteReportRouteSchema,
  }, async (request) => buildSalesByRouteReport(request.query))

  application.get('/api/reports/ventas/por-cajero', {
    schema: salesByCashierReportRouteSchema,
  }, async (request) => buildSalesByCashierReport(request.query))

  application.get('/api/reports/ventas/ultimas', {
    schema: recentSalesReportRouteSchema,
  }, async (request) => buildRecentSalesReport(request.query))

  application.get('/api/reports/boletos/por-estado', {
    schema: ticketsByStatusReportRouteSchema,
  }, async (request) => buildTicketsByStatusReport(request.query))

  application.get('/api/reports/boletos/validacion', {
    schema: ticketValidationReportRouteSchema,
  }, async (request) => buildTicketValidationReport(request.query))

  application.get('/api/reports/boletos/tendencia', {
    schema: ticketTrendReportRouteSchema,
  }, async (request) => buildTicketTrendReport(request.query))

  application.get('/api/reports/flota/resumen', {
    schema: fleetSummaryReportRouteSchema,
  }, async () => buildFleetSummaryReport())

  application.get('/api/reports/flota/demanda-por-ruta', {
    schema: routeOccupancyReportRouteSchema,
  }, async (request) => buildRouteOccupancyReport(request.query))

  application.get('/api/reports/horarios/proximas-salidas', {
    schema: upcomingDeparturesReportRouteSchema,
  }, async (request) => buildUpcomingDeparturesReport(request.query))

  application.get('/api/reports/pasajeros/resumen', {
    schema: passengersSummaryReportRouteSchema,
  }, async (request) => buildPassengersSummaryReport(request.query))
}

module.exports = { registerReportRoutes }
