require('dotenv').config()
const {
  createPrismaClient,
  disconnectPrismaClient,
  getPrismaClient,
} = require('../src/infrastructure/database/prisma_client')

async function seedDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run seed')
  }

  createPrismaClient(databaseUrl)
  const prismaClient = getPrismaClient()

  const busOne = await prismaClient.bus.upsert({
    where: { licensePlate: 'HN-1001' },
    update: {},
    create: {
      licensePlate: 'HN-1001',
      capacity: 45,
      modelName: 'Mercedes Tourismo',
      isActive: true,
    },
  })

  const routeOne = await prismaClient.route.upsert({
    where: { id: 'seed-route-teg-sps' },
    update: {},
    create: {
      id: 'seed-route-teg-sps',
      name: 'Tegucigalpa — San Pedro Sula',
      origin: 'Tegucigalpa',
      destination: 'San Pedro Sula',
      distanceKilometers: 240,
      isActive: true,
    },
  })

  const driverOne = await prismaClient.driver.upsert({
    where: { licenseNumber: 'LIC-SEED-001' },
    update: {},
    create: {
      fullName: 'Seed Driver',
      licenseNumber: 'LIC-SEED-001',
      phoneNumber: '+50490000000',
      isActive: true,
    },
  })

  const departureAt = new Date()
  departureAt.setDate(departureAt.getDate() + 1)
  departureAt.setHours(8, 0, 0, 0)

  const scheduleOne = await prismaClient.schedule.upsert({
    where: { id: 'seed-schedule-001' },
    update: {},
    create: {
      id: 'seed-schedule-001',
      routeId: routeOne.id,
      busId: busOne.id,
      driverId: driverOne.id,
      departureAt,
      isActive: true,
    },
  })

  const passengerOne = await prismaClient.passenger.upsert({
    where: { documentNumber: '0801-1990-00001' },
    update: {},
    create: {
      fullName: 'Seed Passenger',
      documentNumber: '0801-1990-00001',
      email: 'passenger@example.com',
      phoneNumber: '+50490000001',
    },
  })

  const sellerUser = await prismaClient.user.upsert({
    where: { email: 'cajero@viareb.local' },
    update: {},
    create: {
      email: 'cajero@viareb.local',
      passwordHash: 'seed-not-for-production',
      fullName: 'Cajero Demo',
      isActive: true,
    },
  })

  let saleOne = await prismaClient.sale.findFirst({
    where: { soldByUserId: sellerUser.id },
  })

  if (!saleOne) {
    saleOne = await prismaClient.sale.create({
      data: {
        soldByUserId: sellerUser.id,
        passengerId: passengerOne.id,
        totalAmount: 450,
      },
    })
  }

  await prismaClient.ticket.upsert({
    where: { ticketCode: 'SEED-TICKET-001' },
    update: {},
    create: {
      ticketCode: 'SEED-TICKET-001',
      saleId: saleOne.id,
      scheduleId: scheduleOne.id,
      passengerId: passengerOne.id,
      seatNumber: 12,
      price: 450,
      status: 'VALID',
    },
  })

  console.log('Seed completed.')
}

seedDatabase()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await disconnectPrismaClient()
  })
