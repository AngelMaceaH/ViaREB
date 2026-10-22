const { serializeDateTime } = require('../../../infrastructure/http/serialization')

function serializeUser(userRecord) {
  return {
    id: userRecord.id,
    email: userRecord.email,
    fullName: userRecord.fullName,
    isActive: userRecord.isActive,
    createdAt: serializeDateTime(userRecord.createdAt),
    updatedAt: serializeDateTime(userRecord.updatedAt),
    roles: userRecord.userRoles?.map((userRole) => ({
      id: userRole.role.id,
      name: userRole.role.name,
      assignedAt: serializeDateTime(userRole.assignedAt),
    })),
  }
}

module.exports = { serializeUser }
