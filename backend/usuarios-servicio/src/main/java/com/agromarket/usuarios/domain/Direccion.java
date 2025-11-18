package com.agromarket.usuarios.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "direcciones", indexes = {@Index(name = "idx_direcciones_authUsuarioId", columnList = "authUsuarioId")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Direccion {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false)
  private Long authUsuarioId;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TipoDireccion tipo;
  private String linea1;
  private String linea2;
  private String distrito;
  private String provincia;
  private String departamento;
  private String referencia;
  private Double latitud;
  private Double longitud;
}
