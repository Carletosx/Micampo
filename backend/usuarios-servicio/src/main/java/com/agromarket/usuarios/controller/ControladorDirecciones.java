package com.agromarket.usuarios.controller;

import com.agromarket.usuarios.domain.Direccion;
import com.agromarket.usuarios.dto.SolicitudCrearDireccion;
import com.agromarket.usuarios.dto.SolicitudActualizarDireccion;
import com.agromarket.usuarios.service.ServicioDirecciones;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios/{authUsuarioId}/direcciones")
public class ControladorDirecciones {
  private final ServicioDirecciones servicioDirecciones;
  public ControladorDirecciones(ServicioDirecciones servicioDirecciones) { this.servicioDirecciones = servicioDirecciones; }

  @GetMapping
  public ResponseEntity<List<Direccion>> listar(@PathVariable Long authUsuarioId) { return ResponseEntity.ok(servicioDirecciones.listar(authUsuarioId)); }

  @PostMapping
  public ResponseEntity<Direccion> crear(@PathVariable Long authUsuarioId, @Valid @RequestBody SolicitudCrearDireccion req) {
    Direccion d = Direccion.builder().tipo(com.agromarket.usuarios.domain.TipoDireccion.valueOf(req.getTipo())).linea1(req.getLinea1()).linea2(req.getLinea2()).distrito(req.getDistrito()).provincia(req.getProvincia()).departamento(req.getDepartamento()).referencia(req.getReferencia()).latitud(req.getLatitud()).longitud(req.getLongitud()).build();
    return ResponseEntity.ok(servicioDirecciones.crear(authUsuarioId, d));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Direccion> actualizar(@PathVariable Long authUsuarioId, @PathVariable Long id, @Valid @RequestBody SolicitudActualizarDireccion req) {
    Direccion d = Direccion.builder().tipo(req.getTipo() == null ? null : com.agromarket.usuarios.domain.TipoDireccion.valueOf(req.getTipo())).linea1(req.getLinea1()).linea2(req.getLinea2()).distrito(req.getDistrito()).provincia(req.getProvincia()).departamento(req.getDepartamento()).referencia(req.getReferencia()).latitud(req.getLatitud()).longitud(req.getLongitud()).build();
    return ResponseEntity.ok(servicioDirecciones.actualizar(authUsuarioId, id, d));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> eliminar(@PathVariable Long authUsuarioId, @PathVariable Long id) { servicioDirecciones.eliminar(authUsuarioId, id); return ResponseEntity.noContent().build(); }
}
