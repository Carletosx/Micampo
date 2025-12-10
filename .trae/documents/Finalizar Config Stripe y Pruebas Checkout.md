## Objetivo
Configurar variables de entorno de Stripe, activar el webhook con Stripe CLI, reiniciar servicios, y realizar una prueba end‑to‑end del checkout con tarjeta de prueba para validar la comunicación frontend ↔ gateway ↔ payments-servicio ↔ Stripe.

## Backend (payments-servicio)
1. Variables de entorno (Windows PowerShell):
   - Ejecutar: `setx STRIPE_SECRET "<sk_test...>"`
   - Ejecutar: `setx STRIPE_WEBHOOK_SECRET "<whsec_...>"` (se obtiene con Stripe CLI en el paso siguiente)
2. Reinicio de servicio:
   - Abrir nueva terminal después de `setx` y ejecutar desde `backend/payments-servicio`: `mvn spring-boot:run -DskipTests`
3. Confirmaciones:
   - Verificar que `/api/payments/intents` responde 200 y devuelve `clientSecret`.
   - Verificar que `/api/payments/webhook` recibe eventos desde Stripe CLI.

## Stripe CLI (webhook)
1. Instalar/actualizar Stripe CLI si falta.
2. Logueo: `stripe login`.
3. Escucha del webhook y obtención del secret:
   - Ejecutar: `stripe listen --forward-to http://localhost:8080/api/payments/webhook`
   - Copiar “Your webhook signing secret is whsec_...” y aplicarlo con `setx STRIPE_WEBHOOK_SECRET "whsec_..."`.
   - Reiniciar `payments-servicio` tras aplicar el secret.

## Frontend (checkout)
1. Variables de entorno:
   - Ejecutar: `setx VITE_STRIPE_PUBLIC_KEY "<pk_test...>"`
2. Reinicio de frontend:
   - Nueva terminal: `npm run dev` (o `npm run build && npm run preview`).
3. Prueba de flujo:
   - En `http://localhost:5173/checkout`: seleccionar dirección dinámica, método “Tarjeta”, ingresar `4242 4242 4242 4242`, CVC `123`, fecha futura.
   - Confirmar pago; observar en logs: creación de PaymentIntent y recepción del webhook `payment_intent.succeeded`.
   - Validar que el pedido se crea con `direccionEntregaId` y `metodoPago=TARJETA`.

## Validaciones adicionales
1. Gateway: `/api/payments/**` está configurado (StripPrefix=2); confirmar que `intents` y `webhook` llegan a `payments-servicio`.
2. Estados de pago:
   - Comprobar en DB `payments_db.pagamentos/pagos` que el `Pago` pasa de `PENDIENTE` a `APROBADO` y conserva `transaccionId`.
3. Seguridad:
   - Verificar que claves no están en el repo y sólo en entorno.
   - Confirmar validación de firma del webhook.

## Opcional: vincular pedidoId al PaymentIntent
1. Crear pedido en estado “pendiente” antes del pago; pasar `pedidoId` a `createPaymentIntent` (frontend ya soporta el parámetro).
2. En webhook `succeeded`, cerrar el pedido y marcar el pago aprobado (ya soportado por el servicio de pagos).

## Entregables
- Variables de entorno aplicadas y servicios reiniciados.
- Webhook activo y verificado con tarjeta de prueba.
- Pedido creado dinámicamente con dirección seleccionada y pago aprobado.

¿Confirmas que proceda a ejecutar los comandos de entorno, activar `stripe listen`, reiniciar servicios y correr la prueba end‑to‑end ahora?