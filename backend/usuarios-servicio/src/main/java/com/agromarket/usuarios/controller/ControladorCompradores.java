package com.agromarket.usuarios.controller;

import com.agromarket.usuarios.domain.Comprador;
import com.agromarket.usuarios.dto.SolicitudActualizarComprador;
import com.agromarket.usuarios.service.ServicioPerfiles;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/compradores")
public class ControladorCompradores {
  private final ServicioPerfiles servicioPerfiles;
  public ControladorCompradores(ServicioPerfiles servicioPerfiles) { this.servicioPerfiles = servicioPerfiles; }

  @GetMapping("/{id}")
  public ResponseEntity<Comprador> obtener(@PathVariable Long id) { return ResponseEntity.ok(servicioPerfiles.obtenerComprador(id)); }

  @GetMapping("/by-auth/{authUsuarioId}")
  public ResponseEntity<Comprador> obtenerPorAuth(@PathVariable Long authUsuarioId) { return ResponseEntity.ok(servicioPerfiles.obtenerCompradorPorAuth(authUsuarioId)); }

  @PutMapping("/{id}")
  public ResponseEntity<Comprador> actualizar(@PathVariable Long id, @Valid @RequestBody SolicitudActualizarComprador req) { return ResponseEntity.ok(servicioPerfiles.actualizarComprador(id, req.getNombre(), req.getTelefono(), req.getTipo())); }
}
