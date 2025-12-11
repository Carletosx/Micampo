package com.agromarket.usuarios.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "agricultores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agricultor {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private Long authUsuarioId;
  private String nombre;
  @Column(name = "tienda_nombre")
  private String tiendaNombre;
  private String telefono;
  private Double calificacion;
  private Integer ventas;
}
