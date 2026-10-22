const { registerBusRoutes } = require('../modules/fleet/buses/bus_routes')
const { registerTicketRoutes } = require('../modules/sales/tickets/ticket_routes')

async function registerApplicationRoutes(application) {
  await registerBusRoutes(application)
  await registerTicketRoutes(application)
}

module.exports = { registerApplicationRoutes }
