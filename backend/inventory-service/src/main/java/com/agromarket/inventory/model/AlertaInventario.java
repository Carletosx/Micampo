package com.agromarket.inventory.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "alerta_inventario")
@Getter
@Setter
public class AlertaInventario {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "producto_id", nullable = false)
  private UUID productoId;

  @Column(nullable = false)
  private String nivel;

  @Column(length = 1000)
  private String mensaje;

  @Column(nullable = false)
  private Instant creadoEn = Instant.now();
}
