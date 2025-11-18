package com.agromarket.usuarios.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fincas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FincaInfo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private Long agricultorId;
  private String nombre;
  private String ubicacion;
  private String descripcion;
}
