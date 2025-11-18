package com.agromarket.inventory.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "movimientos_inventario", indexes = {@Index(name = "idx_mov_productoId", columnList = "productoId")})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MovimientoInventario {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false)
  private Long productoId;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TipoMovimiento tipo;
  @Column(nullable = false)
  private Integer cantidad;
  private String nota;
  @Column(nullable = false)
  private Instant timestamp;
}

