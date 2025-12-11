## Causa del fallo
- El gateway reescribe `GET/POST /api/products/**` a `/productos/**` (`backend/gateway-servicio/src/main/resources/application.yml:44-49`).
- Los controladores de reseñas en `productos-servicio` están mapeados a `/products/...` en lugar de `/productos/...`:
  - `backend/productos-servicio/src/main/java/com/agromarket/productos/controller/ControladorResenas.java:14` → `@RequestMapping("/products/{productoId}/resenas")`
  - `backend/productos-servicio/src/main/java/com/agromarket/productos/controller/ControladorResenasAdmin.java:11` → `@RequestMapping("/products/resenas")`
- Resultado: el gateway envía las peticiones a `/productos/products/...` y el servicio responde 404. El frontend usa rutas `/api/products/...` correctas (por ejemplo `frontend/src/api/reviews.js:4,22,28,37,46`).
- El filtro JWT (`backend/gateway-servicio/src/main/java/com/agromarket/gateway/filter/JwtAuthFilter.java:26-57`) ya contempla endpoints de reseñas bajo `/api/products/.../resenas`, por lo que no requiere cambios.

## Plan de corrección
1. Cambiar rutas base en controladores de reseñas:
   - `ControladorResenas.java` → `@RequestMapping("/productos/{productoId}/resenas")`.
   - `ControladorResenasAdmin.java` → `@RequestMapping("/productos/resenas")`.
2. Mantener la lógica actual del `JwtAuthFilter` (permite invitado en reseñas; si hay `Authorization`, inyecta `X-Auth-*`).
3. Reiniciar `productos-servicio` y verificar que los endpoints existan:
   - `GET /api/products/{id}/resenas` → lista reseñas.
   - `POST /api/products/{id}/resenas` (con y sin token) → crea reseña.
   - `GET /api/products/resenas/by-vendedor/{authUsuarioId}` → lista por vendedor.
   - `PUT /api/products/resenas/{resenaId}` (con token del autor/vendedor) → actualiza.
   - `DELETE /api/products/resenas/{resenaId}` (con token del autor/vendedor) → elimina.
4. Validación en frontend:
   - En `ProductDetailPage` comprobar que crear/listar reseñas funciona (usa `frontend/src/api/reviews.js`).
   - En `agricultor/ResenasProductos.jsx` validar que la vista carga `listReviewsBySeller` sin 404.
5. (Opcional) Añadir logs de acceso a rutas y pruebas con `curl`/Postman para confirmar mapeo.

## Entregables
- Dos cambios de anotación en controladores.
- Verificación de endpoints sin 404.
- Comprobación funcional en las dos vistas afectadas.

¿Confirmas que aplique estos cambios en `productos-servicio` y haga la verificación completa?