const { getPrismaClient } = require('../../../infrastructure/database/prisma_client')
const { apiMessages } = require('../../../infrastructure/http/api_messages')
const {
  handleDeletePrismaError,
  handlePrismaRouteError,
} = require('../../../infrastructure/http/prisma_errors')
const { serializeRole } = require('./mapeador_rol')
const {
  assignRolePermissionRouteSchema,
  createRoleRouteSchema,
  deleteRoleRouteSchema,
  getRoleByIdRouteSchema,
  listRolesRouteSchema,
  removeRolePermissionRouteSchema,
  updateRoleRouteSchema,
} = require('./esquemas_rol')

const roleInclude = {
  rolePermissions: {
    include: {
      permission: { select: { id: true, code: true, name: true } },
    },
  },
}

async function registerRoleRoutes(application) {
  application.get('/api/access/roles', {
    schema: listRolesRouteSchema,
  }, async () => {
    const prismaClient = getPrismaClient()
    const roleRecords = await prismaClient.role.findMany({
      include: roleInclude,
      orderBy: { name: 'asc' },
    })
    return { data: roleRecords.map(serializeRole) }
  })

  application.post('/api/access/roles', {
    schema: createRoleRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { name, description } = request.body

    try {
      const createdRole = await prismaClient.role.create({
        data: {
          name: name.trim(),
          description: description?.trim() || null,
        },
        include: roleInclude,
      })
      return reply.status(201).send(serializeRole(createdRole))
    } catch (error) {
      return handlePrismaRouteError(error, reply, apiMessages.roleNameExists)
    }
  })

  application.get('/api/access/roles/:id', {
    schema: getRoleByIdRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const roleRecord = await prismaClient.role.findUnique({
      where: { id: request.params.id },
      include: roleInclude,
    })
    if (!roleRecord) {
      return reply.status(404).send({ message: apiMessages.roleNotFound })
    }
    return serializeRole(roleRecord)
  })

  application.patch('/api/access/roles/:id', {
    schema: updateRoleRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { name, description } = request.body

    try {
      const updatedRole = await prismaClient.role.update({
        where: { id: request.params.id },
        data: {
          ...(name !== undefined ? { name: name.trim() } : {}),
          ...(description !== undefined
            ? { description: description?.trim() || null }
            : {}),
        },
        include: roleInclude,
      })
      return serializeRole(updatedRole)
    } catch (error) {
      return handlePrismaRouteError(error, reply, apiMessages.roleNameExists)
    }
  })

  application.delete('/api/access/roles/:id', {
    schema: deleteRoleRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    try {
      await prismaClient.role.delete({ where: { id: request.params.id } })
      return reply.status(204).send()
    } catch (error) {
      return handleDeletePrismaError(error, reply)
    }
  })

  application.post('/api/access/roles/:roleId/permissions/:permissionId', {
    schema: assignRolePermissionRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { roleId, permissionId } = request.params

    try {
      const rolePermission = await prismaClient.rolePermission.create({
        data: { roleId, permissionId },
      })
      return reply.status(201).send({
        roleId: rolePermission.roleId,
        permissionId: rolePermission.permissionId,
      })
    } catch (error) {
      return handlePrismaRouteError(error, reply)
    }
  })

  application.delete('/api/access/roles/:roleId/permissions/:permissionId', {
    schema: removeRolePermissionRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { roleId, permissionId } = request.params

    try {
      await prismaClient.rolePermission.delete({
        where: { roleId_permissionId: { roleId, permissionId } },
      })
      return reply.status(204).send()
    } catch (error) {
      return handlePrismaRouteError(error, reply)
    }
  })
}

module.exports = { registerRoleRoutes }
