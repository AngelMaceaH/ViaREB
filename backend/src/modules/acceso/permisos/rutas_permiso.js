const { getPrismaClient } = require('../../../infrastructure/database/prisma_client')
const { apiMessages } = require('../../../infrastructure/http/api_messages')
const {
  handleDeletePrismaError,
  handlePrismaRouteError,
} = require('../../../infrastructure/http/prisma_errors')
const { serializePermission } = require('./mapeador_permiso')
const {
  createPermissionRouteSchema,
  deletePermissionRouteSchema,
  getPermissionByIdRouteSchema,
  listPermissionsRouteSchema,
  updatePermissionRouteSchema,
} = require('./esquemas_permiso')

async function registerPermissionRoutes(application) {
  application.get('/api/access/permissions', {
    schema: listPermissionsRouteSchema,
  }, async () => {
    const prismaClient = getPrismaClient()
    const permissionRecords = await prismaClient.permission.findMany({
      orderBy: { code: 'asc' },
    })
    return { data: permissionRecords.map(serializePermission) }
  })

  application.post('/api/access/permissions', {
    schema: createPermissionRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { code, name, description } = request.body

    try {
      const createdPermission = await prismaClient.permission.create({
        data: {
          code: code.trim(),
          name: name.trim(),
          description: description?.trim() || null,
        },
      })
      return reply.status(201).send(serializePermission(createdPermission))
    } catch (error) {
      return handlePrismaRouteError(
        error,
        reply,
        apiMessages.permissionCodeExists,
      )
    }
  })

  application.get('/api/access/permissions/:id', {
    schema: getPermissionByIdRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const permissionRecord = await prismaClient.permission.findUnique({
      where: { id: request.params.id },
    })
    if (!permissionRecord) {
      return reply.status(404).send({ message: apiMessages.permissionNotFound })
    }
    return serializePermission(permissionRecord)
  })

  application.patch('/api/access/permissions/:id', {
    schema: updatePermissionRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { code, name, description } = request.body

    try {
      const updatedPermission = await prismaClient.permission.update({
        where: { id: request.params.id },
        data: {
          ...(code !== undefined ? { code: code.trim() } : {}),
          ...(name !== undefined ? { name: name.trim() } : {}),
          ...(description !== undefined
            ? { description: description?.trim() || null }
            : {}),
        },
      })
      return serializePermission(updatedPermission)
    } catch (error) {
      return handlePrismaRouteError(
        error,
        reply,
        apiMessages.permissionCodeExists,
      )
    }
  })

  application.delete('/api/access/permissions/:id', {
    schema: deletePermissionRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    try {
      await prismaClient.permission.delete({
        where: { id: request.params.id },
      })
      return reply.status(204).send()
    } catch (error) {
      return handleDeletePrismaError(error, reply)
    }
  })
}

module.exports = { registerPermissionRoutes }
