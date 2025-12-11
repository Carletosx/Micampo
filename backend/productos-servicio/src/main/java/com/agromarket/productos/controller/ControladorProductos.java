package com.agromarket.productos.controller;

import com.agromarket.productos.domain.Producto;
import com.agromarket.productos.dto.SolicitudCrearProducto;
import com.agromarket.productos.dto.SolicitudActualizarProducto;
import com.agromarket.productos.service.ServicioProductos;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/productos")
public class ControladorProductos {
  private final ServicioProductos servicioProductos;
  public ControladorProductos(ServicioProductos servicioProductos) { this.servicioProductos = servicioProductos; }

  @GetMapping
  public ResponseEntity<Page<Producto>> listar(@RequestParam(required = false) String q, @RequestParam(required = false) String categoria, @RequestParam(required = false) Double minPrecio, @RequestParam(required = false) Double maxPrecio, @RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size, @RequestParam(required = false, defaultValue = "false") Boolean includeInactive) {
    return ResponseEntity.ok(servicioProductos.listar(q, categoria, minPrecio, maxPrecio, page, size, includeInactive));
  }

  @GetMapping("/{id}")
  public ResponseEntity<Producto> obtener(@PathVariable Long id) { return ResponseEntity.ok(servicioProductos.obtener(id)); }

  @PostMapping
  public ResponseEntity<Producto> crear(@RequestHeader(value = "X-Auth-Id", required = false) Long authId, @Valid @RequestBody SolicitudCrearProducto req) { return ResponseEntity.ok(servicioProductos.crear(req, authId)); }

  @PutMapping("/{id}")
  public ResponseEntity<Producto> actualizar(@PathVariable Long id, @Valid @RequestBody SolicitudActualizarProducto req) { return ResponseEntity.ok(servicioProductos.actualizar(id, req)); }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> eliminar(@PathVariable Long id) { servicioProductos.eliminar(id); return ResponseEntity.noContent().build(); }

  @PatchMapping("/{id}/pausar")
  public ResponseEntity<Producto> pausar(@PathVariable Long id) { return ResponseEntity.ok(servicioProductos.pausar(id)); }

  @PatchMapping("/{id}/activar")
  public ResponseEntity<Producto> activar(@PathVariable Long id) { return ResponseEntity.ok(servicioProductos.activar(id)); }

  @PatchMapping("/vendedor/assign-missing")
  public ResponseEntity<java.util.Map<String, Object>> asignarVendedorFaltantes(@RequestHeader(value = "X-Auth-Id", required = false) Long authId) {
    if (authId == null) return ResponseEntity.status(401).body(java.util.Map.of("error", "no_autorizado"));
    int count = servicioProductos.asignarVendedorAFaltantes(authId);
    return ResponseEntity.ok(java.util.Map.of("actualizados", count));
  }
}
