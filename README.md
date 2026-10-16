# ViaREB

Proyecto para USAP: venta y validación de tickets de autobuses.

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / Mac / Linux)

No hace falta instalar Node ni PostgreSQL en la máquina si usas Docker.

## Levantar todo el proyecto (recomendado)

En la raíz del repositorio:

```powershell
Copy-Item .env.example .env
docker compose up -d --build
```

La primera vez puede tardar varios minutos (descarga de imágenes y compilación).

| Servicio   | URL |
|-----------|-----|
| **App web** (frontend + proxy API) | http://localhost:3000 |
| API directa (opcional) | http://localhost:8000/api/health |
| Prueba API vía nginx | http://localhost:3000/api/health |

## Comandos útiles

```powershell
# Ver estado de los contenedores
docker compose ps

# Ver logs
docker compose logs -f

# Detener
docker compose down

# Detener y borrar datos de la base (¡cuidado!)
docker compose down -v
```

## Variables de entorno

Archivo `.env` en la raíz (copiar desde `.env.example`):

- `POSTGRES_*` — usuario, contraseña y nombre de la base
- `FRONTEND_HOST_PORT` — puerto de la web (por defecto `3000`)
- `BACKEND_HOST_PORT` — puerto de la API (por defecto `8000`)
- `CORS_ORIGIN` — URL pública del frontend (en VPS usar `http://tu-ip:3000` o tu dominio)

En un servidor barato (VPS), cambia `POSTGRES_PASSWORD` por una contraseña segura antes de desplegar.

## Desarrollo sin Docker (opcional)

Ver `backend/README.md` para API local con Prisma y el compose solo de base de datos en `backend/docker/`.

## Base de datos (schemas PostgreSQL)

Las tablas no viven en `public`; Prisma las agrupa así:

| Schema | Contenido |
|--------|-----------|
| `access` | users, roles, permissions, user_roles, role_permissions |
| `fleet` | buses, routes, drivers, schedules |
| `customer` | passengers |
| `sales` | sales, tickets |

Si ya migraste la versión anterior en `public`, resetea el volumen de Docker antes de volver a migrar: `docker compose down -v` y luego `docker compose up -d --build`.

## Estructura

- `frontend/` — React + Vite (en Docker se sirve con nginx)
- `backend/` — API Fastify + Prisma
- `docker-compose.yml` — orquesta base de datos, backend y frontend
