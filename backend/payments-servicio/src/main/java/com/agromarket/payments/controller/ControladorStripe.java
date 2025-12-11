package com.agromarket.payments.controller;

import com.agromarket.payments.domain.PasarelaPago;
import com.agromarket.payments.dto.SolicitudCrearPago;
import com.agromarket.payments.service.ServicioPagos;
import com.agromarket.payments.repository.RepositorioPago;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("")
public class ControladorStripe {
  private static final Logger log = LoggerFactory.getLogger(ControladorStripe.class);
  @Value("${stripe.secret:}")
  private String stripeSecret;
  @Value("${stripe.webhookSecret:}")
  private String webhookSecret;

  private final ServicioPagos servicioPagos;
  private final RepositorioPago repoPago;
  public ControladorStripe(ServicioPagos servicioPagos, RepositorioPago repoPago) { this.servicioPagos = servicioPagos; this.repoPago = repoPago; }

  @PostMapping("/intents")
  public ResponseEntity<Map<String, Object>> crearIntent(@RequestBody Map<String, Object> body) throws StripeException {
    if (stripeSecret == null || stripeSecret.isBlank()) {
      log.error("Stripe secret no configurado");
      return ResponseEntity.status(500).body(Map.of("error", "stripe_no_configurado"));
    }
    Stripe.apiKey = stripeSecret;
    long amount = ((Number) body.getOrDefault("amount", 0)).longValue();
    String currency = String.valueOf(body.getOrDefault("currency", "pen"));
    Long pedidoId = null; try { pedidoId = ((Number) body.getOrDefault("pedidoId", null)).longValue(); } catch (Exception ignored) {}
    log.info("Creando PaymentIntent amount={}, currency={}, pedidoId={}", amount, currency, pedidoId);
    PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
      .setAmount(amount)
      .setCurrency(currency)
      .setAutomaticPaymentMethods(PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build())
      .putMetadata("pedidoId", pedidoId != null ? String.valueOf(pedidoId) : "")
      .build();
    PaymentIntent intent;
    try {
      intent = PaymentIntent.create(params);
    } catch (StripeException e) {
      log.error("Error creando PaymentIntent: {}", e.getMessage());
      throw e;
    }
    if (pedidoId != null) {
      SolicitudCrearPago req = new SolicitudCrearPago();
      req.setPedidoId(pedidoId);
      req.setMonto(BigDecimal.valueOf(amount).movePointLeft(2));
      req.setMoneda(currency);
      req.setTipo("TARJETA");
      req.setPasarela("STRIPE");
      var creado = servicioPagos.crear(req);
      creado.setTransaccionId(intent.getId());
      repoPago.save(creado);
    }
    log.info("PaymentIntent creado intentId={}", intent.getId());
    return ResponseEntity.ok(Map.of("clientSecret", intent.getClientSecret(), "intentId", intent.getId()));
  }

  @PostMapping("/webhook")
  public ResponseEntity<String> webhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sig) {
    if (webhookSecret == null || webhookSecret.isBlank()) {
      log.error("Webhook secret no configurado");
      return ResponseEntity.status(500).body("webhook_no_configurado");
    }
    try {
      Event event = Webhook.constructEvent(payload, sig, webhookSecret);
      if ("payment_intent.succeeded".equals(event.getType())) {
        EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
        PaymentIntent pi = (PaymentIntent) deserializer.getObject().orElse(null);
        if (pi != null) servicioPagos.marcarAprobadoPorTransaccion(pi.getId());
      } else if ("payment_intent.payment_failed".equals(event.getType())) {
        EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
        PaymentIntent pi = (PaymentIntent) deserializer.getObject().orElse(null);
        if (pi != null) servicioPagos.marcarFallidoPorTransaccion(pi.getId(), "failed");
      }
      return ResponseEntity.ok("ok");
    } catch (SignatureVerificationException e) {
      log.error("Firma inválida en webhook: {}", e.getMessage());
      return ResponseEntity.status(400).body("firma_invalida");
    } catch (Exception e) {
      log.error("Error procesando webhook: {}", e.getMessage());
      return ResponseEntity.status(500).body("error");
    }
  }
}
