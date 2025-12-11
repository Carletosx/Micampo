package com.agromarket.productos.controller;

import com.agromarket.productos.domain.ResenaProducto;
import com.agromarket.productos.dto.ResenaVendedorDTO;
import com.agromarket.productos.service.ServicioResenas;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/productos/resenas")
public class ControladorResenasAdmin {
  private final ServicioResenas servicioResenas;
  public ControladorResenasAdmin(ServicioResenas servicioResenas) { this.servicioResenas = servicioResenas; }

  @GetMapping("/by-vendedor/{authUsuarioId}")
  public ResponseEntity<List<ResenaVendedorDTO>> listarPorVendedor(@PathVariable Long authUsuarioId) { return ResponseEntity.ok(servicioResenas.listarPorVendedor(authUsuarioId)); }

  @PutMapping("/{resenaId}")
  public ResponseEntity<ResenaProducto> actualizar(@RequestHeader(value = "X-Auth-Id", required = false) Long authId, @PathVariable Long resenaId, @RequestBody java.util.Map<String, Object> body) {
    Integer cal = body.get("calificacion") instanceof Number ? ((Number) body.get("calificacion")).intValue() : null;
    String com = body.get("comentario") != null ? String.valueOf(body.get("comentario")) : null;
    return ResponseEntity.ok(servicioResenas.actualizar(resenaId, authId, cal, com));
  }

  @DeleteMapping("/{resenaId}")
  public ResponseEntity<Void> eliminar(@RequestHeader(value = "X-Auth-Id", required = false) Long authId, @PathVariable Long resenaId) {
    servicioResenas.eliminar(resenaId, authId);
    return ResponseEntity.noContent().build();
  }
}
