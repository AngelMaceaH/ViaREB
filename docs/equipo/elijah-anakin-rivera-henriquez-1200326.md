# Elijah Anakin Rivera Henriquez — 1200326

**Rol:** Desarrollador — módulo **Rutas** (Flota).

## Tu misión en Fase 1

Pantalla para administrar rutas de autobús: origen, destino, nombre y distancia.

## Pantalla

- **Ruta web:** `/fleet/routes`
- **Archivo principal:** `frontend/src/pages/fleet/RoutesPage.jsx`

## Modelo de datos

Tabla `fleet.routes`:

| Campo (UI) | Campo técnico | Tipo |
|------------|---------------|------|
| Nombre | `name` | texto, obligatorio |
| Origen | `origin` | texto |
| Destino | `destination` | texto |
| Distancia (km) | `distanceKilometers` | decimal, opcional |
| Activa | `isActive` | sí/no |

## Tareas (checklist)

- [ ] Levantar el proyecto con Docker (ver `docs/equipo/README.md`).
- [ ] Crear `frontend/src/data/mockRoutes.js` con al menos 4 rutas (ej. Tegucigalpa–San Pedro Sula).
- [ ] Implementar `RoutesPage.jsx`:
  - [ ] Tabla: nombre, origen → destino, distancia, estado.
  - [ ] Formulario “Nueva ruta” con validación (nombre, origen y destino obligatorios).
  - [ ] Badge o texto para rutas inactivas.
- [ ] (Opcional) Campo de búsqueda que filtre por nombre u origen.
- [ ] Conectar a `GET/POST /api/fleet/routes` cuando la API exista.

## Relación con el equipo

- **Mauro** usará tus rutas en Horarios (necesitará `id` y nombre para selects).

## Criterios de “listo”

- Lista y alta funcionan con mock (o API).
- La página se ve bien en pantalla de laptop y no rompe el layout del `AppLayout`.

---

## Prompt para IA (copiar y pegar)

```text
ViaREB: React + Tailwind. Archivo: frontend/src/pages/fleet/RoutesPage.jsx.

Necesito una página de administración de rutas de bus con:
- mockRoutes.js (id, name, origin, destination, distanceKilometers, isActive)
- Tabla con origen/destino visibles
- Formulario crear ruta con validación
- Estilos como DashboardPage.jsx del mismo repo
- Sin librerías UI extra

Código en inglés. Dame archivos completos.
```
