package com.agromarket.orders.controller;

import com.agromarket.orders.domain.Pedido;
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
  public ResponseEntity<Pedido> crear(@Valid @RequestBody SolicitudCrearPedido req) { return ResponseEntity.ok(servicioPedidos.crear(req)); }

  @GetMapping("/{id}")
  public ResponseEntity<Pedido> obtener(@PathVariable Long id) { return ResponseEntity.ok(servicioPedidos.obtener(id)); }

  @GetMapping
  public ResponseEntity<Page<Pedido>> listar(@RequestParam(required = false) Long usuarioAuthId, @RequestParam(required = false) Long agricultorAuthId, @RequestParam(required = false) String estado, @RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size) { return ResponseEntity.ok(servicioPedidos.listar(usuarioAuthId, agricultorAuthId, estado, page, size)); }

  @PutMapping("/{id}/estado")
  public ResponseEntity<Pedido> cambiarEstado(@PathVariable Long id, @Valid @RequestBody SolicitudCambioEstado req) { return ResponseEntity.ok(servicioPedidos.cambiarEstado(id, req.getEstado(), req.getNota())); }

  @GetMapping("/{id}/totales")
  public ResponseEntity<Map<String, BigDecimal>> totales(@PathVariable Long id) { return ResponseEntity.ok(servicioPedidos.totales(id)); }

  @PostMapping("/{id}/items")
  public ResponseEntity<Pedido> agregarItem(@PathVariable Long id, @Valid @RequestBody SolicitudItem req) { return ResponseEntity.ok(servicioPedidos.agregarItem(id, req)); }

  @DeleteMapping("/{id}/items/{itemId}")
  public ResponseEntity<Void> eliminarItem(@PathVariable Long id, @PathVariable Long itemId) { servicioPedidos.eliminarItem(id, itemId); return ResponseEntity.noContent().build(); }
}

