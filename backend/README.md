# ViaREB Backend

Node.js API (Fastify) with PostgreSQL and Prisma.

## Run with Docker (whole stack)

From the **repository root**:

```bash
docker compose up -d --build
```

See the root `README.md` for URLs and team instructions.

## Prerequisites (local Node development)

- Node.js 20+ (LTS recommended; Node 24 may work but is less tested)
- Docker Desktop (recommended for local PostgreSQL)

After `npm install`, the Prisma client is generated in `postinstall`. If you see `Cannot find module '.prisma/client/default'`, run:

```bash
npm run db:generate
```

## Local database

1. Copy environment variables **before** `npm run dev`:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell: `Copy-Item .env.example .env`

2. Start PostgreSQL (exposed on host port **5434** by default; change `docker-compose.develop.yml` if that port is in use):

   ```bash
   docker compose -f docker/docker-compose.develop.yml up -d
   ```

3. Apply migrations:

   ```bash
   npm run db:migrate
   ```

   For production or CI without prompts: `npm run db:migrate:deploy`

4. Generate the Prisma client (after schema changes):

   ```bash
   npm run db:generate
   ```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | API with Node watch mode (hot reload) |
| `npm run db:migrate` | Create/apply migrations in development |
| `npm run db:studio` | Prisma Studio UI |

## API

- `GET /api/health` — API and database connectivity check (público)
- `GET /docs` — Swagger UI (OpenAPI)
- **Autenticación JWT** — el resto de `/api/*` exige `Authorization: Bearer <token>`

### Autenticación

| Endpoint | Descripción |
|----------|-------------|
| `POST /api/auth/login` | Body `{ "email", "password" }` → `accessToken` |
| `GET /api/auth/me` | Usuario actual (requiere Bearer) |

Variables en `.env`: `JWT_SECRET` (obligatorio en producción), `JWT_EXPIRES_IN` (default `8h`).

Tras `npm run db:seed`, usuarios demo:

| Correo | Contraseña | Rol |
|--------|------------|-----|
| `admin@viareb.local` | `Admin123!` | ADMIN |
| `cajero@viareb.local` | `Cajero123!` | CAJERO |

El JWT incluye `roles` y `permissions` (códigos como `sales.manage`). Para restringir un endpoint concreto usa `preHandler: [requirePermission('access.manage')]` desde `infrastructure/security/require_permission.js`.

### Reportes (Business Intelligence)

Parámetros comunes: `desde` y `hasta` (YYYY-MM-DD), `limite`, `semanas`, `meses`.

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/reports/panel` | Panel ejecutivo consolidado |
| `GET /api/reports/indicadores` | KPIs principales |
| `GET /api/reports/ventas/resumen` | Totales y promedios por período |
| `GET /api/reports/ventas/diarias` | Serie diaria de ventas |
| `GET /api/reports/ventas/semanales` | Ventas por semana |
| `GET /api/reports/ventas/mensuales` | Ventas por mes |
| `GET /api/reports/ventas/por-ruta` | Ingresos por ruta |
| `GET /api/reports/ventas/por-cajero` | Ingresos por usuario cajero |
| `GET /api/reports/ventas/ultimas` | Tabla de ventas recientes |
| `GET /api/reports/boletos/por-estado` | Gráfico de estados |
| `GET /api/reports/boletos/validacion` | Tasa de validación |
| `GET /api/reports/boletos/tendencia` | Emisión diaria de boletos |
| `GET /api/reports/flota/resumen` | Estado de flota |
| `GET /api/reports/flota/demanda-por-ruta` | Demanda relativa por ruta |
| `GET /api/reports/horarios/proximas-salidas` | Próximas salidas |
| `GET /api/reports/pasajeros/resumen` | Altas y pasajeros frecuentes |

### Fleet (`/api/fleet/...`)

| Recurso | Listar | Consultar | Crear | Actualizar | Eliminar |
|---------|--------|-----------|-------|------------|----------|
| `buses` | GET | GET | POST | PATCH | DELETE |
| `routes` | GET | GET | POST | PATCH | DELETE |
| `drivers` | GET | GET | POST | PATCH | DELETE |
| `schedules` | GET | GET | POST | PATCH | DELETE |

### Customer

| Recurso | Listar | Consultar | Crear | Actualizar | Eliminar |
|---------|--------|-----------|-------|------------|----------|
| `passengers` (`/api/customer/passengers`) | GET | GET | POST | PATCH | DELETE |

### Access (`/api/access/...`)

| Recurso | Listar | Consultar | Crear | Actualizar | Eliminar |
|---------|--------|-----------|-------|------------|----------|
| `users` | GET | GET | POST | PATCH | DELETE |
| `roles` | GET | GET | POST | PATCH | DELETE |
| `permissions` | GET | GET | POST | PATCH | DELETE |

Assignments:

- `POST /api/access/users/:userId/roles/:roleId`
- `DELETE /api/access/users/:userId/roles/:roleId`
- `POST /api/access/roles/:roleId/permissions/:permissionId`
- `DELETE /api/access/roles/:roleId/permissions/:permissionId`

User create/update accepts `password` (stored hashed with scrypt). Responses never include password hashes.

### Sales (`/api/sales/...`)

| Endpoint | Métodos | Descripción |
|----------|---------|-------------|
| `/api/sales` | GET, POST | Listar ventas; crear venta con `tickets[]` |
| `/api/sales/:id` | GET, PATCH, DELETE | Detalle; actualizar pasajero; eliminar venta (cascada boletos) |
| `/api/sales/tickets` | GET | Listar boletos |
| `/api/sales/tickets/code/:ticketCode` | GET | Buscar por código (validación) |
| `/api/sales/tickets/:id` | GET, PATCH, DELETE | Detalle; cambiar `status`; eliminar boleto |

La documentación interactiva en `/docs` está en **español** (resúmenes, descripciones y mensajes de error). El orden de grupos en Swagger: **Ventas → Reportes → Flota → Clientes → Acceso → Sistema**. Dentro de cada módulo: listar → crear → consultar → actualizar → eliminar.

## Adding a new route module

1. Crear carpeta en `src/modules/<dominio>/<recurso>/` (ejemplo: `src/modules/flota/trayectos/`).
2. Esquemas Fastify en `esquemas_<recurso>.js` (body, params, response) con tag OpenAPI en español.
3. Handlers en `rutas_<recurso>.js` usando `getPrismaClient()` desde `src/infrastructure/database/prisma_client.js`.
4. Registrar en `src/routes/register_application_routes.js`.
5. Si aplica, agregar etiqueta en `src/infrastructure/openapi/spanish_tags.js`.

El módulo de referencia es **autobuses** (`src/modules/flota/autobuses/`).

### Optional demo data

```bash
node prisma/seed.js
```

Requires `DATABASE_URL` in `.env` and applied migrations.
