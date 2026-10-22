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
    name: 'Autenticación',
    description: 'Inicio de sesión JWT y consulta de la sesión actual.',
  },
  {
    name: 'Acceso',
    description: 'Usuarios, roles y permisos (requieren JWT).',
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
  AUTENTICACION: 'Autenticación',
  ACCESO: 'Acceso',
  SISTEMA: 'Sistema',
}

module.exports = { spanishTags, swaggerTagDefinitions }
