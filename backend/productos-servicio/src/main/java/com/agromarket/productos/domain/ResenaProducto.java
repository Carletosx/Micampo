package com.agromarket.productos.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "resenas_producto", indexes = {@Index(name = "idx_resenas_producto_producto_id", columnList = "producto_id")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResenaProducto {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "producto_id", nullable = false)
  private Long productoId;
  @Column(name = "autor_auth_id")
  private Long autorAuthId;
  @Column(name = "autor_nombre", length = 120)
  private String autorNombre;
  @Column(nullable = false)
  private Integer calificacion;
  @Column(length = 500)
  private String comentario;
  @Column(nullable = false)
  private Instant creadoEn;
}
