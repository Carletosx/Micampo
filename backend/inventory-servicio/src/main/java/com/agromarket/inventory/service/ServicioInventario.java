package com.agromarket.inventory.service;

import com.agromarket.inventory.domain.*;
import com.agromarket.inventory.events.EventosConfig;
import com.agromarket.inventory.events.StockBajoEvento;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import com.agromarket.inventory.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ServicioInventario {
  private final RepositorioInventario repoInv;
  private final RepositorioMovimientoInventario repoMov;
  private final RepositorioAlertaInventario repoAlert;
  private final RabbitTemplate rabbitTemplate;
  private final TopicExchange intercambioInventario;

  public ServicioInventario(RepositorioInventario repoInv, RepositorioMovimientoInventario repoMov, RepositorioAlertaInventario repoAlert, RabbitTemplate rabbitTemplate, TopicExchange intercambioInventario) {
    this.repoInv = repoInv;
    this.repoMov = repoMov;
    this.repoAlert = repoAlert;
    this.rabbitTemplate = rabbitTemplate;
    this.intercambioInventario = intercambioInventario;
  }

  public Inventario obtener(Long productoId) { return repoInv.findByProductoId(productoId).orElseThrow(); }

  @Transactional
  public Inventario crearSiNoExiste(Long productoId, Integer stockInicial) {
    return repoInv.findByProductoId(productoId).orElseGet(() -> repoInv.save(Inventario.builder().productoId(productoId).stockActual(stockInicial == null ? 0 : stockInicial).stockMinimo(5).stockReservado(0).actualizadoEn(Instant.now()).build()));
  }

  @Transactional
  public Inventario actualizar(Long productoId, Integer stockMinimo, Integer stockActual) {
    Inventario inv = obtener(productoId);
    if (stockMinimo != null) { if (stockMinimo < 0) throw new IllegalArgumentException("stockMinimo invalido"); inv.setStockMinimo(stockMinimo); }
    if (stockActual != null) { if (stockActual < 0) throw new IllegalArgumentException("stockActual invalido"); inv.setStockActual(stockActual); }
    inv.setActualizadoEn(Instant.now());
    Inventario saved = repoInv.save(inv);
    verificarAlertas(saved);
    return saved;
  }

  public List<MovimientoInventario> listarMovimientos(Long productoId) { return repoMov.findByProductoId(productoId); }

  @Transactional
  public MovimientoInventario movimiento(Long productoId, TipoMovimiento tipo, Integer cantidad, String nota) {
    if (cantidad == null || cantidad <= 0) throw new IllegalArgumentException("cantidad invalida");
    Inventario inv = obtener(productoId);
    switch (tipo) {
      case ENTRADA -> inv.setStockActual(inv.getStockActual() + cantidad);
      case SALIDA -> { if (inv.getStockActual() - cantidad < 0) throw new IllegalArgumentException("stock insuficiente"); inv.setStockActual(inv.getStockActual() - cantidad); }
      case AJUSTE -> { if (inv.getStockActual() + cantidad < 0) throw new IllegalArgumentException("stock negativo"); inv.setStockActual(inv.getStockActual() + cantidad); }
      default -> {}
    }
    inv.setActualizadoEn(Instant.now());
    repoInv.save(inv);
    MovimientoInventario mov = repoMov.save(MovimientoInventario.builder().productoId(productoId).tipo(tipo).cantidad(cantidad).nota(nota).timestamp(Instant.now()).build());
    verificarAlertas(inv);
    return mov;
  }

  @Transactional
  public Inventario reservar(Long productoId, Integer cantidad) {
    if (cantidad == null || cantidad <= 0) throw new IllegalArgumentException("cantidad invalida");
    Inventario inv = obtener(productoId);
    int disponible = inv.getStockActual() - inv.getStockReservado();
    if (cantidad > disponible) throw new IllegalArgumentException("stock no disponible");
    inv.setStockReservado(inv.getStockReservado() + cantidad);
    inv.setActualizadoEn(Instant.now());
    repoInv.save(inv);
    repoMov.save(MovimientoInventario.builder().productoId(productoId).tipo(TipoMovimiento.RESERVA).cantidad(cantidad).timestamp(Instant.now()).build());
    return inv;
  }

  @Transactional
  public Inventario liberar(Long productoId, Integer cantidad) {
    if (cantidad == null || cantidad <= 0) throw new IllegalArgumentException("cantidad invalida");
    Inventario inv = obtener(productoId);
    if (cantidad > inv.getStockReservado()) throw new IllegalArgumentException("no hay reservas suficientes");
    inv.setStockReservado(inv.getStockReservado() - cantidad);
    inv.setActualizadoEn(Instant.now());
    repoInv.save(inv);
    repoMov.save(MovimientoInventario.builder().productoId(productoId).tipo(TipoMovimiento.LIBERACION).cantidad(cantidad).timestamp(Instant.now()).build());
    return inv;
  }

  @Transactional
  public Inventario confirmar(Long productoId, Integer cantidad) {
    if (cantidad == null || cantidad <= 0) throw new IllegalArgumentException("cantidad invalida");
    Inventario inv = obtener(productoId);
    if (cantidad > inv.getStockReservado()) throw new IllegalArgumentException("no hay reservas suficientes");
    if (inv.getStockActual() - cantidad < 0) throw new IllegalArgumentException("stock insuficiente");
    inv.setStockReservado(inv.getStockReservado() - cantidad);
    inv.setStockActual(inv.getStockActual() - cantidad);
    inv.setActualizadoEn(Instant.now());
    repoInv.save(inv);
    repoMov.save(MovimientoInventario.builder().productoId(productoId).tipo(TipoMovimiento.CONFIRMACION).cantidad(cantidad).timestamp(Instant.now()).build());
    verificarAlertas(inv);
    return inv;
  }

  private void verificarAlertas(Inventario inv) {
    if (inv.getStockActual() < inv.getStockMinimo()) {
      NivelAlerta nivel = inv.getStockActual() <= Math.max(1, inv.getStockMinimo() / 2) ? NivelAlerta.CRITICO : NivelAlerta.BAJO;
      repoAlert.save(AlertaInventario.builder().productoId(inv.getProductoId()).nivel(nivel).mensaje("Stock por debajo del minimo").creadoEn(Instant.now()).atendida(false).build());
      try {
        StockBajoEvento ev = new StockBajoEvento();
        ev.setIdEvento(UUID.randomUUID().toString());
        ev.setFecha(Instant.now());
        ev.setClaveEnrutamiento(EventosConfig.RK_STOCK_BAJO);
        ev.setProductoId(inv.getProductoId());
        ev.setStockActual(inv.getStockActual());
        ev.setStockMinimo(inv.getStockMinimo());
        ev.setNivel(nivel.name());
        rabbitTemplate.convertAndSend(intercambioInventario.getName(), EventosConfig.RK_STOCK_BAJO, ev);
      } catch (Exception ignored) {}
    }
  }
}

