## Objetivo
Llenar `autor_nombre` automáticamente al crear reseñas tomando el nombre del usuario autenticado, y evitar dependencias en consultas públicas cuando ya hay sesión.

## Cambios en Gateway
1. Añadir cabecera `X-Auth-Name` en el filtro global leyendo el claim `nombre` del JWT, junto con `X-Auth-Email`, `X-Auth-Rol`, `X-Auth-Id`.
2. Mantener libre `POST /api/products/{id}/resenas` para pilotos, pero cuando hay token, el gateway debe inyectar las cabeceras `X-Auth-*`.

## Backend productos-servicio
1. Controlador de reseñas (`POST /productos/{productoId}/resenas`): leer cabeceras `X-Auth-Id` (Long) y `X-Auth-Name` (String).
2. Servicio de reseñas:
   - Si `X-Auth-Id` está presente, setear `autorAuthId` y `autorNombre = X-Auth-Name`.
   - Si no hay `X-Auth-Id`, usar `req.autorNombre` (campo opcional) o `'Invitado'` por defecto.
   - Guardar `autor_nombre` y devolverlo en la respuesta.
3. DTO `SolicitudCrearResena`: `autorNombre` opcional, `autorAuthId` opcional; el backend prioriza cabeceras sobre request.

## Backend usuarios-servicio (opcional)
1. Mantener `GET /users/public/perfil/by-auth/{id}` con auto-provisión para casos sin sesión; será un fallback, ya no imprescindible si hay auth.

## Frontend
1. `createReview(productId, payload)`:
   - Si hay sesión, no enviar `autorNombre/autorAuthId`; el backend lo tomará de cabeceras.
   - Si no hay sesión, pedir “Tu nombre” y enviarlo en `autorNombre`; si vacío, enviar `'Invitado'`.
2. `ProductDetailPage`:
   - Al listar, mostrar directamente `autorNombre` recibido del backend.
   - El contador `RESEÑAS (N)` ya usa `reviews.length`.
   - El enriquecimiento con perfil público queda como fallback sólo cuando `autorNombre` venga vacío y exista `autorAuthId`.

## Verificación
1. Sesión activa: crear reseña y confirmar que en DB `autor_nombre` coincide con `displayName` del JWT.
2. Sin sesión: crear reseña y confirmar que `autor_nombre` = nombre ingresado o `'Invitado'` si está vacío.
3. Detalle del producto: ver `autorNombre` correcto sin 404s.

¿Procedo con estos cambios en gateway, backend de productos y frontend según lo descrito?