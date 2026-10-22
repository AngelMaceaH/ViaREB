const { getPrismaClient } = require('../../../infrastructure/database/prisma_client')
const { apiMessages } = require('../../../infrastructure/http/api_messages')
const {
  handleDeletePrismaError,
  handlePrismaRouteError,
} = require('../../../infrastructure/http/prisma_errors')
const { hashPassword } = require('../../../infrastructure/security/password_hasher')
const { serializeUser } = require('./mapeador_usuario')
const {
  assignUserRoleRouteSchema,
  createUserRouteSchema,
  deleteUserRouteSchema,
  getUserByIdRouteSchema,
  listUsersRouteSchema,
  removeUserRoleRouteSchema,
  updateUserRouteSchema,
} = require('./esquemas_usuario')

const userInclude = {
  userRoles: {
    include: {
      role: { select: { id: true, name: true } },
    },
  },
}

async function registerUserRoutes(application) {
  application.get('/api/access/users', {
    schema: listUsersRouteSchema,
  }, async () => {
    const prismaClient = getPrismaClient()
    const userRecords = await prismaClient.user.findMany({
      include: userInclude,
      orderBy: { fullName: 'asc' },
    })
    return { data: userRecords.map(serializeUser) }
  })

  application.post('/api/access/users', {
    schema: createUserRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { email, password, fullName, isActive } = request.body

    try {
      const passwordHash = await hashPassword(password)
      const createdUser = await prismaClient.user.create({
        data: {
          email: email.trim().toLowerCase(),
          passwordHash,
          fullName: fullName.trim(),
          isActive: isActive ?? true,
        },
        include: userInclude,
      })
      return reply.status(201).send(serializeUser(createdUser))
    } catch (error) {
      return handlePrismaRouteError(error, reply, apiMessages.userEmailExists)
    }
  })

  application.get('/api/access/users/:id', {
    schema: getUserByIdRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const userRecord = await prismaClient.user.findUnique({
      where: { id: request.params.id },
      include: userInclude,
    })
    if (!userRecord) {
      return reply.status(404).send({ message: apiMessages.userNotFound })
    }
    return serializeUser(userRecord)
  })

  application.patch('/api/access/users/:id', {
    schema: updateUserRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { email, password, fullName, isActive } = request.body

    try {
      const updateData = {
        ...(email !== undefined ? { email: email.trim().toLowerCase() } : {}),
        ...(fullName !== undefined ? { fullName: fullName.trim() } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      }

      if (password !== undefined) {
        updateData.passwordHash = await hashPassword(password)
      }

      const updatedUser = await prismaClient.user.update({
        where: { id: request.params.id },
        data: updateData,
        include: userInclude,
      })
      return serializeUser(updatedUser)
    } catch (error) {
      return handlePrismaRouteError(error, reply, apiMessages.userEmailExists)
    }
  })

  application.delete('/api/access/users/:id', {
    schema: deleteUserRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    try {
      await prismaClient.user.delete({ where: { id: request.params.id } })
      return reply.status(204).send()
    } catch (error) {
      return handleDeletePrismaError(error, reply)
    }
  })

  application.post('/api/access/users/:userId/roles/:roleId', {
    schema: assignUserRoleRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { userId, roleId } = request.params

    try {
      const userRole = await prismaClient.userRole.create({
        data: { userId, roleId },
      })
      return reply.status(201).send({
        userId: userRole.userId,
        roleId: userRole.roleId,
        assignedAt: userRole.assignedAt.toISOString(),
      })
    } catch (error) {
      return handlePrismaRouteError(error, reply)
    }
  })

  application.delete('/api/access/users/:userId/roles/:roleId', {
    schema: removeUserRoleRouteSchema,
  }, async (request, reply) => {
    const prismaClient = getPrismaClient()
    const { userId, roleId } = request.params

    try {
      await prismaClient.userRole.delete({
        where: { userId_roleId: { userId, roleId } },
      })
      return reply.status(204).send()
    } catch (error) {
      return handlePrismaRouteError(error, reply)
    }
  })
}

module.exports = { registerUserRoutes }
