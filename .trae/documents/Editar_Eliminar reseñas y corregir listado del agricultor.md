## Objetivo
Habilitar edición/eliminación de reseñas por su autor (y moderación del agricultor), y corregir el 404 en el listado de reseñas del agricultor.

## Backend (productos-servicio)
1. Añadir endpoints:
   - GET `/products/resenas/by-vendedor/{authUsuarioId}`: retorna reseñas de productos cuyo `vendedorAuthId` coincide.
   - PUT `/products/resenas/{resenaId}`: actualiza `calificacion` y `comentario`.
   - DELETE `/products/resenas/{resenaId}`: elimina la reseña.
2. Autorización:
   - Autor: `X-Auth-Id == autor_auth_id` para editar/eliminar.
   - Moderación (opcional): agricultor puede eliminar reseñas si `X-Auth-Id == vendedorAuthId` del producto asociado.
3. Ajustes de entidad (si aplica): mapear `productoId` a `producto_id` con `@Column(name="producto_id")` si tu tabla usa snake_case.

## Gateway-servicio
1. Reseñas:
   - `POST` relajado (invitado), con inyección si hay token.
   - `GET` público.
   - `PUT` y `DELETE` requieren `Authorization`; inyectar `X-Auth-Id`, `X-Auth-Name`.

## Frontend
1. API (`frontend/src/api/reviews.js`):
   - `updateReview(resenaId, { calificacion, comentario })` con `Authorization` si hay sesión.
   - `deleteReview(resenaId)` con `Authorization` si hay sesión.
   - `listReviewsBySeller(authUsuarioId)` consumiendo `/products/resenas/by-vendedor/{id}`.
2. UI comprador (`ProductDetailPage.jsx`):
   - Mostrar botones editar/eliminar si `user.id === r.autorAuthId`.
   - Inline edit con `updateReview` y refresco de promedio/contador.
   - Confirmación y `deleteReview`.
3. UI agricultor (`ResenasProductos.jsx`):
   - Usar `listReviewsBySeller`.
   - Mostrar botón eliminar para moderación si corresponde.

## BD y estabilidad
1. Confirmar migraciones:
   - `autor_auth_id` permite `NULL`.
   - `autor_nombre` existe.
2. (Opcional) Índices en `producto_id`/`autor_auth_id` para rendimiento.

## Verificación
1. Logueado como comprador: editar y eliminar tu reseña; confirmar cambios en la UI y DB.
2. Invitado: no ver acciones de edición/eliminación.
3. Agricultor: ver reseñas en `/agricultor/resenas` y poder moderar si habilitado.
4. El 404 desaparece: `GET /api/products/resenas/by-vendedor/{id}` responde 200.

¿Confirmas que proceda con esta implementación?