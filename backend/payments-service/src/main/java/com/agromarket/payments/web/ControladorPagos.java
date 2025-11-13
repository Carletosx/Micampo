package com.agromarket.payments.web;

import com.agromarket.payments.events.EventoBandejaSalida;
import com.agromarket.payments.model.EstadoPago;
import com.agromarket.payments.model.MetodoPagoGuardado;
import com.agromarket.payments.model.Pago;
import com.agromarket.payments.model.TransaccionPasarela;
import com.agromarket.payments.repo.BandejaSalidaRepositorio;
import com.agromarket.payments.repo.MetodoPagoGuardadoRepositorio;
import com.agromarket.payments.repo.PagoRepositorio;
import com.agromarket.payments.repo.TransaccionPasarelaRepositorio;
import com.agromarket.payments.web.dto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/payments")
public class ControladorPagos {

  private final PagoRepositorio pagoRepositorio;
  private final TransaccionPasarelaRepositorio transaccionRepositorio;
  private final MetodoPagoGuardadoRepositorio metodoRepositorio;
  private final BandejaSalidaRepositorio outboxRepositorio;
  private final ObjectMapper mapper;

  public ControladorPagos(PagoRepositorio pagoRepositorio, TransaccionPasarelaRepositorio transaccionRepositorio, MetodoPagoGuardadoRepositorio metodoRepositorio, BandejaSalidaRepositorio outboxRepositorio, ObjectMapper mapper) {
    this.pagoRepositorio = pagoRepositorio;
    this.transaccionRepositorio = transaccionRepositorio;
    this.metodoRepositorio = metodoRepositorio;
    this.outboxRepositorio = outboxRepositorio;
    this.mapper = mapper;
  }

  @PostMapping("/stripe/intent")
  public ResponseEntity<Map<String, Object>> crearStripeIntent(@Valid @RequestBody SolicitudStripeIntent req) {
    Pago pago = new Pago();
    pago.setMonto(req.monto());
    pago.setMoneda(req.moneda());
    pago.setPasarela("STRIPE");
    pago = pagoRepositorio.save(pago);
    TransaccionPasarela tx = new TransaccionPasarela();
    tx.setPago(pago);
    tx.setPasarela("STRIPE");
    tx.setEstado("INTENT_CREATED");
    tx.setReferenciaExterna("pi_" + UUID.randomUUID());
    transaccionRepositorio.save(tx);
    return ResponseEntity.ok(Map.of(
        "pagoId", pago.getId(),
        "client_secret", "cs_test_" + UUID.randomUUID(),
        "intent_id", tx.getReferenciaExterna()
    ));
  }

  @PostMapping("/confirm")
  public ResponseEntity<Pago> confirmarPago(@Valid @RequestBody SolicitudConfirmarPago req) throws Exception {
    return pagoRepositorio.findById(req.pagoId()).map(pago -> {
      pago.setPasarela(req.pasarela());
      pago.setEstado(req.aprobar() ? EstadoPago.APROBADO : EstadoPago.FALLIDO);
      pagoRepositorio.save(pago);
      TransaccionPasarela tx = new TransaccionPasarela();
      tx.setPago(pago);
      tx.setPasarela(req.pasarela());
      tx.setEstado(req.aprobar() ? "APPROVED" : "FAILED");
      tx.setReferenciaExterna("tx_" + UUID.randomUUID());
      transaccionRepositorio.save(tx);
      try {
        EventoBandejaSalida out = new EventoBandejaSalida();
        out.setType(req.aprobar() ? "payment.approved" : "payment.failed");
        out.setRoutingKey(req.aprobar() ? "payment.approved" : "payment.failed");
        out.setPayload(mapper.writeValueAsString(Map.of(
            "pagoId", pago.getId().toString(),
            "monto", pago.getMonto(),
            "moneda", pago.getMoneda(),
            "pasarela", pago.getPasarela()
        )));
        outboxRepositorio.save(out);
      } catch (Exception ignored) {}
      return ResponseEntity.ok(pago);
    }).orElse(ResponseEntity.status(404).<Pago>build());
  }

  @PostMapping("/yape/simulate")
  public ResponseEntity<Pago> simularYape(@Valid @RequestBody SolicitudYapeSimulacion req, @RequestHeader("X-Usuario-Email") String email) {
    Pago pago = new Pago();
    pago.setMonto(req.monto());
    pago.setMoneda("PEN");
    pago.setPasarela("YAPE");
    pago.setEstado(EstadoPago.APROBADO);
    pago = pagoRepositorio.save(pago);
    TransaccionPasarela tx = new TransaccionPasarela();
    tx.setPago(pago);
    tx.setPasarela("YAPE");
    tx.setEstado("APPROVED");
    tx.setReferenciaExterna("yape_" + UUID.randomUUID());
    transaccionRepositorio.save(tx);
    try {
      EventoBandejaSalida out = new EventoBandejaSalida();
      out.setType("payment.approved");
      out.setRoutingKey("payment.approved");
      out.setPayload(mapper.writeValueAsString(Map.of(
          "pagoId", pago.getId().toString(),
          "monto", pago.getMonto(),
          "moneda", pago.getMoneda(),
          "pasarela", pago.getPasarela()
      )));
      outboxRepositorio.save(out);
    } catch (Exception ignored) {}
    return ResponseEntity.ok(pago);
  }

  @GetMapping("/methods")
  public ResponseEntity<List<MetodoPagoGuardado>> listarMetodos(@RequestHeader("X-Usuario-Email") String email) {
    return ResponseEntity.ok(metodoRepositorio.findByEmailUsuario(email));
  }

  @PostMapping("/methods")
  public ResponseEntity<MetodoPagoGuardado> guardarMetodo(@RequestHeader("X-Usuario-Email") String email, @Valid @RequestBody SolicitudMetodoGuardado req) {
    MetodoPagoGuardado m = new MetodoPagoGuardado();
    m.setEmailUsuario(email);
    m.setMarca(req.marca());
    m.setUltimos4(req.ultimos4());
    m.setTokenizado(req.tokenizado());
    return ResponseEntity.ok(metodoRepositorio.save(m));
  }

  @PostMapping("/refunds")
  public ResponseEntity<Pago> reembolsar(@Valid @RequestBody SolicitudReembolso req) {
    return pagoRepositorio.findById(req.pagoId()).map(p -> {
      p.setEstado(EstadoPago.REEMBOLSADO);
      pagoRepositorio.save(p);
      TransaccionPasarela tx = new TransaccionPasarela();
      tx.setPago(p);
      tx.setPasarela(p.getPasarela());
      tx.setEstado("REFUNDED");
      tx.setReferenciaExterna("rf_" + UUID.randomUUID());
      transaccionRepositorio.save(tx);
      return ResponseEntity.ok(p);
    }).orElse(ResponseEntity.status(404).<Pago>build());
  }

  @PostMapping("/webhooks/stripe")
  public ResponseEntity<Void> webhookStripe(@RequestBody String payload) {
    return ResponseEntity.ok().build();
  }
}
