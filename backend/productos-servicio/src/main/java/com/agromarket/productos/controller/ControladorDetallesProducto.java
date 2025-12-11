package com.agromarket.productos.controller;

import com.agromarket.productos.domain.ProductoDetalle;
import com.agromarket.productos.dto.DetalleProductoDTO;
import com.agromarket.productos.service.ServicioProductos;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/productos")
public class ControladorDetallesProducto {
  private final ServicioProductos servicioProductos;
  public ControladorDetallesProducto(ServicioProductos servicioProductos) { this.servicioProductos = servicioProductos; }

  @GetMapping("/{id}/detalle")
  public ResponseEntity<ProductoDetalle> obtener(@PathVariable Long id) { return ResponseEntity.ok(servicioProductos.obtenerDetalle(id)); }

  @PutMapping("/{id}/detalle")
  public ResponseEntity<ProductoDetalle> actualizar(@RequestHeader(value = "X-Auth-Id", required = false) Long authId, @PathVariable Long id, @Valid @RequestBody DetalleProductoDTO dto) { return ResponseEntity.ok(servicioProductos.actualizarDetalle(id, dto, authId)); }
}
