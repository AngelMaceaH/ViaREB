# Carlos Fernando Vargas Bautista — 3230201

**Rol:** Desarrollador — módulo **Choferes** (Flota).

## Tu misión en Fase 1

Pantalla para registrar choferes: nombre, número de licencia y teléfono.

## Pantalla

- **Ruta web:** `/fleet/drivers`
- **Archivo principal:** `frontend/src/pages/fleet/DriversPage.jsx`

## Modelo de datos

Tabla `fleet.drivers`:

| Campo (UI) | Campo técnico | Tipo |
|------------|---------------|------|
| Nombre completo | `fullName` | texto |
| Nº licencia | `licenseNumber` | texto, único |
| Teléfono | `phoneNumber` | texto, opcional |
| Activo | `isActive` | sí/no |

## Tareas (checklist)

- [ ] Ambiente Docker funcionando y página `/fleet/drivers` accesible.
- [ ] `frontend/src/data/mockDrivers.js` con 5 choferes de ejemplo.
- [ ] `DriversPage.jsx`:
  - [ ] Tabla con nombre, licencia, teléfono, estado.
  - [ ] Formulario agregar chofer; validar licencia única en la lista mock (no duplicar).
  - [ ] Formato de teléfono flexible (solo no vacío si el usuario escribe algo).
- [ ] Preparar llamadas API: `GET /api/fleet/drivers`, `POST /api/fleet/drivers` (cuando Ángel las publique).

## Relación con el equipo

- **Mauro** asignará choferes en Horarios.

## Criterios de “listo”

- UI completa con mock; lista vacía manejada; sin errores en consola.

---

## Prompt para IA (copiar y pegar)

```text
Proyecto ViaREB (React, Vite, Tailwind). Trabajo en frontend/src/pages/fleet/DriversPage.jsx.

Crear gestión de choferes:
- mockDrivers.js: fullName, licenseNumber, phoneNumber, isActive
- Tabla + modal formulario
- Validar licenseNumber único entre registros locales
- Diseño coherente con EmptyPage header y tarjetas del dashboard
- Identificadores en inglés

Entrega código completo de ambos archivos.
```
