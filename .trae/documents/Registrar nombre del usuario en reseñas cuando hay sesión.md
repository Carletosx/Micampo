## Diagnóstico
- Las reseñas se guardan como “Invitado” porque el `POST /api/products/{id}/resenas` está pasando por el gateway sin inyectar cabeceras `X-Auth-*`.
- En el frontend, `createReview` no envía `Authorization: Bearer <accessToken>`, por lo que aunque estés logueado, el gateway no tiene token para leer el nombre.

## Cambios propuestos
### Gateway
- Ajustar `JwtAuthFilter` para el endpoint de reseñas:
  - Si hay `Authorization` presente, parsear JWT e inyectar `X-Auth-Id` y `X-Auth-Name`.
  - Si no hay `Authorization`, permitir invitados sin forzar 401 (no bloquear), pero no inyectar.
  - Es decir, no “bypasear” por completo reseñas; sólo relajar la autenticación si no hay token.

### Frontend
- Modificar `createReview` en `frontend/src/api/reviews.js` para adjuntar `Authorization` cuando hay sesión:
  - Leer el `accessToken` de `sessionStorage`/`localStorage` y enviar la cabecera.
  - Con sesión: payload sólo `{calificacion, comentario}`.
  - Sin sesión: payload `{calificacion, comentario, autorNombre}`.

### Backend (validación)
- Mantener la lógica actual en `ServicioResenas` que prioriza cabeceras y usa “Invitado” si no hay sesión.
- Confirmar migración DB: `autor_auth_id` debe permitir `NULL` para invitados.

## Verificación
1. Logueado: publicar reseña y confirmar que en la DB `autor_nombre` coincide con tu nombre y `autor_auth_id` con tu ID.
2. Invitado: publicar reseña y confirmar `autor_nombre = 'Invitado'` (o el nombre ingresado) y `autor_auth_id IS NULL`.
3. UI del comprador muestra tu nombre en la reseña; la del agricultor muestra reseñas de sus productos.

¿Procedo con estos cambios en gateway y frontend para que el nombre del usuario logueado se persista automáticamente en reseñas?