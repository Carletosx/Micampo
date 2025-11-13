package com.agromarket.orders.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "historial_estado")
@Getter
@Setter
public class HistorialEstado {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "pedido_id", nullable = false)
  private Pedido pedido;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EstadoPedido estado;

  @Column(nullable = false)
  private Instant cambiadoEn = Instant.now();
}
