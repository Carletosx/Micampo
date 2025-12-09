package com.agromarket.usuarios.controller;

import com.agromarket.usuarios.domain.Finca;
import com.agromarket.usuarios.dto.FincaDTO;
import com.agromarket.usuarios.service.ServicioUsuarios;
import com.agromarket.usuarios.util.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fincas")
public class ControladorFincas {
  private final ServicioUsuarios servicioUsuarios;
  public ControladorFincas(ServicioUsuarios servicioUsuarios) { this.servicioUsuarios = servicioUsuarios; }

  private Long getUsuarioId(String authHeader) {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
    String token = authHeader.substring(7);
    return JwtUtil.getUsuarioId(token);
  }

  @GetMapping
  public ResponseEntity<Page<Finca>> listar(@RequestHeader(value = "Authorization", required = false) String authorization, @RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size) {
    Long uid = getUsuarioId(authorization);
    if (uid == null) return ResponseEntity.status(401).build();
    return ResponseEntity.ok(servicioUsuarios.listarFincas(uid, page, size));
  }

  @PostMapping
  public ResponseEntity<Finca> crear(@RequestHeader(value = "Authorization", required = false) String authorization, @RequestBody FincaDTO dto) {
    Long uid = getUsuarioId(authorization);
    if (uid == null) return ResponseEntity.status(401).build();
    return ResponseEntity.ok(servicioUsuarios.crearFinca(uid, dto));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Finca> actualizar(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long id, @RequestBody FincaDTO dto) {
    Long uid = getUsuarioId(authorization);
    if (uid == null) return ResponseEntity.status(401).build();
    return ResponseEntity.ok(servicioUsuarios.actualizarFinca(id, uid, dto));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> eliminar(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long id) {
    Long uid = getUsuarioId(authorization);
    if (uid == null) return ResponseEntity.status(401).build();
    servicioUsuarios.eliminarFinca(id, uid);
    return ResponseEntity.noContent().build();
  }
}
