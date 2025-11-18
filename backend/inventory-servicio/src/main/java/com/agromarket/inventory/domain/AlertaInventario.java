package com.agromarket.inventory.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "alertas_inventario", indexes = {@Index(name = "idx_alerta_productoId", columnList = "productoId")})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AlertaInventario {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false)
  private Long productoId;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private NivelAlerta nivel;
  @Column(nullable = false)
  private String mensaje;
  @Column(nullable = false)
  private Instant creadoEn;
  @Column(nullable = false)
  private Boolean atendida;
}

