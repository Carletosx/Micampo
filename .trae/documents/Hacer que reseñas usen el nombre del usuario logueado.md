## Problema
El log muestra `authId=null, authName=null` al crear reseña: el gateway está bypasseando el endpoint de reseñas y no inyecta cabeceras aunque haya token. Además, el frontend no envía `Authorization` en `createReview`.

## Cambios en Gateway
1. Ajustar `JwtAuthFilter` para `/api/products/*/resenas`:
   - Si hay `Authorization: Bearer ...`, parsear el JWT e inyectar `X-Auth-Id`, `X-Auth-Name` y dejar pasar.
   - Si NO hay `Authorization`, dejar pasar como invitado (sin inyección) y sin 401.
   - Evitar el bypass incondicional actual para reseñas.

## Cambios en Frontend
1. Modificar `createReview` en `frontend/src/api/reviews.js`:
   - Cuando hay sesión, añadir cabecera `Authorization: Bearer <accessToken>` leyendo de `sessionStorage`/`localStorage`.
   - Con sesión: payload solo `{calificacion, comentario}`.
   - Sin sesión: payload `{calificacion, comentario, autorNombre}` (o "Invitado" si está vacío).
2. Mantener la lógica existente en `ProductDetailPage` para refrescar promedio y contador.

## BD (confirmación)
1. Confirmar que `resenas_producto.autor_auth_id` permite `NULL`:
   - `ALTER TABLE resenas_producto MODIFY autor_auth_id BIGINT NULL;`
2. Confirmar `autor_nombre` existe: si falta, crearla.

## Verificación
1. Logueado: publicar reseña → en DB `autor_nombre` = nombre del usuario, `autor_auth_id` = id; el log `authId/authName` no debe ser `null`.
2. Invitado: publicar reseña → `autor_nombre = 'Invitado'` (o nombre ingresado), `autor_auth_id = NULL`.
3. UI del agricultor (`/agricultor/resenas`) debe listar las reseñas del vendedor.

¿Procedo con estos ajustes en gateway y frontend y te dejo instrucciones de verificación paso a paso?