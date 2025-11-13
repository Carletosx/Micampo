## Objetivo
- Implementar backend en Java 17 + Spring Boot 3 con microservicios, JWT, RabbitMQ y MySQL.
- Entregar por servicio: endpoints REST, eventos, SQL de tablas, y pruebas básicas.

## Enfoque Arquitectónico
- `Database per Service` con MySQL por microservicio.
- Comunicación síncrona vía REST tras Gateway y asíncrona vía RabbitMQ (event-driven).
- Seguridad con Spring Security + JWT (roles `AGRICULTOR`, `COMPRADOR`).
- Fiabilidad de eventos con patrón Outbox + publicador a RabbitMQ.

## Fases de Implementación
1. Base del proyecto: multi-módulo Maven/Gradle, BOM, dependencias comunes, librería de contratos/eventos.
2. Infra local: Docker Compose para MySQL, RabbitMQ, y servicios básicos.
3. Autenticación y tokens (Auth), luego Gateway con validación.
4. Servicios de negocio (Users → Products → Inventory → Orders → Payments → Notifications).
5. Observabilidad: Actuator, logs estructurados, trazas (OpenTelemetry), métricas.
6. End-to-end básico: registro/login, creación de producto, pedido y pago simulado.

## Orden de Microservicios
- Auth → API Gateway → Users → Products → Inventory → Orders → Payments → Notifications.

## Especificaciones por Microservicio
### API Gateway (8080)
- Enrutamiento centralizado y CORS; validación de JWT en filtros.
- Rate limiting básico por IP y por usuario.
- Rutas: `/auth/**`, `/users/**`, `/products/**`, `/inventory/**`, `/orders/**`, `/payments/**`, `/notifications/**`.

### Auth Service (8081) – DB: `auth_db`
- Endpoints: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/forgot`, `POST /auth/validate`.
- Tablas (SQL): `users` (email, password_hash, role, active, timestamps), `refresh_tokens` (user_id, token, expira, revoked).
- Eventos: `user.registered` (payload con id, email, rol), `user.token-refreshed`.
- Políticas: hash con BCrypt, expiración de access/refresh, bloqueo por intentos.

### Users Service (8082) – DB: `users_db`
- Endpoints: `GET/PUT /profile`, `GET/PUT /farm`, `GET/POST/PUT/DELETE /addresses`, `GET /seller/:id`.
- Tablas (SQL): `agricultor`, `comprador`, `finca_info`, `direccion` con FKs a usuario global (referencia a `auth.users` vía id externo, no FK DB).
- Escucha evento `user.registered` para crear perfil inicial; emite `users.profile-updated`.

### Products Service (8083) – DB: `products_db`
- Endpoints: `CRUD /products`, filtros `GET /products/search`, `GET /categories`, `POST /products/{id}/images`, `POST /products/{id}/reviews`.
- Tablas (SQL): `producto`, `categoria`, `imagen_producto`, `resena_producto`.
- Eventos: `product.created`, `product.updated`; emite a Inventory para stock inicial.

### Inventory Service (8086) – DB: `inventory_db`
- Endpoints: `GET/PUT /inventory/{productId}`, `POST /inventory/reserve`, `POST /inventory/release`, `GET /inventory/movements`.
- Tablas (SQL): `inventario` (stock_actual, minimo, reservado), `movimiento_inventario`, `alerta_inventario`.
- Eventos: `inventory.stock-low`, `inventory.updated`; reacciona a `order.created` y `order.cancelled`.

### Orders Service (8084) – DB: `orders_db`
- Endpoints: `POST /orders`, `GET /orders/{id}`, `GET /orders?state=`, `PUT /orders/{id}/state`.
- Estados: `PENDIENTE → CONFIRMADO → EN_PREPARACION → EN_CAMINO → ENTREGADO`.
- Tablas (SQL): `pedido`, `item_pedido`, `historial_estado`.
- Eventos: `order.created`, `order.confirmed`, `order.status-changed`.

### Payments Service (8085) – DB: `payments_db`
- Endpoints: `POST /payments/stripe/intent`, `POST /payments/yape/simulate`, `POST /refunds`, `GET /methods`, `POST /methods`.
- Tablas (SQL): `pago`, `metodo_pago_guardado`, `transaccion_pasarela`.
- Eventos: `payment.approved`, `payment.failed`; webhooks de Stripe.

### Notifications Service (8087) – DB: `notifications_db`
- Endpoints: `POST /notify/email`, `POST /notify/sms`, `POST /notify/inapp`, `GET /templates`, `POST /templates`.
- Tablas (SQL): `notificacion`, `plantilla_notificacion`.
- Suscribe: `order.*`, `payment.*`, `inventory.stock-low`, `user.registered`.

## Seguridad y Roles
- JWT con claims: `sub`, `roles`, `exp`; refresh tokens persistidos.
- Autorización por rol en endpoints (agricultor gestiona productos/inventario, comprador pedidos).
- Políticas CORS y rate limit en Gateway.

## Eventos y Mensajería
- Contratos comunes: esquema JSON versionado (librería `contracts` compartida).
- Exchanges/queues en RabbitMQ por dominio: `orders.events`, `payments.events`, etc.
- Outbox: tabla `outbox` por servicio y publicador confiable.

## Persistencia y SQL
- Por cada servicio: archivo `.sql` para creación de tablas, índices, FKs internas y constraints.
- Convenciones: `id` UUID/PK auto, `created_at/updated_at`, índices en claves de búsqueda (email, estado, product_id).

## Infraestructura Local
- Docker Compose: `mysql-*` por servicio, `rabbitmq`, `stripe-mock` para pruebas.
- Configuración de perfiles `dev/test/prod` y variables (sin secretos en repo).

## Observabilidad
- Actuator en todos, logs JSON, tracing con OpenTelemetry (propagación b3/w3c), métricas Prometheus.

## Entregables
- Código por servicio, contratos de eventos, Postman/Insomnia colección.
- Archivos SQL por servicio: `auth_db.sql`, `users_db.sql`, `products_db.sql`, `inventory_db.sql`, `orders_db.sql`, `payments_db.sql`, `notifications_db.sql`.
- Guía de ejecución local con Compose.

## Próximo Paso
- Empezar por Auth Service: endpoints, JWT, refresh, SQL de `auth_db`, eventos `user.registered` y pruebas. Tras tu confirmación, procedo a implementarlo y entregar el SQL y el servicio funcionando.