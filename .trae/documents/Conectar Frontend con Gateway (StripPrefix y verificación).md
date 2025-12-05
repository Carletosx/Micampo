## Diagnóstico
- El frontend llama `POST /api/auth/autenticacion/registro` desde `http://localhost:5173`.
- Vite ya está configurado para proxy de `/api/**` → `http://localhost:8080` (gateway).
- En el gateway, la ruta `Path=/api/auth/**` reenvía al `autenticacion-servicio`, pero actualmente no se está eliminando el prefijo `/api/auth`. El upstream recibe `/api/auth/autenticacion/registro` y el controlador del servicio mapea `/autenticacion/**`, provocando 404.
- Los logs de RabbitMQ (“Failed to check/redeclare auto-delete queue(s)”) son independientes del registro; la publicación de eventos es tolerante y no bloquea.

## Cambios en Gateway
- Editar `backend/gateway-servicio/src/main/resources/application.yml` para cada ruta y añadir `filters: - StripPrefix=2`:
  - auth: `Path=/api/auth/**` + `StripPrefix=2` → upstream `/autenticacion/**`.
  - users: `Path=/api/users/**` + `StripPrefix=2` → upstream `/usuarios/**`.
  - products: `Path=/api/products/**` + `StripPrefix=2` → upstream `/productos/**`.
  - orders, payments, inventory, notifications: igual patrón con `StripPrefix=2`.
- Mantener el filtro global JWT como está; recuerda que `/api/auth/**` ya está exento en `JwtAuthFilter`.
- Reiniciar el gateway.

## Verificación
1. Frontend en `http://localhost:5173`: ir a `/auth/register` y enviar formulario (rol `AGRICULTOR` o `COMPRADOR`).
2. Confirmar en la consola del navegador:
   - `POST /api/auth/autenticacion/registro payload: {...}`
   - `Respuesta /registro status: 200` y body con `accessToken`/`refreshToken`.
3. Ver que aparece la notificación de éxito y que se guarda el token en `localStorage`.
4. Validación DB: usuario insertado en `autenticacion-servicio` (tabla `usuarios`).

## Ajustes de Frontend (ya listos)
- Vite proxy de `/api/**` hacia `http://localhost:8080`.
- `AuthContext.jsx` maneja respuestas no-JSON y decodifica JWT para `user.role` y `user.id`.
- `RegisterPage.jsx` y `LoginPage.jsx` muestran notificaciones y detienen el loader según `res.success`.

## Prueba End-to-End
- Levantar `autenticacion-servicio` (8081) y `gateway-servicio` (8080) tras aplicar `StripPrefix`.
- Registrar y luego iniciar sesión desde el frontend; comprobar `Authorization: Bearer` presente en llamadas protegidas.

¿Confirmas que aplique estos cambios en el gateway y reinicie para validar el flujo de registro desde el frontend?