## Problemas
- No puedes editar/eliminar reseñas.
- 404 en `GET /api/products/resenas/by-vendedor/{id}` al cargar `http://localhost:5173/agricultor/resenas`.

## Corrección de rutas (404)
- Alinear el backend con la ruta que consume el frontend:
  - Añadir endpoint en productos-servicio: `GET /products/resenas/by-vendedor/{authUsuarioId}` (prefijo `/products`), retornando reseñas del vendedor.
  - Verificar que el gateway rote `/api/products/**` hacia productos-servicio.

## Endpoints reseñas (editar/eliminar)
- Productos-servicio:
  - `PUT /products/resenas/{resenaId}`: actualizar `calificacion` y `comentario`.
  - `DELETE /products/resenas/{resenaId}`: eliminar reseña.
  - Autorización: solo autor (`X-Auth-Id == autor_auth_id`) puede editar/eliminar; opcionalmente permitir al vendedor del producto eliminar (moderación), verificando que el `vendedorAuthId` del producto coincida con `X-Auth-Id`.

## Gateway
- Permitir `PUT/DELETE /api/products/resenas/**` solo con token (inyectar `X-Auth-Id`, `X-Auth-Name`).
- Mantener `POST` relajado (invitado permitido) y `GET` público.

## Frontend
- API:
  - `updateReview(resenaId, { calificacion, comentario })` (con Authorization).
  - `deleteReview(resenaId)` (con Authorization).
  - Cambiar `listReviewsBySeller` a la nueva ruta `/products/resenas/by-vendedor/{id}`.
- UI comprador (ProductDetailPage):
  - Mostrar acciones editar/eliminar en cada reseña si `user.id === r.autorAuthId`.
  - Al editar, abrir formulario inline, llamar `updateReview` y refrescar lista.
  - Al eliminar, confirmar y llamar `deleteReview`.
- UI agricultor (`ResenasProductos`):
  - Consumir `/products/resenas/by-vendedor/{id}` y renderizar tabla.
  - Permitir eliminar reseñas como moderación si el `user.id` coincide con `vendedorAuthId` del producto asociado.

## BD
- Confirmar que `autor_auth_id` permite `NULL` y que existe `autor_nombre` (ya cubierto).

## Verificación
1. `GET /api/products/resenas/by-vendedor/{id}` responde 200 con reseñas.
2. Comprador logueado: editar/eliminar su reseña; invitado no puede.
3. Agricultor logueado: ver reseñas y borrar (moderación) si son de sus productos.

¿Procedo con estos cambios en backend, gateway y frontend para habilitar edición/elimación y corregir el 404 del listado del agricultor?