package com.agromarket.usuarios.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "compradores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comprador {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private Long authUsuarioId;
  private String nombre;
  private String telefono;
  @Enumerated(EnumType.STRING)
  private TipoComprador tipo;
}
