package com.agromarket.inventory.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "inventario")
@Getter
@Setter
public class Inventario {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "producto_id", nullable = false, unique = true)
  private UUID productoId;

  @Column(nullable = false)
  private Integer stockActual = 0;

  @Column(nullable = false)
  private Integer stockMinimo = 0;

  @Column(nullable = false)
  private Integer stockReservado = 0;

  @Column(nullable = false)
  private Instant creadoEn = Instant.now();

  @Column(nullable = false)
  private Instant actualizadoEn = Instant.now();

  @PreUpdate
  public void preUpdate() {
    actualizadoEn = Instant.now();
  }
}
