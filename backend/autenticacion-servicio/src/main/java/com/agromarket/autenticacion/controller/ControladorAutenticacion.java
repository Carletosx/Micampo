package com.agromarket.autenticacion.controller;

import com.agromarket.autenticacion.domain.Usuario;
import com.agromarket.autenticacion.service.ServicioAutenticacion;
import com.agromarket.autenticacion.service.ServicioJwt;
import com.agromarket.autenticacion.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/autenticacion")
public class ControladorAutenticacion {
  private final ServicioAutenticacion servicioAutenticacion;
  private final ServicioJwt servicioJwt;

  public ControladorAutenticacion(ServicioAutenticacion servicioAutenticacion, ServicioJwt servicioJwt) {
    this.servicioAutenticacion = servicioAutenticacion;
    this.servicioJwt = servicioJwt;
  }

  @PostMapping("/registro")
  public ResponseEntity<RespuestaToken> registrar(@Valid @RequestBody SolicitudRegistro req) {
    Usuario u = servicioAutenticacion.registrar(req.getCorreo(), req.getContrasenia(), req.getRol());
    String access = servicioJwt.generarAccessToken(u.getCorreo(), u.getRol(), 15);
    String refresh = servicioAutenticacion.crearTokenRefresco(u.getCorreo());
    return ResponseEntity.ok(new RespuestaToken(access, refresh));
  }

  @PostMapping("/ingreso")
  public ResponseEntity<RespuestaToken> ingresar(@Valid @RequestBody SolicitudIngreso req) {
    String access = servicioAutenticacion.ingresar(req.getCorreo(), req.getContrasenia());
    String refresh = servicioAutenticacion.crearTokenRefresco(req.getCorreo());
    return ResponseEntity.ok(new RespuestaToken(access, refresh));
  }

  @PostMapping("/refrescar")
  public ResponseEntity<RespuestaToken> refrescar(@Valid @RequestBody SolicitudRefresco req) {
    String access = servicioAutenticacion.refrescar(req.getTokenRefresco());
    return ResponseEntity.ok(new RespuestaToken(access, req.getTokenRefresco()));
  }

  @GetMapping("/validar")
  public ResponseEntity<Void> validar(@RequestHeader("Authorization") String autorizacion) {
    String token = autorizacion != null && autorizacion.startsWith("Bearer ") ? autorizacion.substring(7) : autorizacion;
    return servicioAutenticacion.validar(token) ? ResponseEntity.ok().build() : ResponseEntity.status(401).build();
  }
}
