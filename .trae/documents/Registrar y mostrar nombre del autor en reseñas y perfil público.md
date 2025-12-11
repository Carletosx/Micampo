## Objetivo
Asegurar que las reseñas muestren siempre el nombre del usuario y que el endpoint público de perfil devuelva datos, incluso si el perfil extendido aún no existe.

## Cambios en Base de Datos
1. Resenas: Añadir la columna `autor_nombre` en `resenas_producto` para persistir el nombre del autor junto con la reseña.
2. (Opcional) Perfiles: Mantener `nombres` y `apellidos` en `usuarios_perfil`; no añadir nueva columna si ya existen.

## Backend: usuarios-servicio
1. Endpoint público de perfil: modificar `GET /public/perfil/by-auth/{authUsuarioId}` para “auto-provisionar” un perfil si no existe:
   - Hacer una llamada HTTP al autenticacion-servicio `GET /public/usuarios/{id}`.
   - Crear un perfil stub con `auth_usuario_id`, `nombres/apellidos` (o `displayName` dividido) y `email`.
   - Retornar el perfil.
2. Añadir un cliente HTTP (WebClient/RestTemplate) configurado al gateway para consumir `autenticacion-servicio`.

## Backend: autenticacion-servicio
1. Añadir `GET /public/usuarios/{id}` que devuelva `{id, nombre, correo}`.
2. Asegurar que el JWT siga incluyendo `nombre` como claim (sin cambios funcionales).

## Gateway-servicio
1. Permitir libre acceso a `GET /api/auth/public/**` y mantener abiertos `GET /api/users/public/**`.
2. Verificar rutas de mapeo hacia autenticacion-servicio y usuarios-servicio.

## Backend: productos-servicio (reseñas)
1. Ajustar DTO y entidad de reseñas para usar `autor_nombre` (crear/leer).
2. Mantener `autor_auth_id` para trazabilidad, pero preferir `autor_nombre` en las respuestas.

## Frontend
1. En `createReview` enviar `autorNombre`:
   - Si hay sesión: usar `user.displayName`.
   - Sin sesión: usar el campo “Tu nombre”; si vacío, enviar `'Invitado'`.
2. En `ProductDetailPage`:
   - Mostrar `autorNombre` directamente; si falta y se dispone de `autorAuthId`, intentar enriquecer con `GET /api/users/public/perfil/by-auth/{id}`.
   - Actualizar el contador de la pestaña a `RESEÑAS (N)` usando `reviews.length`.
3. Página del agricultor `ResenasProductos`:
   - Leer reseñas de sus productos; si no hay sesión, permitir `?vendedor=AUTH_ID` como parámetro.

## Verificación
1. Enviar reseña sin sesión: debe mostrar el nombre dado o “Invitado”.
2. Enviar reseña con sesión: debe mostrar `displayName` del usuario.
3. Visitar `GET /api/users/public/perfil/by-auth/{id}` para un usuario sin perfil: debe crear y devolver el stub al primer acceso.
4. Página `agricultor/resenas`: debe listar reseñas con autor y calificación.

¿Confirmas que proceda con estos cambios?