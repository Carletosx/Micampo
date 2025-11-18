package com.agromarket.productos.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "resenas_producto", indexes = {@Index(name = "idx_resenas_producto_productoId", columnList = "productoId")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResenaProducto {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false)
  private Long productoId;
  @Column(nullable = false)
  private Long autorAuthId;
  @Column(nullable = false)
  private Integer calificacion;
  @Column(length = 500)
  private String comentario;
  @Column(nullable = false)
  private Instant creadoEn;
}

