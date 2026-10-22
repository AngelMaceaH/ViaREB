const { getPrismaClient } = require('../../../infrastructure/database/prisma_client')
const {
  hashPassword,
  verifyPassword,
} = require('../../../infrastructure/security/password_hasher')
const { serializeUser } = require('../usuarios/mapeador_usuario')

const userAuthInclude = {
  userRoles: {
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
    },
  },
}

function extractRolesAndPermissions(userRecord) {
  const roles = []
  const permissionCodes = new Set()

  for (const userRole of userRecord.userRoles ?? []) {
    roles.push(userRole.role.name)
    for (const rolePermission of userRole.role.rolePermissions ?? []) {
      permissionCodes.add(rolePermission.permission.code)
    }
  }

  return {
    roles,
    permissions: [...permissionCodes],
  }
}

function buildJwtPayload(userRecord) {
  const { roles, permissions } = extractRolesAndPermissions(userRecord)

  return {
    sub: userRecord.id,
    email: userRecord.email,
    fullName: userRecord.fullName,
    roles,
    permissions,
  }
}

async function findUserForAuthentication(email) {
  const prismaClient = getPrismaClient()
  const normalizedEmail = email.trim().toLowerCase()

  return prismaClient.user.findUnique({
    where: { email: normalizedEmail },
    include: userAuthInclude,
  })
}

async function authenticateWithPassword(email, plainPassword) {
  const userRecord = await findUserForAuthentication(email)

  if (!userRecord || !userRecord.isActive) {
    return { ok: false, reason: 'invalid_credentials' }
  }

  const passwordMatches = await verifyPassword(plainPassword, userRecord.passwordHash)
  if (!passwordMatches) {
    return { ok: false, reason: 'invalid_credentials' }
  }

  return {
    ok: true,
    userRecord,
    jwtPayload: buildJwtPayload(userRecord),
  }
}

async function findUserByIdForSession(userId) {
  const prismaClient = getPrismaClient()

  return prismaClient.user.findUnique({
    where: { id: userId },
    include: userAuthInclude,
  })
}

async function serializeSessionUser(userRecord) {
  const { roles, permissions } = extractRolesAndPermissions(userRecord)

  return {
    ...serializeUser(userRecord),
    permissions,
    roleNames: roles,
  }
}

module.exports = {
  authenticateWithPassword,
  buildJwtPayload,
  extractRolesAndPermissions,
  findUserByIdForSession,
  hashPassword,
  serializeSessionUser,
  userAuthInclude,
}
