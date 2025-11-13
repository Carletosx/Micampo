package com.agromarket.payments.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transaccion_pasarela")
@Getter
@Setter
public class TransaccionPasarela {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "pago_id", nullable = false)
  private Pago pago;

  @Column(nullable = false)
  private String pasarela;

  @Column(nullable = false)
  private String estado;

  private String referenciaExterna;

  @Column(columnDefinition = "TEXT")
  private String respuestaCruda;

  @Column(nullable = false)
  private Instant creadoEn = Instant.now();
}
