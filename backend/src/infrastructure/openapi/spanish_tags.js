/** Orden de aparición en Swagger (más importante → menos importante). */
const swaggerTagDefinitions = [
  {
    name: 'Ventas',
    description:
      'Ventas de boletos, emisión, consulta y validación (operación principal del negocio).',
  },
  {
    name: 'Reportes',
    description: 'Indicadores y resúmenes para panel y reportes.',
  },
  {
    name: 'Flota',
    description: 'Autobuses, rutas, choferes y horarios de salida.',
  },
  {
    name: 'Clientes',
    description: 'Pasajeros registrados en el sistema.',
  },
  {
    name: 'Acceso',
    description: 'Usuarios, roles y permisos (sin autenticación JWT por ahora).',
  },
  {
    name: 'Sistema',
    description: 'Salud del servicio y operaciones técnicas.',
  },
]

const spanishTags = {
  VENTAS: 'Ventas',
  REPORTES: 'Reportes',
  FLOTA: 'Flota',
  CLIENTES: 'Clientes',
  ACCESO: 'Acceso',
  SISTEMA: 'Sistema',
}

module.exports = { spanishTags, swaggerTagDefinitions }
