# Objetivo
- Crear `gateway-servicio` (puerto 8080) con Spring Cloud Gateway para enrutar peticiones externas hacia los microservicios.
- Validar JWT en el gateway y configurar CORS. Mantener comunicación interna entre microservicios solo vía RabbitMQ (no HTTP entre servicios).

## Rutas del Gateway
- `/api/auth/** → http://localhost:8081`
- `/api/users/** → http://localhost:8082`
- `/api/products/** → http://localhost:8083`
- `/api/orders/** → http://localhost:8084`
- `/api/payments/** → http://localhost:8085`
- `/api/inventory/** → http://localhost:8086`
- `/api/notifications/** → http://localhost:8087`

## Seguridad
- Filtro global de JWT en Gateway (firma HS256) usando `JWT_SECRET` (Base64) desde entorno.
- Permitir libremente `/api/auth/**` y exigir JWT en las demás rutas.
- CORS: permitir origen del frontend React, métodos y headers estándar.

## Implementación
- Nuevo proyecto `backend/gateway-servicio/` con dependencias `spring-cloud-starter-gateway` y `jjwt`.
- `application.yml` con rutas, CORS y puertos.
- `JwtAuthFilter` como `GlobalFilter` + `Ordered` para validar tokens.

## Verificación
- Compilar y levantar gateway.
- Consumir endpoints vía `http://localhost:8080/api/...` con `Authorization: Bearer <token>`.
- Confirmar que no existen llamadas HTTP entre microservicios (solo eventos RabbitMQ ya implementados).

¿Confirmas que proceda con esta implementación del Gateway y ajuste de documentación para el uso de RabbitMQ como única vía de comunicación entre servicios?