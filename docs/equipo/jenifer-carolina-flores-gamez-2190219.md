# Jenifer Carolina Flores Gamez — 2190219

**Rol:** Desarrolladora — módulo **Pasajeros** (Clientes).

## Tu misión en Fase 1

Registrar y listar pasajeros que comprarán boletos.

## Pantalla

- **Ruta web:** `/customers/passengers`
- **Archivo principal:** `frontend/src/pages/customers/PassengersPage.jsx`

## Modelo de datos

Tabla `customer.passengers`:

| Campo (UI) | Campo técnico | Tipo |
|------------|---------------|------|
| Nombre completo | `fullName` | texto |
| Documento (DNI) | `documentNumber` | texto, único |
| Correo | `email` | opcional |
| Teléfono | `phoneNumber` | opcional |

## Tareas (checklist)

- [ ] Levantar Docker y abrir `/customers/passengers`.
- [ ] `frontend/src/data/mockPassengers.js` con varios registros.
- [ ] `PassengersPage.jsx`:
  - [ ] Tabla: nombre, documento, email, teléfono.
  - [ ] Búsqueda por nombre o número de documento.
  - [ ] Formulario nuevo pasajero; documento único en la lista.
  - [ ] Validación básica de email (contiene `@`) si se llena.
- [ ] Preparar integración: `GET /api/customer/passengers`, `POST /api/customer/passengers`.

## Relación con el equipo

- **Ángel** usará pasajeros en Ventas y Boletos.

## Criterios de “listo”

- Búsqueda y alta funcionan en frontend; mensajes claros si falta el documento.

---

## Prompt para IA (copiar y pegar)

```text
ViaREB: React + Tailwind. frontend/src/pages/customers/PassengersPage.jsx.

Página de pasajeros con mockPassengers.js (fullName, documentNumber, email, phoneNumber).
Tabla, buscador por nombre/documento, formulario crear con validación documentNumber único y email opcional con @.
Mismo estilo visual que otras páginas del proyecto (header + tarjeta blanca).
Código en inglés. Archivos completos por favor.
```
