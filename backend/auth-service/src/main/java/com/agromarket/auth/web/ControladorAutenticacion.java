package com.agromarket.auth.web;

import com.agromarket.auth.dto.*;
import com.agromarket.auth.service.ServicioAutenticacion;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class ControladorAutenticacion {

  private final ServicioAutenticacion authService;

  public ControladorAutenticacion(ServicioAutenticacion authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<RespuestaToken> register(@Valid @RequestBody SolicitudRegistro request) {
    return ResponseEntity.ok(authService.registrar(request));
  }

  @PostMapping("/login")
  public ResponseEntity<RespuestaToken> login(@Valid @RequestBody SolicitudInicioSesion request) {
    return ResponseEntity.ok(authService.iniciarSesion(request));
  }

  @PostMapping("/refresh")
  public ResponseEntity<RespuestaToken> refresh(@Valid @RequestBody SolicitudRefresco request) {
    return ResponseEntity.ok(authService.refrescar(request.refreshToken()));
  }

  @PostMapping("/forgot")
  public ResponseEntity<Void> forgot(@Valid @RequestBody SolicitudOlvidoContrasena request) {
    authService.olvidar(request);
    return ResponseEntity.accepted().build();
  }

  @PostMapping("/validate")
  public ResponseEntity<Boolean> validate(@RequestBody String token) {
    return ResponseEntity.ok(authService.validar(token));
  }
}
