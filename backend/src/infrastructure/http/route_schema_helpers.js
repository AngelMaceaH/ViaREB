const { spanishTags } = require('../openapi/spanish_tags')

function buildDeleteByIdRouteSchema({ tag, summary, description }) {
  return {
    tags: [tag],
    summary,
    description,
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', description: 'Identificador del registro' },
      },
    },
    response: {
      204: {
        type: 'null',
        description: 'Eliminado correctamente',
      },
      404: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string' },
        },
      },
      409: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string' },
        },
      },
    },
  }
}

function buildNotFoundResponseSchema() {
  return {
    type: 'object',
    required: ['message'],
    properties: {
      message: { type: 'string', description: 'Detalle del error' },
    },
  }
}

module.exports = {
  buildDeleteByIdRouteSchema,
  buildNotFoundResponseSchema,
  spanishTags,
}
