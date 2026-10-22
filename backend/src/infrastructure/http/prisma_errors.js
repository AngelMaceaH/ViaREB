function isUniqueConstraintError(error) {
  return error?.code === 'P2002'
}

function isForeignKeyConstraintError(error) {
  return error?.code === 'P2003'
}

function isRecordNotFoundError(error) {
  return error?.code === 'P2025'
}

const { apiMessages } = require('./api_messages')

function handlePrismaRouteError(error, reply, conflictMessage) {
  if (isUniqueConstraintError(error)) {
    return reply.status(409).send({
      message: conflictMessage ?? apiMessages.alreadyExists,
    })
  }

  if (isForeignKeyConstraintError(error)) {
    return reply.status(400).send({
      message: apiMessages.relatedNotFound,
    })
  }

  if (isRecordNotFoundError(error)) {
    return reply.status(404).send({
      message: apiMessages.notFound,
    })
  }

  throw error
}

function handleDeletePrismaError(error, reply) {
  if (isForeignKeyConstraintError(error)) {
    return reply.status(409).send({
      message: apiMessages.cannotDeleteInUse,
    })
  }

  return handlePrismaRouteError(error, reply)
}

module.exports = {
  handleDeletePrismaError,
  handlePrismaRouteError,
  isForeignKeyConstraintError,
  isRecordNotFoundError,
  isUniqueConstraintError,
}
