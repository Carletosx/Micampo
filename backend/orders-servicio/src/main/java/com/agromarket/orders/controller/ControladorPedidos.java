package com.agromarket.orders.controller;

import com.agromarket.orders.domain.Pedido;
import com.agromarket.orders.domain.HistorialEstado;
import com.agromarket.orders.dto.*;
import com.agromarket.orders.service.ServicioPedidos;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/pedidos")
public class ControladorPedidos {
  private final ServicioPedidos servicioPedidos;
  public ControladorPedidos(ServicioPedidos servicioPedidos) { this.servicioPedidos = servicioPedidos; }

  @PostMapping
  public ResponseEntity<Pedido> crear(@Valid @RequestBody SolicitudCrearPedido req, @RequestHeader(value = "X-Auth-Id", required = false) Long authId) {
    if (req.getUsuarioAuthId() == null && authId != null) req.setUsuarioAuthId(authId);
    return ResponseEntity.ok(servicioPedidos.crear(req));
  }

  @GetMapping("/{id}")
  public ResponseEntity<Pedido> obtener(@PathVariable Long id) { return ResponseEntity.ok(servicioPedidos.obtener(id)); }

  @GetMapping
  public ResponseEntity<java.util.Map<String, Object>> listar(@RequestParam(required = false) Long usuarioAuthId, @RequestParam(required = false) Long agricultorAuthId, @RequestParam(required = false) String estado, @RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size) {
    Page<Pedido> p = servicioPedidos.listar(usuarioAuthId, agricultorAuthId, estado, page, size);
    java.util.Map<String, Object> res = new java.util.HashMap<>();
    res.put("content", p.getContent());
    res.put("page", p.getNumber());
    res.put("size", p.getSize());
    res.put("totalElements", p.getTotalElements());
    res.put("totalPages", p.getTotalPages());
    res.put("numberOfElements", p.getNumberOfElements());
    res.put("first", p.isFirst());
    res.put("last", p.isLast());
    return ResponseEntity.ok(res);
  }

  @PutMapping("/{id}/estado")
  public ResponseEntity<Pedido> cambiarEstado(@PathVariable Long id, @Valid @RequestBody SolicitudCambioEstado req) { return ResponseEntity.ok(servicioPedidos.cambiarEstado(id, req.getEstado(), req.getNota())); }

  @GetMapping("/{id}/totales")
  public ResponseEntity<Map<String, BigDecimal>> totales(@PathVariable Long id) { return ResponseEntity.ok(servicioPedidos.totales(id)); }

  @GetMapping("/{id}/historial")
  public ResponseEntity<java.util.List<HistorialEstado>> historial(@PathVariable Long id) { return ResponseEntity.ok(servicioPedidos.historial(id)); }

  @GetMapping("/{id}/items")
  public ResponseEntity<java.util.List<com.agromarket.orders.domain.ItemPedido>> items(@PathVariable Long id) { return ResponseEntity.ok(servicioPedidos.items(id)); }

  @PostMapping("/{id}/items")
  public ResponseEntity<Pedido> agregarItem(@PathVariable Long id, @Valid @RequestBody SolicitudItem req) { return ResponseEntity.ok(servicioPedidos.agregarItem(id, req)); }

  @DeleteMapping("/{id}/items/{itemId}")
  public ResponseEntity<Void> eliminarItem(@PathVariable Long id, @PathVariable Long itemId) { servicioPedidos.eliminarItem(id, itemId); return ResponseEntity.noContent().build(); }
}
