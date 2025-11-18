# ORGANIC Agromarket

Marketplace agrícola que conecta agricultores con compradores, construido con React + Vite + Tailwind CSS. Incluye panel para Agricultor (gestión de productos, pedidos, inventario, reportes y perfil) y vistas para Comprador (catálogo, carrito, favoritos), además de autenticación básica.

## Características Principales
- Panel del Agricultor con navegación: `Inicio`, `Mis Productos`, `Pedidos`, `Reportes`, `Inventario`.
- Perfil y Configuración del Agricultor con secciones modulares:
  - Información Personal (modo lectura/edición, validaciones)
  - Información de la Finca (modo lectura/edición, validaciones)
  - Métodos de Pago (predeterminado/eliminar, placeholder de alta)
  - Notificaciones (toggles de preferencias)
  - Seguridad (2FA, sesiones activas, cambiar contraseña, eliminar cuenta)
- Interacciones y feedback con notificaciones (`react-toastify`) a través de `NotificationContext`.
- Diseño responsive con Tailwind CSS y componentes accesibles.
- Enrutamiento con `react-router-dom` y deep-linking en Perfil mediante `?tab=`.

## Estructura del Proyecto
```
src/
  App.jsx
  components/
    layout/
      NavbarAgricultor.jsx   // Nav del panel Agricultor (avatar y notificaciones enlazadas al Perfil)
    notifications/
      ToastContainer.jsx     // Contenedor de toasts
    perfil/
      EncabezadoPerfil.jsx
      SidebarPerfil.jsx
      SeccionInformacionPersonal.jsx
      SeccionInformacionFinca.jsx
      SeccionMetodosPago.jsx
      SeccionNotificaciones.jsx
      SeccionSeguridad.jsx
      ModalCambiarFoto.jsx
      ModalCambiarContrasena.jsx
  contexts/
    NotificationContext.jsx  // API: showSuccess, showError, showInfo
    CartContext.jsx
    FavoritesContext.jsx
    AuthContext.jsx
  pages/
    agricultor/
      PerfilConfiguracion.jsx
      DashboardAgricultor.jsx (si aplica)
      GestionInventario.jsx (si aplica)
      MisProductos.jsx (si aplica)
      GestionPedidos.jsx (si aplica)
      ReportesEstadisticas.jsx (si aplica)
```

## Rutas y Navegación
- Ruta del Perfil del Agricultor: `GET /agricultor/perfil` (registrada en `src/App.jsx`).
- En `NavbarAgricultor.jsx`:
  - El bloque de usuario (nombre/rol/avatar) navega a `'/agricultor/perfil'`.
  - El ícono de notificaciones navega a `'/agricultor/perfil?tab=notificaciones'`.
- En `PerfilConfiguracion.jsx` se lee `?tab` (`personal`, `pagos`, `notificaciones`, `seguridad`) para activar la pestaña inicial.

## Requisitos
- Node.js >= 18 (recomendado 18.x o 20.x)
- npm >= 9

## Instalación
1. Clonar el repositorio (o descargar el código).
2. Instalar dependencias del proyecto:
   ```bash
   npm install
   ```
3. (Opcional) Instalación explícita de librerías necesarias si inicias desde cero:
   - Dependencias de aplicación:
     ```bash
     npm i react react-dom react-router-dom react-icons axios react-toastify
     ```
   - Herramientas de desarrollo (Vite + React):
     ```bash
     npm i -D vite @vitejs/plugin-react
     ```
   - Estilos (Tailwind CSS + PostCSS + Autoprefixer):
     ```bash
     npm i -D tailwindcss postcss autoprefixer
     npx tailwindcss init -p
     ```
   - Linter y plugins:
     ```bash
     npm i -D eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals
     ```
   - Tipos (si usas TypeScript o necesitas IntelliSense mejorado):
     ```bash
     npm i -D @types/react @types/react-dom
     ```

## Scripts
- Desarrollo: 
  ```bash
  npm run dev
  ```
- Lint:
  ```bash
  npm run lint
  ```
- Build de producción:
  ```bash
  npm run build
  ```
- Previsualización del build:
  ```bash
  npm run preview
  ```

## Librerías y Versiones
Dependencias:
- `react` ^19.1.1, `react-dom` ^19.1.1
- `react-router-dom` ^7.9.4
- `react-icons` ^5.5.0
- `react-toastify` ^11.0.5
- `axios` ^1.12.2

DevDependencies:
- `vite` ^7.1.7, `@vitejs/plugin-react` ^5.0.4
- `tailwindcss` ^3.4.18, `postcss` ^8.5.6, `autoprefixer` ^10.4.21
- `eslint` ^9.36.0, `@eslint/js` ^9.36.0, `eslint-plugin-react-hooks` ^5.2.0, `eslint-plugin-react-refresh` ^0.4.22
- Tipos: `@types/react`, `@types/react-dom`

## Configuración de Tailwind CSS
- Tailwind está configurado en `tailwind.config.js` y `postcss.config.js`.
- Asegúrate de que `src/index.css` importe:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

## Contextos y Notificaciones
- Envolver la aplicación con el `NotificationProvider` (si no está ya en `main.jsx`):
  - API: `showSuccess(message)`, `showError(message)`, `showInfo(message)`.
- `ToastContainerCustom` debe estar montado (se incluye en páginas como Perfil).

## Cómo Probar el Perfil
- Navega a `http://localhost:5173/agricultor/dashboard` (o cualquier vista del Agricultor).
- Clic en el bloque de usuario del navbar para acceder a `'/agricultor/perfil'`.
- Clic en el ícono de notificaciones para abrir `'/agricultor/perfil?tab=notificaciones'`.
- En la pestaña “Personal”, alterna edición/lectura y valida las restricciones de campos.

## Variables de Entorno (futuras integraciones)
- Para integrar APIs agrega un `.env` con, por ejemplo:
  ```env
  VITE_API_URL=https://api.midominio.com
  ```
- Usar `import.meta.env.VITE_API_URL` en servicios con `axios`.

## Buenas Prácticas
- Mantener estilos con Tailwind y componentes modulares en `src/components/perfil`.
- Validar datos en formularios y mostrar feedback con el `NotificationContext`.
- Evitar cambios globales de estilos fuera de Tailwind.

## Despliegue
- Genera el build:
  ```bash
  npm run build
  ```
- Sirve el contenido de `dist/` en tu hosting estático o detrás de un servidor (Nginx/Apache).

## Contribución
- Ejecuta `npm run lint` antes de subir cambios.
- Sigue el estilo de código existente y evita cambios no relacionados.

## Licencia
Proyecto académico/educativo. No se incluye licencia específica; agrega una si tu caso de uso lo requiere.

## Backend (Microservicios)
- Lenguaje: `Java 17`, Framework: `Spring Boot 3.x`, ORM: `JPA (Hibernate)`, Base de datos: `MySQL`, Mensajería: `RabbitMQ`, Seguridad: `JWT`.
- Arquitectura: `Database per Service` + `API Gateway` + `Event-Driven` con Outbox.

### Servicios y Puertos
- `API Gateway` `8080`
- `Auth` `8081`
- `Users` `8082`
- `Products` `8083`
- `Orders` `8084`
- `Payments` `8085`
- `Inventory` `8086`
- `Notifications` `8087`

### Prerrequisitos Backend
- `Java 17` y `Maven 3.9+`
- `MySQL` y `RabbitMQ` (local o Docker)
- Opcional: `Docker` para levantar MySQL y RabbitMQ rápidamente

### Inicialización de Bases de Datos
- Importa los SQL por servicio:
  - `backend/sql/auth_db.sql`
  - `backend/sql/users_db.sql`
  - `backend/sql/products_db.sql`
  - `backend/sql/orders_db.sql`
  - `backend/sql/payments_db.sql`
  - `backend/sql/inventory_db.sql`
  - `backend/sql/notifications_db.sql`

### Variables de Entorno (ejemplos)
- Comunes:
  - `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
  - `RABBIT_HOST`, `RABBIT_PORT`, `RABBIT_USER`, `RABBIT_PASS`
- Auth y Gateway:
  - `JWT_SECRET` (Base64, longitud ≥256 bits)
- Exchanges (opcionales para personalizar):
  - `USERS_EXCHANGE`, `PRODUCTS_EXCHANGE`, `INVENTORY_EXCHANGE`, `ORDERS_EXCHANGE`, `PAYMENTS_EXCHANGE`

### Comandos Útiles
- Verificar instalación:
  - `mvn -version`
  - `java -version`
- Construir un servicio (ejemplo Auth):
  - `mvn -f backend/auth-service/pom.xml -DskipTests package`
- Ejecutar un servicio (ejemplo Auth):
  - `mvn -f backend/auth-service/pom.xml spring-boot:run`
- Docker (opcional):
  - MySQL: `docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 mysql:8`
  - RabbitMQ: `docker run -d --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management`

### Arranque con Docker Compose
- Requisitos: `.env` en cada microservicio, `Docker Desktop` en ejecución.
- Arrancar todo:
  - `docker compose -f backend/docker-compose.yml up -d --build`
- Orden de inicio controlado en `docker-compose.yml` mediante `depends_on`:
  - MySQL espera a estado `healthy` por `healthcheck`.
  - Los microservicios se encadenan con `condition: service_started`.
  - El `API Gateway` depende de que todos estén iniciados.

### Orden de Arranque Sugerido
- `Auth` → `Users` → `Products` → `Inventory` → `Orders` → `Payments` → `Notifications` → `API Gateway`

### Flujo End-to-End (resumen)
- Registro/Login en `Auth` → token JWT
- Crear producto en `Products` → evento `product.created`
- Inventario inicial en `Inventory` (consume evento) → gestionar stock
- Crear pedido en `Orders` → `order.created`
- Confirmar pedido → `order.confirmed`
- Pagar en `Payments` (Stripe/Yape simulado) → `payment.approved`/`payment.failed`
- Notificaciones en `Notifications` (consume `order.*`, `payment.*`, `inventory.stock-low`, `user.registered`)

### Colección Postman
- Ruta: `backend/postman/agromarket.postman_collection.json`
- Variables: `gateway_url` (por defecto `http://localhost:8080`), `accessToken`, `email`
- Contiene pruebas para: `Auth`, `Users`, `Products`, `Inventory`, `Orders`, `Payments`, `Notifications`

### Solución de Problemas
- `JWT_SECRET` débil: usa Base64 ≥256 bits
- Puertos ocupados: ajusta `server.port` en `application.yml`
- RabbitMQ no disponible: eventos quedan en `outbox` y se publican al restaurar la conexión

### Seguridad
- Filtro JWT en Gateway y en Auth (`stateless`)
- `BCrypt` para contraseñas
- No incluir claves en el código; usar variables de entorno
