const { registerAuthRoutes } = require('../modules/acceso/autenticacion/rutas_autenticacion')
const { registerPermissionRoutes } = require('../modules/acceso/permisos/rutas_permiso')
const { registerRoleRoutes } = require('../modules/acceso/roles/rutas_rol')
const { registerUserRoutes } = require('../modules/acceso/usuarios/rutas_usuario')
const { registerPassengerRoutes } = require('../modules/clientes/pasajeros/rutas_pasajero')
const { registerBusRoutes } = require('../modules/flota/autobuses/rutas_autobus')
const { registerDriverRoutes } = require('../modules/flota/choferes/rutas_chofer')
const { registerRouteRoutes } = require('../modules/flota/trayectos/rutas_trayecto')
const { registerScheduleRoutes } = require('../modules/flota/horarios/rutas_horario')
const { registerReportRoutes } = require('../modules/informes/rutas_informe')
const { registerSaleRoutes } = require('../modules/ventas/ventas/rutas_venta')
const { registerTicketRoutes } = require('../modules/ventas/boletos/rutas_boleto')

async function registerApplicationRoutes(application) {
  await registerAuthRoutes(application)

  await registerTicketRoutes(application)
  await registerSaleRoutes(application)
  await registerReportRoutes(application)

  await registerScheduleRoutes(application)
  await registerRouteRoutes(application)
  await registerBusRoutes(application)
  await registerDriverRoutes(application)

  await registerPassengerRoutes(application)

  await registerUserRoutes(application)
  await registerRoleRoutes(application)
  await registerPermissionRoutes(application)
}

module.exports = { registerApplicationRoutes }
