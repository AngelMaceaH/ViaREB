const { serializeDateTime } = require('../../../infrastructure/http/serialization')

function serializeRole(roleRecord) {
  return {
    id: roleRecord.id,
    name: roleRecord.name,
    description: roleRecord.description,
    createdAt: serializeDateTime(roleRecord.createdAt),
    updatedAt: serializeDateTime(roleRecord.updatedAt),
    permissions: roleRecord.rolePermissions?.map((rolePermission) => ({
      id: rolePermission.permission.id,
      code: rolePermission.permission.code,
      name: rolePermission.permission.name,
    })),
  }
}

module.exports = { serializeRole }
