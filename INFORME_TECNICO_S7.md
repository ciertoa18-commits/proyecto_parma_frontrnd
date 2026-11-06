# Informe técnico — PharmaSoft, sesión 7

## Objetivo

Implementar la SPA PharmaSoft con Angular, una arquitectura por capas y navegación
diferida. La práctica de clase requiere el CRUD de Categorías conectado a
PharmaBackend. El reto autónomo amplía la misma arquitectura al módulo de Clientes
y solicita explicar la organización y las responsabilidades.

## Organización y responsabilidades

| Capa | Ubicación | Responsabilidad |
|---|---|---|
| `core` | `src/app/core` | Configuración compartida del menú, modelos de respuesta y utilidades comunes para errores y datos. |
| `shared` | `src/app/shared` | Páginas reutilizables, incluida la página 404. |
| `layout` | `src/app/layout` | Estructura persistente de la SPA: encabezado, menú y sidebar, además del área donde se presenta la ruta activa. |
| `features` | `src/app/features` | Funcionalidades de negocio independientes, cada una con sus rutas, modelos, servicios y páginas. |
| `environments` | `src/environments` | URL base de la API según el modo de compilación. |

`app.routes.ts` registra `MainLayout` como padre, redirige la ruta raíz a Inicio,
carga los módulos mediante `loadChildren` y envía rutas desconocidas a la página
404. Cada módulo mantiene sus rutas dentro de su propia carpeta.

El arreglo `MENU`, en `src/app/core/config/menu.ts`, es la fuente de los enlaces
del sidebar. `Sidebar` presenta esos elementos y marca la ruta activa. `Header`
emite el evento para que `MainLayout` oculte o muestre el sidebar. Los servicios
HTTP son el único punto de cada módulo que conoce los endpoints; las páginas se
encargan de presentar el estado, validar formularios y traducir errores comunes
para el usuario.

## Módulos

### Categorías

`CategoriaService` implementa listar, obtener, crear, actualizar y eliminar sobre
`/api/v1/categorias`. El listado permite filtrar localmente, muestra carga, error y
estado vacío, y pide confirmación antes de borrar. El formulario sirve para crear
y editar; aplica las restricciones de nombre (3–50 caracteres) y descripción
(máximo 200), y presenta errores de validación o mensajes devueltos por la API.

### Clientes

`ClienteService` implementa listar, obtener, crear, actualizar y eliminar sobre
`/api/v1/clientes`. `ClienteList` muestra y filtra por nombre, DNI o correo, y
permite confirmar una eliminación. `ClienteForm` registra y edita DNI, nombres,
apellidos, correo, teléfono, dirección y estado. Los errores HTTP y de validación
se presentan usando las utilidades comunes de `core`.

La forma de `ClienteRequestDTO` y `ClienteResponseDTO` se contrastó con el
documento OpenAPI del backend disponible durante la validación.

## Conexión local

En desarrollo, `environment.development.ts` usa `/api/v1` y `proxy.conf.json`
redirige las peticiones a `http://localhost:8080`. Esto evita la restricción CORS
del navegador en el entorno local. La configuración de producción usa
`http://localhost:8080/api/v1`, como indica la guía; al desplegar, se debe cambiar
por la URL real de la API.

La SPA necesita que PharmaBackend esté ejecutándose en el puerto 8080 y que su
conexión Oracle esté configurada. La configuración de Oracle y el código del
backend no forman parte de este repositorio frontend ni se modificaron.

## Validación ejecutada

| Comprobación | Resultado |
|---|---|
| Compilación de producción de Angular (`npm run build`) | Correcta |
| Frontend en `http://localhost:4200` | Respondió HTTP 200 |
| `GET /api/v1/categorias` en el backend | Respondió HTTP 200 con registros |
| `GET /api/v1/clientes` en el backend | Respondió HTTP 200; no hay clientes registrados |
| Llamada a categorías mediante el proxy del frontend | Respondió HTTP 200 |
| Pantalla de Categorías | Renderizó los registros devueltos por la API |
| Pantalla de Clientes | Renderizó la tabla vacía con el mensaje correspondiente |
| Edición de categoría | Cargó los datos del registro desde la API |
| Validación local de categoría corta | «An» mostró el error y permaneció en el formulario |
| Ruta desconocida `/xyz` | Mostró «404 · Página no encontrada» |
| Suite unitaria (`npm test -- --watch=false`) | 2 pruebas aprobadas |

No se crearon, editaron ni eliminaron registros durante estas comprobaciones.
Por ello, los casos de escritura (POST/PUT/DELETE), duplicados y conflictos
requieren ejecutarse con datos de prueba autorizados antes de marcarse como
verificados.

## Evidencia y control de versiones

La guía solicita capturas de sus doce pruebas funcionales y una rama de trabajo
con al menos cuatro commits convencionales. Este informe no sustituye esas
capturas: no se inventó evidencia de operaciones que no se ejecutaron. Tampoco se
crearon commits ni se cambió de rama durante esta implementación.
