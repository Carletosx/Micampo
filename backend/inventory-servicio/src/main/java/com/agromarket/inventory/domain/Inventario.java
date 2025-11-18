package com.agromarket.inventory.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "inventario", indexes = {@Index(name = "idx_inventario_productoId", columnList = "productoId", unique = true)})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Inventario {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private Long productoId;
  @Column(nullable = false)
  private Integer stockActual;
  @Column(nullable = false)
  private Integer stockMinimo;
  @Column(nullable = false)
  private Integer stockReservado;
  @Column(nullable = false)
  private Instant actualizadoEn;
}

