package com.agromarket.usuarios.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "usuarios_perfil", uniqueConstraints = {@UniqueConstraint(name = "uk_perfil_auth_usuario", columnNames = {"auth_usuario_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerfilUsuario {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "auth_usuario_id", nullable = false, unique = true)
  private Long authUsuarioId;

  @Column(length = 120)
  private String nombres;

  @Column(length = 120)
  private String apellidos;

  @Column(length = 20)
  private String dni;

  @Column(length = 30)
  private String telefono;

  @Column(length = 180)
  private String email;

  @Column(length = 255)
  private String direccion;

  @Column(length = 120)
  private String ciudad;

  @Column(length = 120)
  private String departamento;

  @Column(length = 120)
  private String pais;

  @Column(name = "fecha_nacimiento")
  private java.sql.Date fechaNacimiento;

  @Column(length = 12)
  private String genero;

  @Column(name = "avatar_url", length = 512)
  private String avatarUrl;

  @Column(name = "actualizado_en", nullable = false)
  private Instant actualizadoEn;
}
