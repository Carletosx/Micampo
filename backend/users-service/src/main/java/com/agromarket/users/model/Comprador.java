package com.agromarket.users.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "comprador")
@Getter
@Setter
public class Comprador {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "auth_user_id", nullable = false, unique = true)
  private UUID authUserId;

  @Column(nullable = false)
  private String email;

  private String nombres;
  private String apellidos;
  private String telefono;

  private String tipo;

  @Column(nullable = false)
  private Instant creadoEn = Instant.now();

  @Column(nullable = false)
  private Instant actualizadoEn = Instant.now();

  @PreUpdate
  public void preUpdate() {
    actualizadoEn = Instant.now();
  }
}
