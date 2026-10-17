# Mauro Modesto Rivera Nuñez — 2230043

**Rol:** Desarrollador — módulo **Horarios** (Flota).

## Tu misión en Fase 1

Pantalla para ver y crear **salidas programadas**: qué ruta, qué autobús, qué chofer, hora de salida (y opcional llegada).

## Pantalla

- **Ruta web:** `/fleet/schedules`
- **Archivo principal:** `frontend/src/pages/fleet/SchedulesPage.jsx`

## Modelo de datos

Tabla `fleet.schedules`:

| Campo (UI) | Campo técnico | Notas |
|------------|---------------|--------|
| Ruta | `routeId` | select |
| Autobús | `busId` | select (mostrar placa) |
| Chofer | `driverId` | select |
| Salida | `departureAt` | fecha y hora |
| Llegada | `arrivalAt` | opcional |
| Activo | `isActive` | sí/no |

## Tareas (checklist)

- [ ] Leer `backend/prisma/schema.prisma` modelo `Schedule` (relaciones con Route, Bus, Driver).
- [ ] Crear `frontend/src/data/mockSchedules.js` que **referencie** ids de mock de rutas, buses y choferes (puedes copiar ids de los archivos mock de tus compañeros o definir ids fijos acordados en equipo).
- [ ] `SchedulesPage.jsx`:
  - [ ] Tabla: ruta (nombre), placa del bus, chofer, fecha/hora salida, estado.
  - [ ] Formulario con 3 `<select>` y datetime para salida.
  - [ ] Ordenar por fecha de salida (más próximos primero).
- [ ] **Fase 1b** (después de APIs): cargar opciones de selects desde API de rutas, buses y choferes.
- [ ] Coordinar con Máximo, Elijah y Carlos para ids mock consistentes.

## Dependencias

| Debe existir primero (mock o API) | Responsable |
|-----------------------------------|-------------|
| Rutas | Elijah |
| Autobuses | Máximo |
| Choferes | Carlos |

## Criterios de “listo”

- Tabla de horarios legible con datos enlazados (nombres, no solo ids).
- Formulario crea un horario nuevo en estado local.

---

## Prompt para IA (copiar y pegar)

```text
ViaREB React + Tailwind. Archivo: frontend/src/pages/fleet/SchedulesPage.jsx.

Horarios de buses: cada schedule tiene routeId, busId, driverId, departureAt, arrivalAt opcional, isActive.

Tengo mocks separados para routes, buses, drivers (arrays con id y labels). Necesito:
1) mockSchedules.js con referencias a esos ids
2) Página que en la tabla muestre nombres/placas resolviendo los ids
3) Formulario con selects y input datetime-local
4) Orden por departureAt ascendente
5) Estilo Tailwind del proyecto, código en inglés

Ayúdame con los archivos completos y una función helper resolveRouteName(routeId, routes).
```
