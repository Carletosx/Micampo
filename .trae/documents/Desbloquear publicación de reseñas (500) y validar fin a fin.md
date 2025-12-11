## Causa probable
- La BD rechaza insertar reseña sin sesión: `autor_auth_id` tiene NOT NULL → MySQL lanza “Column 'autor_auth_id' cannot be null” y ves 500.
- Alternativamente, el mapeo de la entidad `ResenaProducto` podría no coincidir con la columna `producto_id`, provocando otro 500 en insert.

## Plan de corrección
### 1) Migración SQL obligatoria
- Ejecutar en MySQL de productos:
  - `ALTER TABLE resenas_producto MODIFY autor_auth_id BIGINT NULL;`
- Confirmar que existe: `autor_nombre VARCHAR(120)` (si falta: ejecutar `ALTER TABLE resenas_producto ADD COLUMN autor_nombre VARCHAR(120) NULL AFTER autor_auth_id;`).

### 2) Verificación de mapeo entidad
- Asegurar que `ResenaProducto.productoId` esté mapeado a la columna real (`producto_id`): si tu tabla usa snake_case, añadir `@Column(name="producto_id")` en la entidad.
- Confirmar nombres de columnas de reseñas: `autor_auth_id`, `autor_nombre`, `calificacion`, `comentario`, `creado_en`.

### 3) Validación de cabeceras del gateway
- Revisar logs del `POST /api/products/{id}/resenas`: ver `authId`/`authName` (ya se añadió log en el controlador).
- Si hay sesión, `X-Auth-Id` y `X-Auth-Name` deben llegar; si no hay sesión, se guarda `autor_nombre` del body y `autor_auth_id` NULL.

### 4) Frontend (confirmaciones)
- Con sesión: enviar `{calificacion, comentario}` (ya está). Sin sesión: enviar `{calificacion, comentario, autorNombre}`; si vacío → “Invitado”.
- Tras `res.ok`, recargar reseñas, actualizar promedio y contador `RESEÑAS (N)`.

### 5) Vista del agricultor
- Usar `GET /api/products/resenas/by-vendedor/{authUsuarioId}` (ya cableado) para listar reseñas; con sesión `user.id`, sin sesión `?vendedor=AUTH_ID`.

## Validación fin a fin
1. Ejecutar migración SQL y reiniciar productos-servicio.
2. Probar reseña con sesión: debe guardar tu nombre, sin 500.
3. Probar reseña sin sesión: debe guardar “Invitado” (o nombre ingresado) y `autor_auth_id = NULL`.
4. Abrir `agricultor/resenas`: listar reseñas propias.

¿Procedo a aplicar estos ajustes (SQL y mapeo de entidad si corresponde) y verificar con pruebas guiadas?