package com.agromarket.usuarios.controller;

import com.agromarket.usuarios.domain.Agricultor;
import com.agromarket.usuarios.dto.SolicitudActualizarAgricultor;
import com.agromarket.usuarios.service.ServicioPerfiles;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/agricultores")
public class ControladorAgricultores {
  private final ServicioPerfiles servicioPerfiles;
  public ControladorAgricultores(ServicioPerfiles servicioPerfiles) { this.servicioPerfiles = servicioPerfiles; }

  @GetMapping("/{id}")
  public ResponseEntity<Agricultor> obtener(@PathVariable Long id) { return ResponseEntity.ok(servicioPerfiles.obtenerAgricultor(id)); }

  @GetMapping("/by-auth/{authUsuarioId}")
  public ResponseEntity<Agricultor> obtenerPorAuth(@PathVariable Long authUsuarioId) { return ResponseEntity.ok(servicioPerfiles.obtenerAgricultorPorAuth(authUsuarioId)); }

  @PutMapping("/{id}")
  public ResponseEntity<Agricultor> actualizar(@PathVariable Long id, @Valid @RequestBody SolicitudActualizarAgricultor req) { return ResponseEntity.ok(servicioPerfiles.actualizarAgricultor(id, req.getNombre(), req.getTelefono())); }
}
