package com.agromarket.payments.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "metodos_pago")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MetodoPagoGuardado {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false)
  private Long usuarioAuthId;
  @Column(nullable = false)
  private String token;
  private String last4;
  private String marca;
  private Integer expMonth;
  private Integer expYear;
}

