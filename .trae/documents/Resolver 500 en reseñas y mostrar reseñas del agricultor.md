## Causa
El 500 viene de la restricción NOT NULL en `resenas_producto.autor_auth_id` (logs: "Column 'autor_auth_id' cannot be null"). Cuando el reviewer no está logueado y el gateway no inyecta `X-Auth-Id`, el backend intenta insertar `NULL` y MySQL lo rechaza.

## Plan de corrección
1. Base de datos
   - Permitir reseñas de invitados relajando la columna:
     - `ALTER TABLE resenas_producto MODIFY autor_auth_id BIGINT NULL;`
     - Mantener `autor_nombre` para el nombre visible ("Invitado" o el nombre que el usuario ingrese).
2. Backend (validación mínima)
   - En `ServicioResenas.crear(...)`, si `authId == null`, persistir `autorAuthId = null` y `autorNombre = (req.autorNombre || 'Invitado')` — ya implementado; solo requiere que la columna permita `NULL`.
   - Añadir logs de depuración al leer `X-Auth-Id`/`X-Auth-Name` para verificar inyección del gateway.
3. Gateway
   - Mantener abierto `POST /api/products/{id}/resenas` para piloto (permitiendo invitados). No bloquear por falta de token; el backend usa el nombre enviado.
   - Mantener `GET` público para productos y usuarios públicos.
4. Frontend
   - En envío con sesión: solo `{calificacion, comentario}`; el backend completará nombre desde `X-Auth-Name`.
   - Sin sesión: enviar `{calificacion, comentario, autorNombre}`. Si el nombre está vacío, usar "Invitado". (Ya aplicado)
5. Vista del agricultor
   - Usar `GET /api/products/resenas/by-vendedor/{authUsuarioId}` para listar reseñas (ya cableado en la página). Validar que la API devuelve items tras existir reseñas.

## Verificación
- Ejecutar el `ALTER TABLE` y reiniciar `productos-servicio`.
- Publicar reseña:
  - Logueado: nombre desde JWT (cabezera `X-Auth-Name`) y `autor_auth_id` con el id del usuario.
  - Invitado: nombre "Invitado" (u otro ingresado) y `autor_auth_id = NULL`.
- Navegar `http://localhost:5173/agricultor/resenas` (con sesión) o `?vendedor=AUTH_ID` (sin sesión) para ver reseñas. ¿Procedo?