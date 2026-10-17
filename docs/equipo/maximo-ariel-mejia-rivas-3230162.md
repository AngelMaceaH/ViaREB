# Máximo Ariel Mejía Rivas — 3230162

**Rol:** Desarrollador — módulo **Autobuses** (Flota).

## Tu misión en Fase 1

Reemplazar la pantalla vacía de Autobuses por una interfaz útil: ver la flota, agregar un autobús y marcar si está activo.

## Pantalla

- **Ruta web:** `/fleet/buses`
- **Archivo principal:** `frontend/src/pages/fleet/BusesPage.jsx`

## Modelo de datos (PostgreSQL / Prisma)

Tabla `fleet.buses`:

| Campo (UI) | Campo técnico | Tipo | Notas |
|------------|---------------|------|--------|
| Placa | `licensePlate` | texto | único, obligatorio |
| Capacidad | `capacity` | número entero | asientos |
| Modelo | `modelName` | texto | opcional |
| Activo | `isActive` | sí/no | default activo |

## Tareas (checklist)

- [ ] Leer `README.md` de la raíz y levantar Docker (`docker compose up -d --build`).
- [ ] Abrir http://localhost:3000/fleet/buses y confirmar que carga el menú lateral.
- [ ] Crear `frontend/src/data/mockBuses.js` con 3–5 autobuses de ejemplo.
- [ ] En `BusesPage.jsx`:
  - [ ] Encabezado con título y descripción (puedes inspirarte en `EmptyPage` o `DashboardPage`).
  - [ ] Tabla con columnas: placa, capacidad, modelo, estado (activo/inactivo).
  - [ ] Botón “Agregar autobús” que abre un formulario (modal o sección).
  - [ ] Validación simple: placa y capacidad obligatorios; capacidad > 0.
  - [ ] Mensaje cuando la lista está vacía.
- [ ] Cuando Ángel entregue la API: cambiar mock por `GET /api/fleet/buses` y `POST /api/fleet/buses`.
- [ ] Probar que no hay errores rojos en la consola del navegador (F12).

## Estilo

- Usa clases Tailwind como en `DashboardPage` (`rounded-xl`, `border-slate-200`, etc.).
- Iconos: `Bus` de `lucide-react` (ya usado en el menú).

## Criterios de “listo”

- Se ven datos (mock o API) en tabla.
- Se puede agregar un autobús desde la UI (aunque sea solo en estado local al inicio).
- Rama Git propia y PR listo para revisión de Ángel.

## Ayuda

- Dudas de Git/Docker: pregunta a Ángel.
- Dudas de React: usa el prompt de abajo con Cursor o ChatGPT.

---

## Prompt para IA (copiar y pegar)

```text
Proyecto ViaREB en React 19 + Vite + Tailwind. Debo trabajar en frontend/src/pages/fleet/BusesPage.jsx.

Objetivo Fase 1:
- Reemplazar EmptyPage por una página de gestión de autobuses.
- Datos mock en frontend/src/data/mockBuses.js con campos: id, licensePlate, capacity, modelName, isActive.
- UI: header, tabla responsive, botón agregar, formulario en modal para crear autobús (validar placa y capacity).
- Estilo consistente con frontend/src/pages/DashboardPage.jsx (tarjetas blancas, bordes slate).
- Código del componente en inglés (nombres de variables y funciones).

No uses librerías nuevas de UI. Solo React y Tailwind ya del proyecto.

Muéstrame el código completo de mockBuses.js y BusesPage.jsx.
```
