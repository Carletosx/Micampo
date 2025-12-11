package com.agromarket.productos.controller;

import com.agromarket.productos.domain.ResenaProducto;
import com.agromarket.productos.dto.SolicitudCrearResena;
import com.agromarket.productos.service.ServicioResenas;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/productos/{productoId}/resenas")
public class ControladorResenas {
  private final ServicioResenas servicioResenas;
  private static final Logger log = LoggerFactory.getLogger(ControladorResenas.class);
  public ControladorResenas(ServicioResenas servicioResenas) { this.servicioResenas = servicioResenas; }

  @GetMapping
  public ResponseEntity<List<ResenaProducto>> listar(@PathVariable Long productoId) { return ResponseEntity.ok(servicioResenas.listar(productoId)); }

  @PostMapping
  public ResponseEntity<ResenaProducto> crear(@RequestHeader(value = "X-Auth-Id", required = false) Long authId, @RequestHeader(value = "X-Auth-Name", required = false) String authName, @PathVariable Long productoId, @Valid @RequestBody SolicitudCrearResena req) {
    log.info("crear reseña productoId={}, authId={}, authName={}, bodyAutorId={}, bodyAutorNombre={}", productoId, authId, authName, req.getAutorAuthId(), req.getAutorNombre());
    return ResponseEntity.ok(servicioResenas.crear(productoId, req, authId, authName));
  }
}
