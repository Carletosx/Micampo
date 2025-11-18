package com.agromarket.payments.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "pagos", indexes = {@Index(name = "idx_pagos_pedidoId", columnList = "pedidoId")})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Pago {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false)
  private Long pedidoId;
  @Column(nullable = false)
  private BigDecimal monto;
  @Column(nullable = false)
  private String moneda;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TipoPago tipo;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PasarelaPago pasarela;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EstadoPago estado;
  private String transaccionId;
  @Column(nullable = false)
  private Instant creadoEn;
}

