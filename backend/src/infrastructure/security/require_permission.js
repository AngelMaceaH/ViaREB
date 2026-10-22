const { apiMessages } = require('../http/api_messages')

function requirePermission(permissionCode) {
  return async function permissionGuard(request, reply) {
    const permissions = request.user?.permissions

    if (!Array.isArray(permissions) || !permissions.includes(permissionCode)) {
      return reply.status(403).send({ message: apiMessages.forbidden })
    }
  }
}

function requireAnyPermission(...permissionCodes) {
  return async function permissionGuard(request, reply) {
    const permissions = request.user?.permissions ?? []
    const isAllowed = permissionCodes.some((code) => permissions.includes(code))

    if (!isAllowed) {
      return reply.status(403).send({ message: apiMessages.forbidden })
    }
  }
}

module.exports = { requireAnyPermission, requirePermission }
