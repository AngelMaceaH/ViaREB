# Brian Gabriel Pinto Hernández — 1170003

**Rol:** Desarrollador — módulos **Roles** y **Permisos** (Acceso).

## Tu misión en Fase 1

Dos pantallas relacionadas: definir **roles** (ej. Administrador, Cajero) y listar **permisos** del sistema (códigos como `sales.create`).

## Pantallas

| Pantalla | Ruta | Archivo |
|----------|------|---------|
| Roles | `/access/roles` | `frontend/src/pages/access/RolesPage.jsx` |
| Permisos | `/access/permissions` | `frontend/src/pages/access/PermissionsPage.jsx` |

## Modelos de datos

**Roles** (`access.roles`): `name`, `description` (opcional).

**Permisos** (`access.permissions`): `code`, `name`, `description` (opcional).

Relación muchos a muchos: `role_permissions` (para **Fase 2** puedes mostrar checkboxes; en Fase 1 basta listar roles y permisos por separado).

## Tareas (checklist)

- [ ] `frontend/src/data/mockRoles.js` (Admin, Cajero, Supervisor…).
- [ ] `frontend/src/data/mockPermissions.js` (códigos: `fleet.read`, `sales.create`, `tickets.validate`, etc.).
- [ ] **RolesPage:** tabla roles + formulario crear rol (nombre único).
- [ ] **PermissionsPage:** tabla permisos (código, nombre, descripción); solo lectura o alta simple de permisos mock.
- [ ] (Opcional Fase 1+) En RolesPage, panel lateral que muestre qué permisos tendría un rol usando un mapa mock `roleId -> permissionCodes[]`.
- [ ] APIs futuras: `/api/access/roles`, `/api/access/permissions`.

## Criterios de “listo”

- Ambas rutas del menú “Acceso” dejan de ser solo `EmptyPage`.
- Códigos de permiso en mayúsculas o kebab-case consistente (documenta la convención al inicio del mock).

---

## Prompt para IA (copiar y pegar)

```text
ViaREB React + Tailwind. Dos páginas:
- frontend/src/pages/access/RolesPage.jsx
- frontend/src/pages/access/PermissionsPage.jsx

Mocks:
- mockRoles.js: id, name, description
- mockPermissions.js: id, code, name, description

RolesPage: tabla + crear rol (name único).
PermissionsPage: tabla de permisos, sin editar por ahora.
Opcional: en RolesPage mostrar lista de permission codes asignados desde un objeto mock rolePermissionsMap.

Estilo como DashboardPage/EmptyPage header. Código en inglés. Archivos completos.
```
