# Ángel Johan Macea Hernández — 2230063

**Rol:** Líder técnico / integración / revisión de código.

## Tu misión en Fase 1

Dejar la **base del backend** lista para que el equipo pueda copiar el mismo patrón en su módulo, y avanzar el esqueleto de **Ventas** y **Boletos** (las pantallas más complejas).

## Tareas

### A. Infraestructura API (prioridad alta)

- [x] Crear estructura en `backend/src/` (ej. `routes/`, `modules/` o `features/`) para registrar rutas por dominio.
- [x] Implementar **un módulo de referencia completo** (recomendado: `fleet/buses`): `GET /api/fleet/buses`, `GET /api/fleet/buses/:id`, `POST /api/fleet/buses`.
- [x] Validación de body con esquemas Fastify (mismos campos que `Bus` en Prisma).
- [x] Documentar en comentario o `backend/README.md` cómo registrar una ruta nueva.
- [x] (Opcional) Script de seed con datos de prueba para horarios y ventas.

### B. Frontend compartido

- [x] Crear componentes reutilizables si hace falta: `DataTable`, `PageHeader`, `Modal`, `LoadingState`, `ErrorState` en `frontend/src/components/`.
- [x] Crear `frontend/src/lib/apiClient.js` (fetch a `/api/...` vía proxy de nginx en Docker).

### C. Ventas (esqueleto Fase 1)

- [x] `frontend/src/pages/sales/SalesPage.jsx`: layout con pasos o formulario simple (mock).
- [x] `frontend/src/pages/sales/TicketsPage.jsx`: tabla de boletos con columnas: código, pasajero, ruta, estado, precio.
- [x] Endpoints mínimos cuando existan dependencias: listar tickets `GET /api/sales/tickets`.

### D. Coordinación

- [ ] Revisar PRs del equipo y unificar estilo.
- [ ] Actualizar `docs/equipo/README.md` si cambian dependencias o fechas.

## Archivos clave

| Área | Rutas |
|------|--------|
| Servidor | `backend/src/server.js` |
| Prisma | `backend/prisma/schema.prisma` |
| Ventas UI | `frontend/src/pages/sales/` |
| Referencia UI | `frontend/src/pages/DashboardPage.jsx`, `frontend/src/data/mockDashboardData.js` |

## Criterios de “listo”

- El módulo de referencia (buses) funciona contra PostgreSQL en Docker.
- El equipo tiene un ejemplo copiable de ruta Fastify + llamada desde React.
- OpenAPI/Swagger sigue cargando (ver `register_openapi.js`).

---

## Prompt para IA (copiar y pegar)

```text
Contexto: Proyecto ViaREB (venta de boletos de bus). Repo con React+Vite+Tailwind en frontend/ y Fastify+Prisma+PostgreSQL en backend/. Schemas DB: access, fleet, customer, sales. Docker compose en la raíz.

Soy el líder técnico. Necesito:
1) Estructura de carpetas en backend/src para rutas por módulo (fleet, access, etc.).
2) CRUD de referencia para el modelo Bus (schema fleet) en Prisma: GET lista, GET por id, POST crear.
3) Registrar las rutas en server.js sin romper /api/health ni OpenAPI existente.
4) Un apiClient en frontend (fetch a /api/...) y ejemplo de uso en BusesPage.

Restricciones:
- Código e identificadores en inglés.
- Usar el prisma client existente en infrastructure/database/prisma_client.js.
- Validación con schema JSON de Fastify en cada ruta.
- No inventar dependencias npm sin necesidad.

Archivos actuales relevantes: backend/src/server.js, backend/prisma/schema.prisma, frontend/src/pages/fleet/BusesPage.jsx.

Guíame paso a paso y dame el código completo de cada archivo nuevo o modificado.
```
