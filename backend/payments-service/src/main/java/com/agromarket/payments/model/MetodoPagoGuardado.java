package com.agromarket.payments.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "metodo_pago_guardado")
@Getter
@Setter
public class MetodoPagoGuardado {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "auth_user_id")
  private UUID authUserId;

  @Column(nullable = false)
  private String emailUsuario;

  private String marca;
  private String ultimos4;
  private String tokenizado;

  @Column(nullable = false)
  private Instant creadoEn = Instant.now();
}
