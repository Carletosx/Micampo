## Problemas detectados
- En ProductDetailPage, el handler ENVIAR usa `const r` dentro de bloques y luego chequea `r.ok` fuera del bloque, causando error y bloqueando el envío.
- La vista del agricultor `agricultor/resenas` depende de listar productos y filtrar por `vendedorAuthId`; si los productos antiguos no tienen ese vínculo, se queda vacía.
- El 404 de `GET /users/public/perfil/by-auth/{id}` es un fallback y no debe impedir publicar ni renderizar; se debe manejar silenciosamente.

## Cambios propuestos (Frontend)
1. ProductDetailPage: corregir el handler de ENVIAR
   - Usar una sola variable `let res` fuera de los bloques, asignarla dentro según haya sesión.
   - Si hay sesión: enviar `{calificacion, comentario}` y dejar que backend tome `autorNombre` de cabeceras.
   - Si no hay sesión: enviar `{calificacion, comentario, autorNombre}` (o `'Invitado'`).
   - Sólo si `res.ok` es true, recargar reseñas, actualizar promedio, contador y limpiar formulario.
   - El enriquecimiento con perfil público debe ignorar 404 (no bloquear).

2. Agricultor/ResenasProductos: consumir endpoint por vendedor
   - Añadir API `getReviewsBySeller(authUsuarioId)` que llame `GET /api/products/resenas/by-vendedor/{authUsuarioId}`.
   - En la página, si hay sesión usar `user.id` para cargar reseñas; si no hay sesión, permitir `?vendedor=AUTH_ID`.
   - Renderizar la tabla con reseñas devueltas, sin depender de `vendedorAuthId` en productos.

## Cambios propuestos (Backend)
1. Productos-servicio (ya creado): usar cabeceras del gateway en reseñas
   - `POST /productos/{id}/resenas` lee `X-Auth-Id` y `X-Auth-Name` y prioriza esas sobre el body.
   - DTO hace `autorAuthId` opcional.
   - Endpoint `GET /resenas/by-vendedor/{authUsuarioId}` se usa para la vista del agricultor.

2. Gateway (ya activo)
   - Inyectar `X-Auth-Name` desde el claim del JWT.
   - Mantener libre `POST /api/products/{id}/resenas` y lecturas públicas.

## Verificación
- Publicar reseña con sesión y sin sesión; confirmar que `autor_nombre` queda correcto y que el frontend muestra el nombre sin 404.
- Navegar a `http://localhost:5173/agricultor/resenas` (con sesión) o `...?vendedor=AUTH_ID` (sin sesión) y ver reseñas listadas.

¿Procedo a aplicar estos cambios en frontend (handler ENVIAR y vista del agricultor) y agregar el método API para reseñas por vendedor?