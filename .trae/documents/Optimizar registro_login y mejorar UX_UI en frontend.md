## Objetivo
- Reducir la latencia percibida en registro/login.
- Mejorar UX/UI: loaders visibles, toasts de éxito/error, estados deshabilitados y popups.

## Diagnóstico de Latencia (propuesto)
- Medir tiempos de red y de proceso con marcas: inicio/fin de fetch.
- Verificar impacto de publicación de eventos (RabbitMQ) en registro.
- Confirmar que las llamadas pasen por el gateway (`/api`) y que el fallback directo se limite a desarrollo.

## Backend: Rendimiento
- Desactivar eventos en desarrollo si no hay RabbitMQ disponible:
  - Propiedad: `eventos.habilitados=false` para evitar intentos de conexión (ver `backend/autenticacion-servicio/src/main/java/com/agromarket/autenticacion/service/ServicioAutenticacion.java:40-48` y `events/PublicadorEventos.java:21-27`).
- Mantener `BCryptPasswordEncoder` con cost razonable (10). Si la latencia persiste, evaluar cost 8 solo en dev.
- Revisar conexión MySQL y habilitar índices adecuados (ya existe `unique` en `correo` en `domain/Usuario.java:17-24`).

## Gateway
- Mantener CORS global activo para `http://localhost:5173` (ya configurado en `backend/gateway-servicio/src/main/resources/application.yml`).
- Asegurar que frontend use `VITE_API_BASE=/api` como canal principal.

## Frontend: UX/UI y Conexión
- AuthContext (`frontend/src/context/AuthContext.jsx`):
  - Reducir timeout a 8s ahora que backend responde y mantener 1 reintento.
  - Usar `VITE_API_BASE` como base y fallback directo (`VITE_AUTH_DIRECT_BASE`) solo en modo dev.
  - Mapear errores del backend (`mensaje`, `detalles`) y mostrarlos con NotificationContext.
  - Instrumentar tiempos con `performance.now()` y log: `networkTimeMs`, `parseTimeMs`.
- RegisterPage (`frontend/src/pages/auth/RegisterPage.jsx`):
  - Añadir `LoadingOverlay` a pantalla completa mientras `loading` es true.
  - Deshabilitar inputs al enviar y mostrar spinner en el botón.
  - Mostrar toast de éxito y redirección; si `400`, mostrar mensaje “Usuario ya existente” cuando corresponda.
- LoginPage:
  - Igual patrón de loader/spinner y toasts.
- Componentes auxiliares:
  - Crear `components/ui/LoadingOverlay.jsx` (simple backdrop + spinner).
  - Crear `components/ui/ToastPortal.jsx` si se desea un contenedor visual; reutilizar `NotificationContext` existente.

## Métricas y Pruebas
- Console logs con tiempos medidos para registro/login.
- Probar flujo vía gateway (`/api`) y confirmar que no se active el fallback en dev una vez estable.
- Validar comportamientos: éxito, usuario ya registrado, errores de validación, timeouts.

## Entregables
- Cambios en AuthContext con timeout 8s y métricas.
- Loader overlay y estados deshabilitados en Register/Login.
- Toasters de éxito/error consistentes.
- Configuración de `VITE_API_BASE` y manejo de fallback solo en dev.

¿Confirmas que proceda con estos cambios? 