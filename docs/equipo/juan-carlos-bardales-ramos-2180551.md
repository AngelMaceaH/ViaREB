# Juan Carlos Bardales Ramos — 2180551

**Rol:** Desarrollador — módulo **Usuarios** (Acceso).

## Tu misión en Fase 1

Pantalla para ver usuarios del sistema (personal que vende boletos en caja). **En Fase 1 no implementes cambio de contraseñas reales ni hashes**; solo UI y mock.

## Pantalla

- **Ruta web:** `/access/users`
- **Archivo principal:** `frontend/src/pages/access/UsersPage.jsx`

## Modelo de datos

Tabla `access.users` (solo campos seguros para mostrar en UI):

| Campo (UI) | Campo técnico | Notas |
|------------|---------------|--------|
| Nombre | `fullName` | |
| Correo | `email` | único |
| Activo | `isActive` | |
| — | `passwordHash` | **nunca** mostrar en UI; en mock usar campo omitido |

## Tareas (checklist)

- [ ] Leer sección `access` en `backend/prisma/schema.prisma`.
- [ ] `frontend/src/data/mockUsers.js` (sin contraseñas; solo fullName, email, isActive).
- [ ] `UsersPage.jsx`:
  - [ ] Tabla usuarios con badge Activo/Inactivo.
  - [ ] Formulario “Invitar usuario”: nombre, email, contraseña temporal (solo UI; al guardar en mock no guardes la contraseña en el objeto exportado).
  - [ ] Aviso visible: “La seguridad real la conectará el líder técnico en fase 2”.
- [ ] API futura: `GET /api/access/users`, `POST /api/access/users` (Ángel definirá hashing).

## Criterios de “listo”

- No hay contraseñas en archivos mock commiteados.
- Lista y formulario funcionan con datos locales.

---

## Prompt para IA (copiar y pegar)

```text
ViaREB React + Tailwind. frontend/src/pages/access/UsersPage.jsx.

Administración de usuarios del sistema (mock):
- mockUsers.js solo con id, fullName, email, isActive (sin passwords)
- Tabla + formulario con campo password que NO se persiste en el mock (solo validar min 8 caracteres en UI)
- Badge activo/inactivo
- Texto de ayuda que la autenticación real viene después
- Estilo Tailwind del repo, código en inglés

Dame código completo.
```
