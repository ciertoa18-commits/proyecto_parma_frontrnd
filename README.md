# PharmaSoft · Frontend

SPA en **Angular 22** para la gestión de una botica: categorías, productos, clientes, ventas y reportes.
Se conecta con [PharmaBackend](https://github.com/ciertoa18-commits/proyecto_parma_bakent_2) (Spring Boot 4 + Oracle + Redis).

> Lenguaje de Programación II · UPeU · Proyecto Integrador Full-Stack

## Funcionalidades

| Módulo | Qué permite |
|---|---|
| Inicio | Bienvenida y, para quien tiene `REPORTES_VER`, el reporte **Productos más vendidos** cargado con `@defer` |
| Categorías | Listar, crear, editar y eliminar |
| Productos | Listado paginado y mantenimiento |
| Clientes | Registro y mantenimiento |
| Ventas | Registro de ventas con detalle y consulta |
| Reportes | Ventas por categoría |
| Seguridad | Login con JWT, guards por permiso e interceptores de token y errores |

## Tecnologías

- Angular 22 (componentes standalone, signals, `@defer`)
- Carga diferida por ruta (`loadChildren` / `loadComponent`)
- Nginx 1.27 + Docker Compose para servir la versión de producción

## Requisitos

- Node.js 22 o superior y npm
- PharmaBackend en marcha en `http://localhost:8080`
- Docker Desktop (solo para el despliegue con Nginx)

## Ejecutar en desarrollo

```bash
npm install
npm start
```

Abre `http://localhost:4200`. En desarrollo la URL del API es `http://localhost:8080/api/v1`
(`src/environments/environment.development.ts`).

## Ejecutar en modo producción (Nginx)

```bash
ng build
cd deploy
docker compose up -d web
```

Abre `http://localhost:8081`. Nginx sirve la SPA compilada y reenvía `/api/` al backend,
así que la SPA y el API comparten origen y no hace falta CORS.

| Archivo | Política |
|---|---|
| `index.html` | `Cache-Control: no-cache` (siempre se revalida) |
| `*.js`, `*.css` (con hash) | `public, max-age=31536000, immutable` |
| Rutas de Angular | `try_files … /index.html` (F5 no da 404) |
| Compresión | gzip para CSS, JS, JSON y SVG |

## Usuarios de prueba

Los crea la migración `V3__datos_iniciales_seguridad.sql` del backend: `admin`, `vendedor` y `almacen`.
Cambia sus contraseñas antes de usar el sistema en producción.

## Optimización (Sesión 13)

| Evidencia | Antes | Después |
|---|---|---|
| Initial total (Raw / Transfer) | 293.99 kB / 81.64 kB | 306.39 kB / 86.73 kB |
| Filas de *Lazy chunk files* | 16 | 18 (incluye `mas-vendidos`) |
| Recarga de `index.html` | — | 304, sin cuerpo; JS y CSS desde la caché |

El presupuesto `initial` avisa a partir de 360 kB (`angular.json`).

## Scripts

| Comando | Uso |
|---|---|
| `npm start` | Servidor de desarrollo |
| `ng build` | Compilación de producción en `dist/pharma-frontend/browser` |
| `ng build --stats-json` | Genera `stats.json` para analizarlo en https://esbuild.github.io/analyze/ |
| `ng test` | Pruebas unitarias con Vitest |

## Estructura

```
src/app/
├── core/       autenticación, guards, interceptores, menú y utilidades
├── features/   categorias, clientes, productos, ventas, reportes, inicio, auth
├── layout/     header, sidebar y layout principal
└── shared/     páginas de acceso denegado y no encontrado
deploy/         nginx.conf y docker-compose.yml
```

## Autor

Alvino Cierto · [ciertoa18-commits](https://github.com/ciertoa18-commits)
