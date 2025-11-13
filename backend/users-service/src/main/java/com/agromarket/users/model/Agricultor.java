package com.agromarket.users.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "agricultor")
@Getter
@Setter
public class Agricultor {

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

  @Column
  private Double calificacion = 0.0;

  @Column
  private Integer ventas = 0;

  @OneToOne(mappedBy = "agricultor", cascade = CascadeType.ALL)
  private FincaInfo fincaInfo;

  @Column(nullable = false)
  private Instant creadoEn = Instant.now();

  @Column(nullable = false)
  private Instant actualizadoEn = Instant.now();

  @PreUpdate
  public void preUpdate() {
    actualizadoEn = Instant.now();
  }
}
