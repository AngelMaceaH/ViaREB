const { serializeDateTime } = require('../../../infrastructure/http/serialization')

function serializePermission(permissionRecord) {
  return {
    id: permissionRecord.id,
    code: permissionRecord.code,
    name: permissionRecord.name,
    description: permissionRecord.description,
    createdAt: serializeDateTime(permissionRecord.createdAt),
    updatedAt: serializeDateTime(permissionRecord.updatedAt),
  }
}

module.exports = { serializePermission }
