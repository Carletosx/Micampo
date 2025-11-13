package com.agromarket.users.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "direccion")
@Getter
@Setter
public class Direccion {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "auth_user_id", nullable = false)
  private UUID authUserId;

  private String etiqueta;
  private String direccionCompleta;
  private String ciudad;
  private String departamento;
  private String distrito;
  private String referencia;

  @Column(nullable = false)
  private Instant creadoEn = Instant.now();

  @Column(nullable = false)
  private Instant actualizadoEn = Instant.now();

  @PreUpdate
  public void preUpdate() {
    actualizadoEn = Instant.now();
  }
}
