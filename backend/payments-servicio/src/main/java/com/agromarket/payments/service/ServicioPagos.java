package com.agromarket.payments.service;

import com.agromarket.payments.domain.*;
import com.agromarket.payments.dto.*;
import com.agromarket.payments.events.*;
import com.agromarket.payments.repository.*;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.UUID;

@Service
public class ServicioPagos {
  private final RepositorioPago repoPago;
  private final RepositorioMetodoPagoGuardado repoMetodo;
  private final RabbitTemplate rabbitTemplate;
  private final TopicExchange intercambioPago;

  public ServicioPagos(RepositorioPago repoPago, RepositorioMetodoPagoGuardado repoMetodo, RabbitTemplate rabbitTemplate, TopicExchange intercambioPago) {
    this.repoPago = repoPago;
    this.repoMetodo = repoMetodo;
    this.rabbitTemplate = rabbitTemplate;
    this.intercambioPago = intercambioPago;
  }

  @Transactional
  public Pago crear(SolicitudCrearPago req) {
    Pago p = Pago.builder().pedidoId(req.getPedidoId()).monto(req.getMonto()).moneda(req.getMoneda()).tipo(TipoPago.valueOf(req.getTipo())).pasarela(PasarelaPago.valueOf(req.getPasarela())).estado(EstadoPago.PENDIENTE).creadoEn(Instant.now()).build();
    return repoPago.save(p);
  }

  public Pago obtener(Long id) { return repoPago.findById(id).orElseThrow(); }

  @Transactional
  public Pago confirmar(Long id, SolicitudConfirmarPago req) {
    Pago p = obtener(id);
    if (p.getPasarela() == PasarelaPago.SIM) {
      boolean aprobar = req.getAprobar() != null ? req.getAprobar() : true;
      if (aprobar) {
        p.setEstado(EstadoPago.APROBADO);
        p.setTransaccionId("sim-" + UUID.randomUUID());
        repoPago.save(p);
        try {
          PagoAprobadoEvento ev = new PagoAprobadoEvento();
          ev.setIdEvento(UUID.randomUUID().toString());
          ev.setFecha(Instant.now());
          ev.setClaveEnrutamiento(EventosConfig.RK_PAGO_APROBADO);
          ev.setPedidoId(p.getPedidoId());
          ev.setPagoId(p.getId());
          ev.setMonto(p.getMonto().toPlainString());
          rabbitTemplate.convertAndSend(intercambioPago.getName(), EventosConfig.RK_PAGO_APROBADO, ev);
        } catch (Exception ignored) {}
      } else {
        p.setEstado(EstadoPago.FALLIDO);
        repoPago.save(p);
        try {
          PagoFallidoEvento ev = new PagoFallidoEvento();
          ev.setIdEvento(UUID.randomUUID().toString());
          ev.setFecha(Instant.now());
          ev.setClaveEnrutamiento(EventosConfig.RK_PAGO_FALLIDO);
          ev.setPedidoId(p.getPedidoId());
          ev.setPagoId(p.getId());
          ev.setMotivo("simulado");
          rabbitTemplate.convertAndSend(intercambioPago.getName(), EventosConfig.RK_PAGO_FALLIDO, ev);
        } catch (Exception ignored) {}
      }
      return p;
    } else {
      throw new IllegalArgumentException("stripe_no_configurado");
    }
  }

  @Transactional
  public Pago reembolsar(Long id) {
    Pago p = obtener(id);
    if (p.getEstado() != EstadoPago.APROBADO) throw new IllegalArgumentException("pago_no_aprobado");
    p.setEstado(EstadoPago.REEMBOLSADO);
    repoPago.save(p);
    return p;
  }

  public java.util.List<MetodoPagoGuardado> listarMetodos(Long usuarioAuthId) { return repoMetodo.findByUsuarioAuthId(usuarioAuthId); }

  @Transactional
  public MetodoPagoGuardado crearMetodo(SolicitudMetodoPagoGuardado req) {
    MetodoPagoGuardado m = MetodoPagoGuardado.builder().usuarioAuthId(req.getUsuarioAuthId()).token(req.getToken()).last4(req.getLast4()).marca(req.getMarca()).expMonth(req.getExpMonth()).expYear(req.getExpYear()).build();
    return repoMetodo.save(m);
  }

  @Transactional
  public void eliminarMetodo(Long id) { repoMetodo.deleteById(id); }
}

