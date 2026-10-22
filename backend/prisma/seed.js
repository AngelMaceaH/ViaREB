require('dotenv').config()
const {
  createPrismaClient,
  disconnectPrismaClient,
  getPrismaClient,
} = require('../src/infrastructure/database/prisma_client')
const { hashPassword } = require('../src/infrastructure/security/password_hasher')

const seedUsers = [
  {
    email: 'admin@viareb.local',
    fullName: 'Administrador Demo',
    password: 'Admin123!',
    roleName: 'ADMIN',
  },
  {
    email: 'cajero@viareb.local',
    fullName: 'Cajero Demo',
    password: 'Cajero123!',
    roleName: 'CAJERO',
  },
]

const seedPermissions = [
  { code: 'access.manage', name: 'Gestionar acceso', description: 'Usuarios, roles y permisos' },
  { code: 'fleet.manage', name: 'Gestionar flota', description: 'Autobuses, rutas, choferes y horarios' },
  { code: 'customers.manage', name: 'Gestionar clientes', description: 'Pasajeros' },
  { code: 'sales.manage', name: 'Gestionar ventas', description: 'Ventas y boletos' },
  { code: 'reports.view', name: 'Ver reportes', description: 'Panel e informes BI' },
]

const rolePermissionMap = {
  ADMIN: seedPermissions.map((permission) => permission.code),
  CAJERO: ['fleet.manage', 'customers.manage', 'sales.manage', 'reports.view'],
}

async function seedAccessControl(prismaClient) {
  for (const permission of seedPermissions) {
    await prismaClient.permission.upsert({
      where: { code: permission.code },
      update: {
        name: permission.name,
        description: permission.description,
      },
      create: permission,
    })
  }

  for (const roleName of Object.keys(rolePermissionMap)) {
    await prismaClient.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: roleName === 'ADMIN' ? 'Acceso total' : 'Punto de venta',
      },
    })
  }

  const permissionRecords = await prismaClient.permission.findMany()
  const roleRecords = await prismaClient.role.findMany()

  for (const [roleName, permissionCodes] of Object.entries(rolePermissionMap)) {
    const roleRecord = roleRecords.find((role) => role.name === roleName)
    if (!roleRecord) {
      continue
    }

    for (const permissionCode of permissionCodes) {
      const permissionRecord = permissionRecords.find(
        (permission) => permission.code === permissionCode,
      )
      if (!permissionRecord) {
        continue
      }

      await prismaClient.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: roleRecord.id,
            permissionId: permissionRecord.id,
          },
        },
        update: {},
        create: {
          roleId: roleRecord.id,
          permissionId: permissionRecord.id,
        },
      })
    }
  }

  for (const seedUser of seedUsers) {
    const passwordHash = await hashPassword(seedUser.password)
    const userRecord = await prismaClient.user.upsert({
      where: { email: seedUser.email },
      update: {
        passwordHash,
        fullName: seedUser.fullName,
        isActive: true,
      },
      create: {
        email: seedUser.email,
        passwordHash,
        fullName: seedUser.fullName,
        isActive: true,
      },
    })

    const roleRecord = roleRecords.find((role) => role.name === seedUser.roleName)
    if (!roleRecord) {
      continue
    }

    await prismaClient.userRole.upsert({
      where: {
        userId_roleId: {
          userId: userRecord.id,
          roleId: roleRecord.id,
        },
      },
      update: {},
      create: {
        userId: userRecord.id,
        roleId: roleRecord.id,
      },
    })
  }

  return prismaClient.user.findUnique({
    where: { email: 'cajero@viareb.local' },
  })
}

async function seedDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run seed')
  }

  createPrismaClient(databaseUrl)
  const prismaClient = getPrismaClient()

  const sellerUser = await seedAccessControl(prismaClient)
  if (!sellerUser) {
    throw new Error('Seed user cajero@viareb.local was not created')
  }

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
  console.log('Demo users (password updated on each seed run):')
  for (const seedUser of seedUsers) {
    console.log(`  ${seedUser.email} / ${seedUser.password} (${seedUser.roleName})`)
  }
}

seedDatabase()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await disconnectPrismaClient()
  })
