package com.agromarket.autenticacion.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private String correo;
  @Column(nullable = false)
  private String contrasenia;
  @Column(nullable = false)
  private String rol;
  @Column(nullable = false)
  private boolean activo;
}
