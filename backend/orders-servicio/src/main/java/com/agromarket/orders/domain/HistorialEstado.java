package com.agromarket.orders.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "historial_estado", indexes = {@Index(name = "idx_hist_pedidoId", columnList = "pedidoId")})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HistorialEstado {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false)
  private Long pedidoId;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EstadoPedido estado;
  @Column(nullable = false)
  private Instant timestamp;
  private String nota;
}

