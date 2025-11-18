package com.agromarket.payments.controller;

import com.agromarket.payments.domain.MetodoPagoGuardado;
import com.agromarket.payments.domain.Pago;
import com.agromarket.payments.dto.*;
import com.agromarket.payments.service.ServicioPagos;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/pagos")
public class ControladorPagos {
  private final ServicioPagos servicioPagos;
  public ControladorPagos(ServicioPagos servicioPagos) { this.servicioPagos = servicioPagos; }

  @PostMapping
  public ResponseEntity<Pago> crear(@Valid @RequestBody SolicitudCrearPago req) { return ResponseEntity.ok(servicioPagos.crear(req)); }

  @GetMapping("/{id}")
  public ResponseEntity<Pago> obtener(@PathVariable Long id) { return ResponseEntity.ok(servicioPagos.obtener(id)); }

  @PostMapping("/{id}/confirmar")
  public ResponseEntity<Pago> confirmar(@PathVariable Long id, @RequestBody SolicitudConfirmarPago req) { return ResponseEntity.ok(servicioPagos.confirmar(id, req)); }

  @PostMapping("/{id}/reembolsar")
  public ResponseEntity<Pago> reembolsar(@PathVariable Long id) { return ResponseEntity.ok(servicioPagos.reembolsar(id)); }

  @GetMapping("/metodos-pago")
  public ResponseEntity<List<MetodoPagoGuardado>> listarMetodos(@RequestParam Long usuarioAuthId) { return ResponseEntity.ok(servicioPagos.listarMetodos(usuarioAuthId)); }

  @PostMapping("/metodos-pago")
  public ResponseEntity<MetodoPagoGuardado> crearMetodo(@Valid @RequestBody SolicitudMetodoPagoGuardado req) { return ResponseEntity.ok(servicioPagos.crearMetodo(req)); }

  @DeleteMapping("/metodos-pago/{id}")
  public ResponseEntity<Void> eliminarMetodo(@PathVariable Long id) { servicioPagos.eliminarMetodo(id); return ResponseEntity.noContent().build(); }
}

