const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

let prismaClientInstance = null
let databaseConnectionPool = null

function createPrismaClient(databaseUrl) {
  if (prismaClientInstance) {
    return prismaClientInstance
  }

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to create Prisma client')
  }

  databaseConnectionPool = new Pool({ connectionString: databaseUrl })
  const databaseAdapter = new PrismaPg(databaseConnectionPool)

  prismaClientInstance = new PrismaClient({
    adapter: databaseAdapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

  return prismaClientInstance
}

function getPrismaClient() {
  if (!prismaClientInstance) {
    throw new Error(
      'Prisma client is not initialized. Call createPrismaClient first.',
    )
  }

  return prismaClientInstance
}

async function disconnectPrismaClient() {
  await prismaClientInstance?.$disconnect()
  await databaseConnectionPool?.end()
  prismaClientInstance = null
  databaseConnectionPool = null
}

module.exports = {
  createPrismaClient,
  disconnectPrismaClient,
  getPrismaClient,
}
