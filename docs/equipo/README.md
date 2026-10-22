# ViaREB — Distribución de trabajo (Fase 1)

Proyecto USAP: venta y validación de boletos de autobús.

## Equipo

| Integrante | Carné | Módulo Fase 1 |
|------------|-------|----------------|
| Ángel Johan Macea Hernández | 2230063 | Líder técnico + base API + Ventas/Boletos (esqueleto) |
| Máximo Ariel Mejía Rivas | 3230162 | Flota → Autobuses |
| Elijah Anakin Rivera Henriquez | 1200326 | Flota → Rutas |
| Carlos Fernando Vargas Bautista | 3230201 | Flota → Choferes |
| Mauro Modesto Rivera Nuñez | 2230043 | Flota → Horarios |
| Jenifer Carolina Flores Gamez | 2190219 | Clientes → Pasajeros |
| Juan Carlos Bardales Ramos | 2180551 | Acceso → Usuarios |
| Brian Gabriel Pinto Hernández | 1170003 | Acceso → Roles y Permisos |

## Objetivo de la Fase 1

1. Todos pueden levantar el proyecto con Docker.
2. Cada integrante entrega **su pantalla** con tabla, estados vacíos/errores y formulario básico.
3. El **patrón de API** ya está en `backend/src/modules/flota/autobuses/` (`GET` lista, `GET` por id, `POST` crear) y `frontend/src/lib/apiClient.js` (envía el JWT automáticamente tras iniciar sesión en `/login`). Cada integrante puede copiar ese módulo y conectar su pantalla.
4. Hasta entonces se puede usar **datos mock** en un archivo `frontend/src/data/mock*.js` (como el Panel).

## Orden sugerido (dependencias)

```text
Ángel: health + patrón CRUD de referencia
  ↓
Máximo, Elijah, Carlos: autobuses, rutas, choferes (en paralelo)
  ↓
Mauro: horarios (necesita IDs de ruta, bus y chofer)
Jenifer, Juan Carlos, Brian: pasajeros y acceso (en paralelo con flota)
  ↓
Ángel: ventas/boletos cuando existan horarios y pasajeros
```

## Archivos de asignación

Cada persona tiene su guía en esta carpeta:

- [angel-johan-macea-hernandez-2230063.md](./angel-johan-macea-hernandez-2230063.md)
- [maximo-ariel-mejia-rivas-3230162.md](./maximo-ariel-mejia-rivas-3230162.md)
- [elijah-anakin-rivera-henriquez-1200326.md](./elijah-anakin-rivera-henriquez-1200326.md)
- [carlos-fernando-vargas-bautista-3230201.md](./carlos-fernando-vargas-bautista-3230201.md)
- [mauro-modesto-rivera-nunez-2230043.md](./mauro-modesto-rivera-nunez-2230043.md)
- [jenifer-carolina-flores-gamez-2190219.md](./jenifer-carolina-flores-gamez-2190219.md)
- [juan-carlos-bardales-ramos-2180551.md](./juan-carlos-bardales-ramos-2180551.md)
- [brian-gabriel-pinto-hernandez-1170003.md](./brian-gabriel-pinto-hernandez-1170003.md)

## Levantar el proyecto (todos)

```powershell
cd C:\ruta\al\repo\ViaREB
Copy-Item .env.example .env
docker compose up -d --build
```

- Web: http://localhost:3000  
- API: http://localhost:8000/api/health  

## Reglas de trabajo en Git

- Una rama por persona: `feature/fase1-<modulo>-<carné>` (ej. `feature/fase1-buses-3230162`).
- Commits pequeños y mensajes claros en español o inglés.
- No subir `.env` ni contraseñas.
- Antes de pedir revisión a Ángel: la página abre sin errores en consola del navegador.

## Stack (referencia rápida)

| Capa | Tecnología |
|------|------------|
| Frontend | React 19, Vite, React Router, Tailwind, lucide-react |
| Backend | Node.js, Fastify, Prisma |
| Base de datos | PostgreSQL (schemas: `access`, `fleet`, `customer`, `sales`) |

Modelos: ver `backend/prisma/schema.prisma`.
