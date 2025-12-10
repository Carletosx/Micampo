package com.agromarket.autenticacion.controller;

import com.agromarket.autenticacion.domain.Usuario;
import com.agromarket.autenticacion.service.ServicioAutenticacion;
import com.agromarket.autenticacion.service.ServicioJwt;
import com.agromarket.autenticacion.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/autenticacion")
public class ControladorAutenticacion {
  private final ServicioAutenticacion servicioAutenticacion;
  private final ServicioJwt servicioJwt;
  private static final Logger log = LoggerFactory.getLogger(ControladorAutenticacion.class);

  public ControladorAutenticacion(ServicioAutenticacion servicioAutenticacion, ServicioJwt servicioJwt) {
    this.servicioAutenticacion = servicioAutenticacion;
    this.servicioJwt = servicioJwt;
  }

  @PostMapping("/registro")
  public ResponseEntity<RespuestaToken> registrar(@Valid @RequestBody SolicitudRegistro req) {
    long t0 = System.nanoTime();
    Usuario u = servicioAutenticacion.registrar(req.getCorreo(), req.getNombre(), req.getContrasenia(), req.getRol());
    String access = servicioJwt.generarAccessToken(u.getCorreo(), u.getRol(), u.getId(), u.getNombre(), 15);
    String refresh = servicioAutenticacion.crearTokenRefresco(u.getCorreo());
    long t1 = System.nanoTime();
    log.info("registro ms:{}", Math.round((t1 - t0) / 1_000_000.0));
    return ResponseEntity.ok(new RespuestaToken(access, refresh));
  }

  @PostMapping("/ingreso")
  public ResponseEntity<RespuestaToken> ingresar(@Valid @RequestBody SolicitudIngreso req) {
    long t0 = System.nanoTime();
    String access = servicioAutenticacion.ingresar(req.getCorreo(), req.getContrasenia());
    String refresh = servicioAutenticacion.crearTokenRefresco(req.getCorreo());
    long t1 = System.nanoTime();
    log.info("ingreso ms:{}", Math.round((t1 - t0) / 1_000_000.0));
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

  @PutMapping("/perfil")
  public ResponseEntity<UsuarioRespuesta> actualizarPerfil(@RequestHeader("Authorization") String autorizacion, @Valid @RequestBody SolicitudActualizarPerfil req) {
    String token = autorizacion != null && autorizacion.startsWith("Bearer ") ? autorizacion.substring(7) : autorizacion;
    String correo = servicioJwt.obtenerSujeto(token);
    Usuario u = servicioAutenticacion.actualizarPerfil(correo, req.getNombre(), req.getAvatarUrl());
    return ResponseEntity.ok(new UsuarioRespuesta(u.getId(), u.getCorreo(), u.getNombre(), u.getRol(), u.isActivo(), u.getAvatarUrl()));
  }

  @GetMapping("/public/usuarios/{id}")
  public ResponseEntity<UsuarioRespuesta> obtenerUsuarioPublico(@PathVariable Long id) {
    Usuario u = servicioAutenticacion.obtenerPorId(id);
    if (u == null) return ResponseEntity.notFound().build();
    return ResponseEntity.ok(new UsuarioRespuesta(u.getId(), u.getCorreo(), u.getNombre(), u.getRol(), u.isActivo(), u.getAvatarUrl()));
  }
}
