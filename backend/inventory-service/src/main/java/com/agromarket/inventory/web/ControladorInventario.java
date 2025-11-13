package com.agromarket.inventory.web;

import com.agromarket.inventory.events.EventoBandejaSalida;
import com.agromarket.inventory.model.AlertaInventario;
import com.agromarket.inventory.model.Inventario;
import com.agromarket.inventory.model.MovimientoInventario;
import com.agromarket.inventory.repo.AlertaInventarioRepositorio;
import com.agromarket.inventory.repo.BandejaSalidaRepositorio;
import com.agromarket.inventory.repo.InventarioRepositorio;
import com.agromarket.inventory.repo.MovimientoInventarioRepositorio;
import com.agromarket.inventory.web.dto.SolicitudActualizarStock;
import com.agromarket.inventory.web.dto.SolicitudReserva;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/inventory")
public class ControladorInventario {

  private final InventarioRepositorio inventarioRepositorio;
  private final MovimientoInventarioRepositorio movimientoRepositorio;
  private final AlertaInventarioRepositorio alertaRepositorio;
  private final BandejaSalidaRepositorio outboxRepositorio;
  private final ObjectMapper mapper;

  public ControladorInventario(InventarioRepositorio inventarioRepositorio, MovimientoInventarioRepositorio movimientoRepositorio, AlertaInventarioRepositorio alertaRepositorio, BandejaSalidaRepositorio outboxRepositorio, ObjectMapper mapper) {
    this.inventarioRepositorio = inventarioRepositorio;
    this.movimientoRepositorio = movimientoRepositorio;
    this.alertaRepositorio = alertaRepositorio;
    this.outboxRepositorio = outboxRepositorio;
    this.mapper = mapper;
  }

  @GetMapping("/{productId}")
  public ResponseEntity<Inventario> obtener(@PathVariable("productId") UUID productId) {
    return inventarioRepositorio.findByProductoId(productId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/{productId}")
  public ResponseEntity<Inventario> actualizar(@PathVariable("productId") UUID productId, @Valid @RequestBody SolicitudActualizarStock req) throws Exception {
    return inventarioRepositorio.findByProductoId(productId).map(inv -> {
      inv.setStockActual(req.stockActual());
      inv.setStockMinimo(req.stockMinimo());
      inventarioRepositorio.save(inv);
      MovimientoInventario mov = new MovimientoInventario();
      mov.setProductoId(productId);
      mov.setTipo("AJUSTE");
      mov.setCantidad(req.stockActual());
      movimientoRepositorio.save(mov);
      evaluarAlertas(inv);
      return ResponseEntity.ok(inv);
    }).orElse(ResponseEntity.status(404).<Inventario>build());
  }

  @PostMapping("/reserve")
  public ResponseEntity<Inventario> reservar(@Valid @RequestBody SolicitudReserva req, @RequestParam("productId") UUID productId) throws Exception {
    return inventarioRepositorio.findByProductoId(productId).map(inv -> {
      if (inv.getStockActual() - inv.getStockReservado() < req.cantidad()) {
        return ResponseEntity.status(409).<Inventario>build();
      }
      inv.setStockReservado(inv.getStockReservado() + req.cantidad());
      inventarioRepositorio.save(inv);
      MovimientoInventario mov = new MovimientoInventario();
      mov.setProductoId(productId);
      mov.setTipo("RESERVA");
      mov.setCantidad(req.cantidad());
      mov.setReferencia(req.referencia());
      movimientoRepositorio.save(mov);
      evaluarAlertas(inv);
      return ResponseEntity.ok(inv);
    }).orElse(ResponseEntity.status(404).<Inventario>build());
  }

  @PostMapping("/release")
  public ResponseEntity<Inventario> liberar(@Valid @RequestBody SolicitudReserva req, @RequestParam("productId") UUID productId) throws Exception {
    return inventarioRepositorio.findByProductoId(productId).map(inv -> {
      int nueva = inv.getStockReservado() - req.cantidad();
      inv.setStockReservado(Math.max(nueva, 0));
      inventarioRepositorio.save(inv);
      MovimientoInventario mov = new MovimientoInventario();
      mov.setProductoId(productId);
      mov.setTipo("LIBERACION");
      mov.setCantidad(req.cantidad());
      mov.setReferencia(req.referencia());
      movimientoRepositorio.save(mov);
      evaluarAlertas(inv);
      return ResponseEntity.ok(inv);
    }).orElse(ResponseEntity.status(404).<Inventario>build());
  }

  @GetMapping("/movements")
  public ResponseEntity<List<MovimientoInventario>> movimientos(@RequestParam("productId") UUID productId) {
    return ResponseEntity.ok(movimientoRepositorio.findByProductoIdOrderByCreadoEnDesc(productId));
  }

  private void evaluarAlertas(Inventario inv) {
    int disponible = inv.getStockActual() - inv.getStockReservado();
    if (disponible <= inv.getStockMinimo()) {
      AlertaInventario alerta = new AlertaInventario();
      alerta.setProductoId(inv.getProductoId());
      alerta.setNivel(disponible <= 0 ? "CRITICO" : "BAJO");
      alerta.setMensaje("Stock disponible en " + disponible);
      alertaRepositorio.save(alerta);
      try {
        EventoBandejaSalida out = new EventoBandejaSalida();
        out.setType("inventory.stock-low");
        out.setRoutingKey("inventory.stock-low");
        out.setPayload(mapper.writeValueAsString(Map.of(
            "productId", inv.getProductoId().toString(),
            "nivel", alerta.getNivel(),
            "disponible", disponible
        )));
        outboxRepositorio.save(out);
      } catch (Exception ignored) {}
    }
  }
}
