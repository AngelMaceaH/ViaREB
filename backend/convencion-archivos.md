# Convención de archivos del backend

## Inglés (plataforma)

Entrada, infraestructura compartida y herramientas:

```text
src/
  server.js
  routes/register_application_routes.js
  infrastructure/
    database/prisma_client.js
    http/{api_messages,prisma_errors,serialization,...}.js
    openapi/{register_openapi,spanish_tags}.js
    security/password_hasher.js
prisma/seed.js
```

## Español (módulos de dominio / Swagger)

Carpetas y archivos de cada recurso expuesto en la API:

```text
src/modules/
  informes/
  flota/{autobuses,trayectos,choferes,horarios}/
  clientes/pasajeros/
  acceso/{usuarios,roles,permisos}/
  ventas/{ventas,boletos}/
```

| Archivo | Rol |
|---------|-----|
| `rutas_<recurso>.js` | Endpoints Fastify |
| `esquemas_<recurso>.js` | JSON Schema / OpenAPI (textos en español) |
| `mapeador_<recurso>.js` | Serialización Prisma → API |

## Arranque

- Desarrollo: `npm run dev` → `src/server.js`
- Semilla DB: `npm run db:seed` → `prisma/seed.js`

Las rutas HTTP, mensajes de error y etiquetas Swagger están en español. Los nombres de funciones exportadas (ej. `registerBusRoutes`) pueden permanecer en inglés.
