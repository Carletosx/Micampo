package com.agromarket.usuarios.controller;

import com.agromarket.usuarios.domain.PerfilUsuario;
import com.agromarket.usuarios.dto.PerfilUsuarioDTO;
import com.agromarket.usuarios.service.ServicioUsuarios;
import com.agromarket.usuarios.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/perfil")
public class ControladorPerfil {
  private final ServicioUsuarios servicioUsuarios;
  public ControladorPerfil(ServicioUsuarios servicioUsuarios) { this.servicioUsuarios = servicioUsuarios; }

  private Long getUsuarioId(String authHeader) {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
    String token = authHeader.substring(7);
    return JwtUtil.getUsuarioId(token);
  }

  @GetMapping
  public ResponseEntity<PerfilUsuario> obtener(@RequestHeader(value = "Authorization", required = false) String authorization) {
    Long uid = getUsuarioId(authorization);
    if (uid == null) return ResponseEntity.status(401).build();
    return ResponseEntity.ok(servicioUsuarios.obtenerPerfil(uid));
  }

  @PutMapping
  public ResponseEntity<PerfilUsuario> actualizar(@RequestHeader(value = "Authorization", required = false) String authorization, @RequestBody PerfilUsuarioDTO dto) {
    Long uid = getUsuarioId(authorization);
    if (uid == null) return ResponseEntity.status(401).build();
    return ResponseEntity.ok(servicioUsuarios.actualizarPerfil(uid, dto));
  }
}
