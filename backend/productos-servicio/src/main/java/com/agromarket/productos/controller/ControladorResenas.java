package com.agromarket.productos.controller;

import com.agromarket.productos.domain.ResenaProducto;
import com.agromarket.productos.dto.SolicitudCrearResena;
import com.agromarket.productos.service.ServicioResenas;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/productos/{productoId}/resenas")
public class ControladorResenas {
  private final ServicioResenas servicioResenas;
  public ControladorResenas(ServicioResenas servicioResenas) { this.servicioResenas = servicioResenas; }

  @GetMapping
  public ResponseEntity<List<ResenaProducto>> listar(@PathVariable Long productoId) { return ResponseEntity.ok(servicioResenas.listar(productoId)); }

  @PostMapping
  public ResponseEntity<ResenaProducto> crear(@PathVariable Long productoId, @Valid @RequestBody SolicitudCrearResena req) { return ResponseEntity.ok(servicioResenas.crear(productoId, req)); }
}

