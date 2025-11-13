package com.agromarket.inventory.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "movimiento_inventario")
@Getter
@Setter
public class MovimientoInventario {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "producto_id", nullable = false)
  private UUID productoId;

  @Column(nullable = false)
  private String tipo;

  @Column(nullable = false)
  private Integer cantidad;

  @Column(length = 1000)
  private String referencia;

  @Column(nullable = false)
  private Instant creadoEn = Instant.now();
}
