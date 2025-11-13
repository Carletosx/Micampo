package com.agromarket.payments.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "pago")
@Getter
@Setter
public class Pago {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false)
  private BigDecimal monto;

  @Column(nullable = false)
  private String moneda;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EstadoPago estado = EstadoPago.PENDIENTE;

  @Column(nullable = false)
  private String pasarela; // STRIPE | YAPE | PLIN

  private String referenciaPasarela;

  @Column(nullable = false)
  private Instant creadoEn = Instant.now();

  @Column(nullable = false)
  private Instant actualizadoEn = Instant.now();

  @PreUpdate
  public void preUpdate() { actualizadoEn = Instant.now(); }
}
