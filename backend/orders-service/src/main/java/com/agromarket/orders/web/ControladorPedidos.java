package com.agromarket.orders.web;

import com.agromarket.orders.events.EventoBandejaSalida;
import com.agromarket.orders.events.EventoEstadoPedidoCambiado;
import com.agromarket.orders.events.EventoPedidoCreado;
import com.agromarket.orders.model.EstadoPedido;
import com.agromarket.orders.model.HistorialEstado;
import com.agromarket.orders.model.ItemPedido;
import com.agromarket.orders.model.Pedido;
import com.agromarket.orders.repo.BandejaSalidaRepositorio;
import com.agromarket.orders.repo.ItemPedidoRepositorio;
import com.agromarket.orders.repo.PedidoRepositorio;
import com.agromarket.orders.web.dto.SolicitudCambioEstado;
import com.agromarket.orders.web.dto.SolicitudCrearPedido;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/orders")
public class ControladorPedidos {

  private final PedidoRepositorio pedidoRepositorio;
  private final ItemPedidoRepositorio itemPedidoRepositorio;
  private final BandejaSalidaRepositorio outboxRepositorio;
  private final ObjectMapper mapper;

  public ControladorPedidos(PedidoRepositorio pedidoRepositorio, ItemPedidoRepositorio itemPedidoRepositorio, BandejaSalidaRepositorio outboxRepositorio, ObjectMapper mapper) {
    this.pedidoRepositorio = pedidoRepositorio;
    this.itemPedidoRepositorio = itemPedidoRepositorio;
    this.outboxRepositorio = outboxRepositorio;
    this.mapper = mapper;
  }

  @GetMapping("/{id}")
  public ResponseEntity<Pedido> obtener(@PathVariable("id") UUID id) {
    return pedidoRepositorio.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @GetMapping
  public ResponseEntity<List<Pedido>> listarPorEstado(@RequestParam(value = "state", required = false) EstadoPedido estado) {
    if (estado == null) return ResponseEntity.ok(pedidoRepositorio.findAll());
    return ResponseEntity.ok(pedidoRepositorio.findByEstado(estado));
  }

  @PostMapping
  public ResponseEntity<Pedido> crear(@Valid @RequestBody SolicitudCrearPedido req) throws Exception {
    Pedido pedido = new Pedido();
    pedido.setNumero(generarNumero());
    pedido.setMetodoPago(req.metodoPago());
    pedido.setMetodoEnvio(req.metodoEnvio());
    pedido.setCostoEnvio(req.costoEnvio());
    pedido.setDescuento(req.descuento());
    pedido = pedidoRepositorio.save(pedido);

    BigDecimal subtotal = BigDecimal.ZERO;
    for (var i : req.items()) {
      ItemPedido ip = new ItemPedido();
      ip.setPedido(pedido);
      ip.setProductoId(i.productoId());
      ip.setCantidad(i.cantidad());
      ip.setPrecioUnitario(i.precioUnitario());
      BigDecimal sub = i.precioUnitario().multiply(BigDecimal.valueOf(i.cantidad()));
      ip.setSubtotal(sub);
      itemPedidoRepositorio.save(ip);
      subtotal = subtotal.add(sub);
    }
    pedido.setSubtotal(subtotal);
    pedido.setTotal(subtotal.add(pedido.getCostoEnvio()).subtract(pedido.getDescuento()));
    pedidoRepositorio.save(pedido);

    HistorialEstado he = new HistorialEstado();
    he.setPedido(pedido);
    he.setEstado(EstadoPedido.PENDIENTE);
    if (pedido.getHistorial() == null) {
      pedido.setHistorial(new java.util.ArrayList<>());
    }
    pedido.getHistorial().add(he);
    pedidoRepositorio.save(pedido);

    var itemsEvt = req.items().stream()
        .map(i -> new EventoPedidoCreado.Item(i.productoId(), i.cantidad(), i.precioUnitario(), i.precioUnitario().multiply(BigDecimal.valueOf(i.cantidad()))))
        .collect(Collectors.toList());
    EventoPedidoCreado evt = new EventoPedidoCreado(pedido.getId(), pedido.getNumero(), pedido.getSubtotal(), pedido.getCostoEnvio(), pedido.getDescuento(), pedido.getTotal(), itemsEvt);
    EventoBandejaSalida out = new EventoBandejaSalida();
    out.setType("order.created");
    out.setRoutingKey("order.created");
    out.setPayload(mapper.writeValueAsString(evt));
    outboxRepositorio.save(out);

    return ResponseEntity.ok(pedido);
  }

  @PutMapping("/{id}/state")
  public ResponseEntity<Pedido> cambiarEstado(@PathVariable("id") UUID id, @Valid @RequestBody SolicitudCambioEstado req) throws Exception {
    return pedidoRepositorio.findById(id).map(p -> {
      if (!esTransicionValida(p.getEstado(), req.estado())) {
        return ResponseEntity.status(409).<Pedido>build();
      }
      p.setEstado(req.estado());
      pedidoRepositorio.save(p);
      HistorialEstado he = new HistorialEstado();
      he.setPedido(p);
      he.setEstado(req.estado());
      if (p.getHistorial() == null) {
        p.setHistorial(new java.util.ArrayList<>());
      }
      p.getHistorial().add(he);
      pedidoRepositorio.save(p);
      try {
        EventoEstadoPedidoCambiado evt = new EventoEstadoPedidoCambiado(p.getId(), p.getNumero(), p.getEstado());
        EventoBandejaSalida out = new EventoBandejaSalida();
        out.setType("order.status-changed");
        out.setRoutingKey("order.status-changed");
        out.setPayload(mapper.writeValueAsString(evt));
        outboxRepositorio.save(out);
        if (req.estado() == EstadoPedido.CONFIRMADO) {
          EventoBandejaSalida out2 = new EventoBandejaSalida();
          out2.setType("order.confirmed");
          out2.setRoutingKey("order.confirmed");
          out2.setPayload(mapper.writeValueAsString(evt));
          outboxRepositorio.save(out2);
        }
      } catch (Exception ignored) {}
      return ResponseEntity.ok(p);
    }).orElse(ResponseEntity.status(404).<Pedido>build());
  }

  private String generarNumero() {
    return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
  }

  private boolean esTransicionValida(EstadoPedido actual, EstadoPedido nuevo) {
    if (actual == EstadoPedido.PENDIENTE && nuevo == EstadoPedido.CONFIRMADO) return true;
    if (actual == EstadoPedido.CONFIRMADO && nuevo == EstadoPedido.EN_PREPARACION) return true;
    if (actual == EstadoPedido.EN_PREPARACION && nuevo == EstadoPedido.EN_CAMINO) return true;
    if (actual == EstadoPedido.EN_CAMINO && nuevo == EstadoPedido.ENTREGADO) return true;
    return false;
  }
}
