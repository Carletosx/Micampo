package com.agromarket.inventory.controller;

import com.agromarket.inventory.domain.Inventario;
import com.agromarket.inventory.domain.MovimientoInventario;
import com.agromarket.inventory.domain.TipoMovimiento;
import com.agromarket.inventory.dto.*;
import com.agromarket.inventory.service.ServicioInventario;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/inventario")
public class ControladorInventario {
  private final ServicioInventario servicioInventario;
  public ControladorInventario(ServicioInventario servicioInventario) { this.servicioInventario = servicioInventario; }

  @GetMapping("/{productoId}")
  public ResponseEntity<Inventario> obtener(@PathVariable Long productoId) { return ResponseEntity.ok(servicioInventario.obtener(productoId)); }

  @PutMapping("/{productoId}")
  public ResponseEntity<Inventario> actualizar(@PathVariable Long productoId, @Valid @RequestBody SolicitudActualizarInventario req) { return ResponseEntity.ok(servicioInventario.actualizar(productoId, req.getStockMinimo(), req.getStockActual())); }

  @GetMapping("/{productoId}/movimientos")
  public ResponseEntity<List<MovimientoInventario>> listarMov(@PathVariable Long productoId) { return ResponseEntity.ok(servicioInventario.listarMovimientos(productoId)); }

  @PostMapping("/{productoId}/movimientos")
  public ResponseEntity<MovimientoInventario> crearMov(@PathVariable Long productoId, @Valid @RequestBody SolicitudMovimiento req) { return ResponseEntity.ok(servicioInventario.movimiento(productoId, TipoMovimiento.valueOf(req.getTipo()), req.getCantidad(), req.getNota())); }

  @PostMapping("/{productoId}/reservas")
  public ResponseEntity<Inventario> reservar(@PathVariable Long productoId, @Valid @RequestBody SolicitudCantidad req) { return ResponseEntity.ok(servicioInventario.reservar(productoId, req.getCantidad())); }

  @PostMapping("/{productoId}/liberaciones")
  public ResponseEntity<Inventario> liberar(@PathVariable Long productoId, @Valid @RequestBody SolicitudCantidad req) { return ResponseEntity.ok(servicioInventario.liberar(productoId, req.getCantidad())); }

  @PostMapping("/{productoId}/confirmaciones")
  public ResponseEntity<Inventario> confirmar(@PathVariable Long productoId, @Valid @RequestBody SolicitudCantidad req) { return ResponseEntity.ok(servicioInventario.confirmar(productoId, req.getCantidad())); }
}

